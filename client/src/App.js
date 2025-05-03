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