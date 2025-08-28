import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TMDB_IMAGE_BASE, fetchPopularMovies, fetchTopRatedMovies, fetchTrendingMovies, fetchGenres, discoverByGenre } from '../../lib/tmdb';

export interface Movie {
  id: string;
  title: string;
  year: number;
  synopsis: string;
  posterUrl: string;
  genreIds: number[];
}

interface MoviesState {
  byId: Record<string, Movie>;
  featured: string[];
  trending: string[];
  recommended: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  genres: { id: number; name: string }[];
  byGenre: Record<number, string[]>;
}

const initialState: MoviesState = {
  byId: {},
  featured: [],
  trending: [],
  recommended: [],
  status: 'idle',
  genres: [],
  byGenre: {}
};

export const loadFeatured = createAsyncThunk('movies/loadFeatured', async () => {
  const data = await fetchPopularMovies();
  return data.results;
});

export const loadTrending = createAsyncThunk('movies/loadTrending', async () => {
  const data = await fetchTrendingMovies();
  return data.results;
});

export const loadRecommended = createAsyncThunk('movies/loadRecommended', async () => {
  const data = await fetchTopRatedMovies();
  return data.results;
});

export const loadGenres = createAsyncThunk('movies/loadGenres', async () => {
  const data = await fetchGenres();
  return data.genres;
});

export const loadGenreMovies = createAsyncThunk('movies/loadGenreMovies', async (genreId: number) => {
  const data = await discoverByGenre(genreId);
  return { genreId, results: data.results };
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFeatured.pending, (state) => { 
        state.status = 'loading'; 
      })
      .addCase(loadFeatured.fulfilled, (state, action) => {
        const ids: string[] = [];
        action.payload.forEach(m => {
          const id = String(m.id);
          state.byId[id] = {
            id,
            title: m.title || m.name || 'Untitled',
            year: m.release_date ? parseInt(m.release_date.slice(0, 4)) : 0,
            synopsis: m.overview || '',
            posterUrl: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : '',
            genreIds: m.genre_ids || []
          };
          ids.push(id);
        });
        state.featured = ids;
        state.status = 'succeeded';
      })
      .addCase(loadTrending.fulfilled, (state, action) => {
        const ids: string[] = [];
        action.payload.forEach(m => {
          const id = String(m.id);
          state.byId[id] = {
            id,
            title: m.title || m.name || 'Untitled',
            year: m.release_date ? parseInt(m.release_date.slice(0, 4)) : 0,
            synopsis: m.overview || '',
            posterUrl: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : '',
            genreIds: m.genre_ids || []
          };
          ids.push(id);
        });
        state.trending = ids;
      })
      .addCase(loadRecommended.fulfilled, (state, action) => {
        const ids: string[] = [];
        action.payload.forEach(m => {
          const id = String(m.id);
          state.byId[id] = {
            id,
            title: m.title || m.name || 'Untitled',
            year: m.release_date ? parseInt(m.release_date.slice(0, 4)) : 0,
            synopsis: m.overview || '',
            posterUrl: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : '',
            genreIds: m.genre_ids || []
          };
          ids.push(id);
        });
        state.recommended = ids;
      })
      .addCase(loadGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
      })
      .addCase(loadGenreMovies.fulfilled, (state, action) => {
        const ids: string[] = [];
        action.payload.results.forEach(m => {
          const id = String(m.id);
          state.byId[id] = {
            id,
            title: m.title || m.name || 'Untitled',
            year: m.release_date ? parseInt(m.release_date.slice(0, 4)) : 0,
            synopsis: m.overview || '',
            posterUrl: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : '',
            genreIds: m.genre_ids || []
          };
          ids.push(id);
        });
        state.byGenre[action.payload.genreId] = ids;
      });
  }
});

export const selectMovieById = (state: { movies: MoviesState }, id: string) => state.movies.byId[id];
export const selectList = (state: { movies: MoviesState }, key: 'featured' | 'trending' | 'recommended') => state.movies[key].map(id => state.movies.byId[id]);

export default moviesSlice.reducer;


