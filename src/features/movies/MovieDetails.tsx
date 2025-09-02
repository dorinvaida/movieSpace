import { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectMovieById } from './moviesSlice';
import { addToWishlist, selectIsWishlisted } from '../wishlist/wishlistSlice';
import styles from './MovieDetails.module.scss';

const MovieDetails = () => {
  const { id = '' } = useParams();
  const dispatch = useAppDispatch();
  const movie = useAppSelector((state) => selectMovieById(state, id));
  const isWishlisted = useAppSelector((state) => selectIsWishlisted(state, id));

  const handleAddToWishlist = useCallback(() => {
    if (movie && !isWishlisted) {
      dispatch(addToWishlist(movie.id));
    }
  }, [dispatch, movie, isWishlisted]);

  if (!movie) {
    return (
      <div style={{ padding: 24 }}>
        <p>Movie not found.</p>
        <Link to="/">Back</Link>
      </div>
    );
  }

  const primaryGenreId = movie.genreIds?.[0];
  const genreClass = primaryGenreId ? styles[`g_${primaryGenreId}`] : '';

  return (
    <div className={`${styles.page} ${genreClass}`}>
      <h1 className={styles.title}>{movie.title} ({movie.year})</h1>
      <div className={styles.layout}>
        <img 
          className={styles.poster} 
          src={movie.posterUrl} 
          alt={`${movie.title} poster`}
          loading="lazy"
          decoding="async"
        />
        <div className={styles.content}>
          <p className={styles.synopsis}>{movie.synopsis}</p>
          <button
            className={`${styles.cta} ${genreClass}`}
            onClick={handleAddToWishlist}
            disabled={isWishlisted}
            aria-disabled={isWishlisted}
          >
            {isWishlisted ? 'Added to wishlist' : 'Add to wishlist'}
          </button>
        </div>
      </div>
      <div className={styles.back}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
};

export default MovieDetails;


