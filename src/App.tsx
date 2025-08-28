import { Outlet, Route, Routes } from 'react-router-dom';
import Carousel from './components/Carousel';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { loadGenres, loadGenreMovies } from './features/movies/moviesSlice';
import { hasTmdbKey } from './lib/tmdb';
import { useEffect } from 'react';
import styles from './Home.module.scss';
import WishlistDropdown from './components/WishlistDropdown';
import MovieDetails from './features/movies/MovieDetails';
import WishlistPage from './features/wishlist/WishlistPage';

function Home() {
  const dispatch = useAppDispatch();
  const genres = useAppSelector((state) => state.movies.genres);
  const byGenre = useAppSelector((state) => state.movies.byGenre);
  const byId = useAppSelector((state) => state.movies.byId);
  const status = useAppSelector((state) => state.movies.status);

  useEffect(() => {
    if (hasTmdbKey()) {
      dispatch(loadGenres());
    }
  }, [dispatch]);

  useEffect(() => {
    if (hasTmdbKey() && genres.length > 0) {
      const topThree = genres.slice(0, 3);
      topThree.forEach(g => {
        if (!byGenre[g.id]) {
          dispatch(loadGenreMovies(g.id));
        }
      });
    }
  }, [dispatch, genres, byGenre]);

  if (status === 'loading' && genres.length === 0) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Movie space</h1>
          <WishlistDropdown />
        </header>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h2>Loading movies...</h2>
        </div>
      </div>
    );
  }

  const topThreeGenres = genres.slice(0, 3);
  const hasMovieData = topThreeGenres.some(g => byGenre[g.id] && byGenre[g.id].length > 0);
  const loadingGenres = topThreeGenres.filter(g => !byGenre[g.id] || byGenre[g.id].length === 0);

  if (!hasMovieData) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Movie space</h1>
          <WishlistDropdown />
        </header>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h2>Loading movie data...</h2>
          {loadingGenres.length > 0 && (
            <p>Loading movies for: {loadingGenres.map(g => g.name).join(', ')}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Movie space</h1>
        <WishlistDropdown />
      </header>

      {topThreeGenres.map((g) => {
        const items = (byGenre[g.id] || []).map((id: string) => byId[id]).filter(Boolean);
        if (items.length === 0) return null;
        return <Carousel key={g.id} title={g.name} items={items} />;
      })}
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
      <Outlet />
    </div>
  );
}


