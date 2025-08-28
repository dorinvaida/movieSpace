export interface Genre { id: number; name: string }

export interface Movie {
  id: string;
  title: string;
  year: number;
  synopsis: string;
  posterUrl: string;
  genreIds: number[];
}


