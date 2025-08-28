import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectWishlist, removeFromWishlist } from './wishlistSlice';
import styles from './WishlistPage.module.scss';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlist = useAppSelector(selectWishlist);
  const byId = useAppSelector((state) => state.movies.byId);

  const wishlistMovies = wishlist
    .map(id => byId[id])
    .filter(Boolean);

  const handleRemove = (movieId: string) => {
    dispatch(removeFromWishlist(movieId));
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Wishlist</h1>
        <Link to="/" className={styles.backLink}>← Back to Home</Link>
      </header>

      {wishlistMovies.length === 0 ? (
        <div className={styles.empty}>
          <p>No movies in your wishlist yet.</p>
          <Link to="/" className={styles.browseLink}>Browse movies</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {wishlistMovies.map(movie => (
            <div key={movie.id} className={styles.card}>
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className={styles.poster}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.content}>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                <p className={styles.year}>{movie.year}</p>
                <button
                  onClick={() => handleRemove(movie.id)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
