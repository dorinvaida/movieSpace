const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined;
const API_BASE = 'https://api.themoviedb.org/3';
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

export interface TMDBGenre { id: number; name: string }
export interface TMDBGenreListResponse { genres: TMDBGenre[] }

export function hasTmdbKey(): boolean {
  return Boolean(API_KEY);
}

async function tmdbFetch<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  url.searchParams.set('api_key', API_KEY as string);
  
  Object.entries(params).forEach(([k, v]) => {
    url.searchParams.set(k, String(v));
  });
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

export async function fetchTrendingMovies(): Promise<TMDBListResponse<TMDBMovie>> {
  if (!API_KEY) return { results: [] };
  return tmdbFetch<TMDBListResponse<TMDBMovie>>('/trending/movie/week');
}

export async function fetchPopularMovies(): Promise<TMDBListResponse<TMDBMovie>> {
  if (!API_KEY) return { results: [] };
  return tmdbFetch<TMDBListResponse<TMDBMovie>>('/movie/popular');
}

export async function fetchTopRatedMovies(): Promise<TMDBListResponse<TMDBMovie>> {
  if (!API_KEY) return { results: [] };
  return tmdbFetch<TMDBListResponse<TMDBMovie>>('/movie/top_rated');
}

export async function fetchMovieDetails(id: string | number): Promise<TMDBMovie> {
  if (!API_KEY) return {} as TMDBMovie;
  return tmdbFetch<TMDBMovie>(`/movie/${id}`);
}

export async function fetchGenres(): Promise<TMDBGenreListResponse> {
  if (!API_KEY) return { genres: [] };
  return tmdbFetch<TMDBGenreListResponse>('/genre/movie/list');
}

export async function discoverByGenre(genreId: number): Promise<TMDBListResponse<TMDBMovie>> {
  if (!API_KEY) return { results: [] };
  return tmdbFetch<TMDBListResponse<TMDBMovie>>('/discover/movie', { with_genres: genreId });
}


