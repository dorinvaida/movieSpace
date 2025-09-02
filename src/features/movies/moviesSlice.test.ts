import { configureStore } from '@reduxjs/toolkit';
import moviesReducer, { 
  setGenres, 
  setGenreMovies, 
  setStatus,
  selectMovieById,
  selectGenres,
  selectGenreMovies,
  selectStatus
} from './moviesSlice';
import { Movie, Genre } from '../../types';

const mockStore = () => configureStore({
  reducer: {
    movies: moviesReducer
  }
});

describe('moviesSlice', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore();
  });

  describe('actions', () => {
    it('should set genres', () => {
      const mockGenres: Genre[] = [
        { id: 28, name: 'Action' },
        { id: 35, name: 'Comedy' }
      ];

      store.dispatch(setGenres(mockGenres));

      const state = store.getState().movies;
      expect(state.genres).toEqual(mockGenres);
    });

    it('should set genre movies', () => {
      const mockMovies: Movie[] = [
        {
          id: '1',
          title: 'Test Movie',
          year: 2023,
          synopsis: 'Test overview',
          posterUrl: 'https://image.tmdb.org/t/p/w500/test.jpg',
          genreIds: [28]
        }
      ];

      store.dispatch(setGenreMovies({ genreId: 28, movies: mockMovies }));

      const state = store.getState().movies;
      expect(state.byGenre[28]).toEqual(['1']);
      expect(state.byId['1']).toEqual(mockMovies[0]);
    });

    it('should set status', () => {
      store.dispatch(setStatus('loading'));
      expect(store.getState().movies.status).toBe('loading');

      store.dispatch(setStatus('succeeded'));
      expect(store.getState().movies.status).toBe('succeeded');
    });
  });

  describe('selectors', () => {
    beforeEach(() => {
      const mockMovies: Movie[] = [
        {
          id: '1',
          title: 'Test Movie',
          year: 2023,
          synopsis: 'Test overview',
          posterUrl: 'https://image.tmdb.org/t/p/w500/test.jpg',
          genreIds: [28]
        }
      ];

      store.dispatch(setGenreMovies({ genreId: 28, movies: mockMovies }));
      store.dispatch(setGenres([{ id: 28, name: 'Action' }]));
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

    it('should select genres', () => {
      const genres = selectGenres(store.getState());
      expect(genres).toEqual([{ id: 28, name: 'Action' }]);
    });

    it('should select genre movies', () => {
      const movies = selectGenreMovies(store.getState(), 28);
      expect(movies).toHaveLength(1);
      expect(movies[0].title).toBe('Test Movie');
    });

    it('should select status', () => {
      const status = selectStatus(store.getState());
      expect(status).toBe('idle');
    });
  });
});
