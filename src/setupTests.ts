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

jest.mock('./hooks/useTmdbWithRedux', () => ({
  useTopGenresWithMovies: jest.fn().mockReturnValue({
    genres: [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' }
    ],
    genreMovies: [
      {
        genre: { id: 28, name: 'Action' },
        movies: [
          { id: '1', title: 'Test Movie 1', posterUrl: 'test1.jpg' },
          { id: '2', title: 'Test Movie 2', posterUrl: 'test2.jpg' }
        ]
      }
    ],
    hasMovieData: true,
    loadingGenres: [],
    loading: false,
    status: 'succeeded'
  })
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
