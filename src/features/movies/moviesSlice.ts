import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie, Genre } from '../../types';

interface MoviesState {
  byId: Record<string, Movie>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  genres: Genre[];
  byGenre: Record<number, string[]>;
}

const initialState: MoviesState = {
  byId: {},
  status: 'idle',
  genres: [],
  byGenre: {}
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setStatus: (state, action: PayloadAction<'idle' | 'loading' | 'succeeded' | 'failed'>) => {
      state.status = action.payload;
    },
    setGenres: (state, action: PayloadAction<Genre[]>) => {
      state.genres = action.payload;
    },
    setGenreMovies: (state, action: PayloadAction<{ genreId: number; movies: Movie[] }>) => {
      const { genreId, movies } = action.payload;
      const ids: string[] = [];
      
      movies.forEach(movie => {
        state.byId[movie.id] = movie;
        ids.push(movie.id);
      });
      
      state.byGenre[genreId] = ids;
    },
    addMovie: (state, action: PayloadAction<Movie>) => {
      state.byId[action.payload.id] = action.payload;
    }
  }
});

export const { setStatus, setGenres, setGenreMovies, addMovie } = moviesSlice.actions;

export const selectMovieById = (state: { movies: MoviesState }, id: string) => state.movies.byId[id];
export const selectGenres = (state: { movies: MoviesState }) => state.movies.genres;
export const selectGenreMovies = (state: { movies: MoviesState }, genreId: number) => {
  const movieIds = state.movies.byGenre[genreId] || [];
  return movieIds.map(id => state.movies.byId[id]).filter(Boolean);
};
export const selectStatus = (state: { movies: MoviesState }) => state.movies.status;
export const selectByGenre = (state: { movies: MoviesState }) => state.movies.byGenre;
export const selectById = (state: { movies: MoviesState }) => state.movies.byId;

export default moviesSlice.reducer;


