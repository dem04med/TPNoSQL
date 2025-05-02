import React from 'react';

function MovieList({ movies, onMovieSelect, loading }) {
  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  if (!movies || movies.length === 0) {
    return <div className="no-movies">No movies found</div>;
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <div 
          key={movie._id} 
          className="movie-card"
          onClick={() => onMovieSelect(movie._id)}
        >
          <div className="movie-poster">
            {movie.poster ? (
              <img 
                src={movie.poster} 
                alt={`${movie.title} poster`} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150x225?text=No+Image';
                }}
              />
            ) : (
              <div className="no-poster">No Image</div>
            )}
          </div>
          <div className="movie-info">
            <h3>{movie.title}</h3>
            <p className="movie-year">{movie.year}</p>
            {movie.plot && <p className="movie-plot">{movie.plot.substring(0, 100)}...</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieList;