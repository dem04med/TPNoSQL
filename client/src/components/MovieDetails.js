import React, { useState } from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';

function MovieDetails({ movie, comments: initialComments, onBack }) {
  const [comments, setComments] = useState(initialComments || []);
  
  if (!movie) {
    return <div className="loading">Loading movie details...</div>;
  }

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
  };
  
  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
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
        <CommentForm movieId={movie._id} onCommentAdded={handleCommentAdded} />
        
        <h3>Comments ({comments.length})</h3>
        {comments.length > 0 ? (
          <div className="comments-list">
            {comments.map((comment) => (
              <Comment 
                key={comment._id} 
                comment={comment} 
                onDelete={handleCommentDeleted} 
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