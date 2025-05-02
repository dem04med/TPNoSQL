import React, { useState } from 'react';

function Comment({ comment, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  
  // Format date - convert to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleDelete = async () => {
    // Confirm deletion
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5001/api/movies/comments/${comment._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      // Notify parent component
      if (onDelete) {
        onDelete(comment._id);
      }
      
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="comment comment-error">
        <div className="error-message">Error: {error}</div>
        <button onClick={() => setError(null)} className="retry-button">
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="comment">
      <div className="comment-header">
        <span className="comment-name">{comment.name}</span>
        <span className="comment-date">{formatDate(comment.date)}</span>
      </div>
      <div className="comment-text">{comment.text}</div>
      <div className="comment-actions">
        <button 
          onClick={handleDelete} 
          disabled={isDeleting}
          className="delete-button"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default Comment;