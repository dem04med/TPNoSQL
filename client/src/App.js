import React, { useState, useEffect } from 'react';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import './index.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const API_URL = '/api';

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/movies?page=${page}&limit=20`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      
      const data = await response.json();
      setMovies(data.movies);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleMovieSelect = async (movieId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/movies/${movieId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      
      const data = await response.json();
      setSelectedMovie(data.movie);
      setComments(data.comments);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedMovie(null);
    setComments([]);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  // Comment Operations
  const handleAddComment = async (movieId, commentData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/movies/${movieId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      const newComment = await response.json();
      setComments(prevComments => [...prevComments, newComment]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId, commentData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/movies/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      
      const updatedComment = await response.json();
      
      setComments(prevComments => 
        prevComments.map(comment => 
          comment._id === commentId ? updatedComment : comment
        )
      );
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this comment?')) {
        return;
      }
      
      setLoading(true);
      const response = await fetch(`${API_URL}/movies/comments/${commentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      
      setComments(prevComments => 
        prevComments.filter(comment => comment._id !== commentId)
      );
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="app">
      <header>
        <h1>MFlix Movie Database</h1>
      </header>
      
      <main>
        {selectedMovie ? (
          <MovieDetails 
            movie={selectedMovie} 
            comments={comments} 
            onBack={handleBackToList}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
        ) : (
          <>
            <MovieList 
              movies={movies} 
              onMovieSelect={handleMovieSelect} 
              loading={loading} 
            />
            
            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={page === 0 || loading}
              >
                Previous
              </button>
              <span>Page {page + 1} of {totalPages}</span>
              <button 
                onClick={handleNextPage} 
                disabled={page >= totalPages - 1 || loading}
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;