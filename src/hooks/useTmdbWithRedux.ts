import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setGenres, setGenreMovies, setStatus } from '../features/movies/moviesSlice';
import { Genre, Movie, TMDBMovie, TMDBListResponse, TMDBGenreListResponse } from '../types';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const API_BASE = 'https://api.themoviedb.org/3';

const tmdbFetch = async <T>(path: string, params: Record<string, string | number> = {}): Promise<T> => {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured');
  }
  
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set('api_key', API_KEY);
  
  Object.entries(params).forEach(([k, v]) => {
    url.searchParams.set(k, String(v));
  });
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
};

const transformTmdbMovie = (tmdbMovie: TMDBMovie): Movie => {
  const releaseYear = tmdbMovie.release_date 
    ? new Date(tmdbMovie.release_date).getFullYear()
    : new Date().getFullYear();
    
  return {
    id: String(tmdbMovie.id),
    title: tmdbMovie.title || tmdbMovie.name || 'Unknown Title',
    year: releaseYear,
    synopsis: tmdbMovie.overview || 'No synopsis available',
    posterUrl: tmdbMovie.poster_path 
      ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
      : '/placeholder-poster.jpg',
    genreIds: tmdbMovie.genre_ids || []
  };
};

const transformTmdbGenre = (tmdbGenre: { id: number; name: string }): Genre => ({
  id: tmdbGenre.id,
  name: tmdbGenre.name
});

export const useTopGenresWithMovies = (count: number = 3) => {
  const dispatch = useAppDispatch();
  const genres = useAppSelector((state) => state.movies.genres);
  const byGenre = useAppSelector((state) => state.movies.byGenre);
  const byId = useAppSelector((state) => state.movies.byId);
  const status = useAppSelector((state) => state.movies.status);

  const topGenres = genres.slice(0, count);
  const hasMovieData = topGenres.some(g => byGenre[g.id] && byGenre[g.id].length > 0);
  const loadingGenres = topGenres.filter(g => !byGenre[g.id] || byGenre[g.id].length === 0);
  const loading = status === 'loading' && genres.length === 0;

  useEffect(() => {
    if (Boolean(API_KEY) && genres.length === 0) {
      const fetchGenres = async () => {
        try {
          dispatch(setStatus('loading'));
          const tmdbData = await tmdbFetch<TMDBGenreListResponse>('/genre/movie/list');
          const transformedGenres = tmdbData.genres.map(transformTmdbGenre);
          dispatch(setGenres(transformedGenres));
          dispatch(setStatus('succeeded'));
        } catch (error) {
          console.error('Error fetching genres:', error);
          dispatch(setStatus('failed'));
        }
      };
      
      fetchGenres();
    }
  }, [dispatch, genres.length]);

  useEffect(() => {
    if (Boolean(API_KEY) && genres.length > 0) {
      topGenres.forEach(g => {
        if (!byGenre[g.id]) {
          const fetchGenreMovies = async () => {
            try {
              const tmdbData = await tmdbFetch<TMDBListResponse<TMDBMovie>>('/discover/movie', { with_genres: g.id });
              const transformedMovies = tmdbData.results.map(transformTmdbMovie);
              dispatch(setGenreMovies({ genreId: g.id, movies: transformedMovies }));
            } catch (error) {
              console.error(`Failed to fetch genre movies for ${g.name}:`, error);
            }
          };
          
          fetchGenreMovies();
        }
      });
    }
  }, [dispatch, genres, byGenre, topGenres]);

  const genreMovies = topGenres.map(g => ({
    genre: g,
    movies: (byGenre[g.id] || []).map((id: string) => byId[id]).filter(Boolean)
  }));

  return {
    genres: topGenres,
    genreMovies,
    hasMovieData,
    loadingGenres,
    loading,
    status
  };
};
