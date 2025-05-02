import React, { useState } from 'react';

function CommentForm({ movieId, onCommentAdded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError("Comment text is required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5001/api/movies/${movieId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name || 'Anonymous',
          email,
          text,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const newComment = await response.json();
      
      // Clear form
      setName('');
      setEmail('');
      setText('');
      
      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-form-container">
      <h3>Add a Comment</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="name">Name (optional)</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Anonymous"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email (optional)</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="text">Comment *</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows="4"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? 'Submitting...' : 'Add Comment'}
        </button>
      </form>
    </div>
  );
}

export default CommentForm;