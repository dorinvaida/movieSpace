export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export const fetchGenres = jest.fn().mockResolvedValue([
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' }
]);

export const fetchPopularMovies = jest.fn().mockResolvedValue([
  { id: '1', title: 'Test Movie 1', posterUrl: 'test1.jpg' },
  { id: '2', title: 'Test Movie 2', posterUrl: 'test2.jpg' }
]);

export const fetchTopRatedMovies = jest.fn().mockResolvedValue([
  { id: '3', title: 'Top Movie 1', posterUrl: 'top1.jpg' },
  { id: '4', title: 'Top Movie 2', posterUrl: 'top2.jpg' }
]);

export const fetchTrendingMovies = jest.fn().mockResolvedValue([
  { id: '5', title: 'Trending Movie 1', posterUrl: 'trend1.jpg' },
  { id: '6', title: 'Trending Movie 2', posterUrl: 'trend2.jpg' }
]);

export const discoverByGenre = jest.fn().mockResolvedValue([
  { id: '7', title: 'Genre Movie 1', posterUrl: 'genre1.jpg' },
  { id: '8', title: 'Genre Movie 2', posterUrl: 'genre2.jpg' }
]);

export const fetchMovieDetails = jest.fn().mockResolvedValue({
  id: '1',
  title: 'Test Movie',
  overview: 'Test overview',
  posterUrl: 'test.jpg',
  genres: [{ id: 28, name: 'Action' }]
});

export const hasTmdbKey = jest.fn().mockReturnValue(true);
