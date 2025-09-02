import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectWishlist } from '../features/wishlist/wishlistSlice';
import styles from './WishlistDropdown.module.scss';

const WishlistDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const wishlist = useAppSelector(selectWishlist);
  const byId = useAppSelector((state) => state.movies.byId);

  const wishlistItems = useMemo(() => {
    return wishlist
      .map(id => byId[id])
      .filter(Boolean)
      .slice(0, 3);
  }, [wishlist, byId]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={`${styles.wishlistDropdown} ${styles.dropdown}`}>
      <button
        className={styles.trigger}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-label={`Wishlist (${wishlist.length} items)`}
      >
        <span className={styles.icon}>❤️</span>
        {wishlist.length > 0 && (
          <span className={styles.badge}>{wishlist.length}</span>
        )}
      </button>

      {isOpen && (
        <div className={styles.menu}>
          {wishlistItems.length > 0 ? (
            <>
              {wishlistItems.map(movie => (
                <div key={movie.id} className={styles.item}>
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className={styles.thumbnail}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={styles.title}>{movie.title}</span>
                </div>
              ))}
              {wishlist.length > 3 && (
                <div className={styles.more}>
                  +{wishlist.length - 3} more
                </div>
              )}
              <Link to="/wishlist" className={styles.viewAll}>
                View all ({wishlist.length})
              </Link>
            </>
          ) : (
            <div className={styles.empty}>
              No movies in wishlist
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WishlistDropdown;
