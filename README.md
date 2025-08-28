# Movie Browsing Application

## Installation

### Prerequisites
- Node.js 18+
- npm 9+
- TMDB API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd project
   npm install
   ```

2. **Set up environment variables**
   ```bash
   echo "VITE_TMDB_API_KEY=your_tmdb_api_key_here" > .env
   ```
   Replace `your_tmdb_api_key_here` with your actual TMDB API key.

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

### Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

### Tech Stack
- React 18 + TypeScript
- Redux Toolkit + React Router
- SCSS Modules + Jest Testing
- Vite + TMDB API
