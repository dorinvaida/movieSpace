import { Route, Routes } from 'react-router-dom';
import Carousel from './components/Carousel';
import styles from './Home.module.scss';
import PageHeader from './components/PageHeader';
import LoadingState from './components/LoadingState';
import MovieDetails from './features/movies/MovieDetails';
import WishlistPage from './features/wishlist/WishlistPage';
import { useTopGenresWithMovies } from './hooks/useTmdbWithRedux';

const Home = () => {
  const { 
    genreMovies, 
    hasMovieData, 
    loadingGenres, 
    loading
  } = useTopGenresWithMovies(3);

  if (loading) {
    return (
      <div className={styles.container}>
        <PageHeader />
        <LoadingState message="Loading movies..." />
      </div>
    );
  }

  if (!hasMovieData) {
    return (
      <div className={styles.container}>
        <PageHeader />
        <LoadingState 
          message="Loading movie data..." 
          subtitle={loadingGenres.length > 0 ? `Loading movies for: ${loadingGenres.map(g => g.name).join(', ')}` : undefined}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PageHeader />

      {genreMovies.map(({ genre, movies }) => {
        if (movies.length === 0) return null;
        return <Carousel key={genre.id} title={genre.name} items={movies} />;
      })}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </div>
  );
};

export default App;


