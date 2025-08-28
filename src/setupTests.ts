import '@testing-library/jest-dom';

const mockImportMeta = {
  env: {
    VITE_TMDB_API_KEY: 'test-api-key'
  }
};

Object.defineProperty(global, 'import', {
  value: { meta: mockImportMeta },
  writable: true,
  configurable: true
});

Object.defineProperty(window, 'import', {
  value: { meta: mockImportMeta },
  writable: true,
  configurable: true
});

jest.mock('./lib/tmdb', () => ({
  TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p/w500',
  fetchGenres: jest.fn().mockResolvedValue([
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' }
  ]),
  fetchPopularMovies: jest.fn().mockResolvedValue([
    { id: '1', title: 'Test Movie 1', posterUrl: 'test1.jpg' },
    { id: '2', title: 'Test Movie 2', posterUrl: 'test2.jpg' }
  ]),
  fetchTopRatedMovies: jest.fn().mockResolvedValue([
    { id: '3', title: 'Top Movie 1', posterUrl: 'top1.jpg' },
    { id: '4', title: 'Top Movie 2', posterUrl: 'top2.jpg' }
  ]),
  fetchTrendingMovies: jest.fn().mockResolvedValue([
    { id: '5', title: 'Trending Movie 1', posterUrl: 'trend1.jpg' },
    { id: '6', title: 'Trending Movie 2', posterUrl: 'trend2.jpg' }
  ]),
  discoverByGenre: jest.fn().mockResolvedValue([
    { id: '7', title: 'Genre Movie 1', posterUrl: 'genre1.jpg' },
    { id: '8', title: 'Genre Movie 2', posterUrl: 'genre2.jpg' }
  ]),
  fetchMovieDetails: jest.fn().mockResolvedValue({
    id: '1',
    title: 'Test Movie',
    overview: 'Test overview',
    posterUrl: 'test.jpg',
    genres: [{ id: 28, name: 'Action' }]
  }),
  hasTmdbKey: jest.fn().mockReturnValue(true)
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}

global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
