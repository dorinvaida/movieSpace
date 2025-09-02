export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  release_date?: string;
  overview?: string;
  poster_path?: string | null;
  genre_ids?: number[];
}

export interface TMDBListResponse<T> {
  results: T[];
}

export interface TMDBGenre { 
  id: number; 
  name: string; 
}

export interface TMDBGenreListResponse { 
  genres: TMDBGenre[]; 
}

export interface Genre { 
  id: number; 
  name: string; 
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  synopsis: string;
  posterUrl: string;
  genreIds: number[];
}

export const transformTmdbMovie = (tmdbMovie: TMDBMovie): Movie => {
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

export const transformTmdbGenre = (tmdbGenre: TMDBGenre): Genre => ({
  id: tmdbGenre.id,
  name: tmdbGenre.name
});


