import React, { useState } from 'react';
import Comment from './Comment';

function MovieDetails({ movie, comments, onBack, onAddComment, onEditComment, onDeleteComment }) {
  const [newComment, setNewComment] = useState({ name: '', text: '' });
  const [isAddingComment, setIsAddingComment] = useState(false);
  
  if (!movie) {
    return <div className="loading">Loading movie details...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newComment.name.trim() || !newComment.text.trim()) {
      alert("Please enter both your name and comment");
      return;
    }
    
    onAddComment(movie._id, newComment);
    
    // Reset form
    setNewComment({ name: '', text: '' });
    setIsAddingComment(false);
  };
  
  return (
    <div className="movie-details">
      <button className="back-button" onClick={onBack}>
        &larr; Back to Movies
      </button>
      
      <div className="movie-header">
        <div className="movie-poster-large">
          {movie.poster ? (
            <img 
              src={movie.poster} 
              alt={`${movie.title} poster`} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
          ) : (
            <div className="no-poster-large">No Image Available</div>
          )}
        </div>
        
        <div className="movie-info-detailed">
          <h2>{movie.title}</h2>
          <p className="movie-year"><strong>Year:</strong> {movie.year}</p>
          
          {movie.runtime && (
            <p><strong>Runtime:</strong> {movie.runtime} min</p>
          )}
          
          {movie.genres && movie.genres.length > 0 && (
            <p><strong>Genres:</strong> {movie.genres.join(', ')}</p>
          )}
          
          {movie.directors && movie.directors.length > 0 && (
            <p><strong>Director(s):</strong> {movie.directors.join(', ')}</p>
          )}
          
          {movie.cast && movie.cast.length > 0 && (
            <p><strong>Cast:</strong> {movie.cast.slice(0, 5).join(', ')}{movie.cast.length > 5 ? '...' : ''}</p>
          )}
          
          {movie.plot && (
            <div className="movie-plot">
              <h3>Plot</h3>
              <p>{movie.plot}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="comments-section">
        <div className="comments-header">
          <h3>Comments ({comments.length})</h3>
          <button 
            className="add-comment-btn"
            onClick={() => setIsAddingComment(!isAddingComment)}
          >
            {isAddingComment ? 'Cancel' : 'Add Comment'}
          </button>
        </div>
        
        {isAddingComment && (
          <div className="add-comment-form">
            <form onSubmit={handleSubmitComment}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newComment.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="text">Comment:</label>
                <textarea
                  id="text"
                  name="text"
                  value={newComment.text}
                  onChange={handleInputChange}
                  placeholder="Write your comment here"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">Submit Comment</button>
            </form>
          </div>
        )}
        
        {comments.length > 0 ? (
          <div className="comments-list">
            {comments.map((comment) => (
              <Comment 
                key={comment._id} 
                comment={comment} 
                onEdit={onEditComment}
                onDelete={onDeleteComment}
              />
            ))}
          </div>
        ) : (
          <p className="no-comments">No comments for this movie.</p>
        )}
      </div>
    </div>
  );
}

export default MovieDetails;