import { configureStore } from '@reduxjs/toolkit';
import moviesReducer, { 
  loadGenres, 
  loadGenreMovies, 
  selectMovieById
} from './moviesSlice';

jest.mock('../../lib/tmdb', () => ({
  fetchGenres: jest.fn(),
  discoverByGenre: jest.fn(),
  hasTmdbKey: () => true,
  TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p/w500'
}));

const mockStore = () => configureStore({
  reducer: {
    movies: moviesReducer
  }
});

describe('moviesSlice', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore();
    jest.clearAllMocks();
  });

  describe('loadGenres', () => {
    it('should load genres successfully', async () => {
      const mockGenres = [
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' }
      ];

      const { fetchGenres } = require('../../lib/tmdb');
      fetchGenres.mockResolvedValue({ genres: mockGenres });

      await store.dispatch(loadGenres());

      const state = store.getState().movies;
      expect(state.genres).toEqual(mockGenres);
    });
  });

  describe('loadGenreMovies', () => {
    it('should load genre movies successfully', async () => {
      const mockMovies = [
        {
          id: 1,
          title: 'Test Movie',
          release_date: '2023-01-01',
          overview: 'Test overview',
          poster_path: '/test.jpg',
          genre_ids: [28]
        }
      ];

      const { discoverByGenre } = require('../../lib/tmdb');
      discoverByGenre.mockResolvedValue({ results: mockMovies });

      await store.dispatch(loadGenreMovies(28));

      const state = store.getState().movies;
      expect(state.byGenre[28]).toEqual(['1']);
      expect(state.byId['1']).toEqual({
        id: '1',
        title: 'Test Movie',
        year: 2023,
        synopsis: 'Test overview',
        posterUrl: 'https://image.tmdb.org/t/p/w500/test.jpg',
        genreIds: [28]
      });
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      store.dispatch({
        type: 'movies/loadGenreMovies/fulfilled',
        payload: {
          genreId: 28,
          results: [{
            id: 1,
            title: 'Test Movie',
            release_date: '2023-01-01',
            overview: 'Test overview',
            poster_path: '/test.jpg',
            genre_ids: [28]
          }]
        }
      });
    });

    it('should select movie by id', () => {
      const movie = selectMovieById(store.getState(), '1');
      expect(movie).toEqual({
        id: '1',
        title: 'Test Movie',
        year: 2023,
        synopsis: 'Test overview',
        posterUrl: 'https://image.tmdb.org/t/p/w500/test.jpg',
        genreIds: [28]
      });
    });
  });
});
