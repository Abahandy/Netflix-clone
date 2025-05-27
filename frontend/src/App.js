import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Header, 
  HeroSection, 
  ContentRow, 
  MovieModal,
  LoadingSpinner 
} from './components';
import './App.css';

// TMDB API Configuration
const TMDB_API_KEYS = [
  'c8dea14dc917687ac631a52620e4f7ad',
  '3cb41ecea3bf606c56552db3d17adefd'
];
let currentKeyIndex = 0;

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Netflix Content Categories
const CONTENT_CATEGORIES = [
  { id: 'trending', title: 'Trending Now', endpoint: '/trending/all/day' },
  { id: 'popular-movies', title: 'Popular Movies', endpoint: '/movie/popular' },
  { id: 'top-rated', title: 'Top Rated', endpoint: '/movie/top_rated' },
  { id: 'netflix-originals', title: 'Netflix Originals', endpoint: '/discover/tv?with_networks=213' },
  { id: 'action', title: 'Action Movies', endpoint: '/discover/movie?with_genres=28' },
  { id: 'comedy', title: 'Comedy Movies', endpoint: '/discover/movie?with_genres=35' },
  { id: 'horror', title: 'Horror Movies', endpoint: '/discover/movie?with_genres=27' },
  { id: 'romance', title: 'Romance Movies', endpoint: '/discover/movie?with_genres=10749' },
  { id: 'documentaries', title: 'Documentaries', endpoint: '/discover/movie?with_genres=99' }
];

const NetflixClone = () => {
  const [heroContent, setHeroContent] = useState(null);
  const [contentRows, setContentRows] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Helper function with key rotation
  const fetchFromTMDB = async (endpoint, retryCount = 0) => {
    const apiKey = TMDB_API_KEYS[currentKeyIndex];
    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      
      if (response.status === 429 && retryCount < TMDB_API_KEYS.length - 1) {
        // Rate limited, try next API key
        currentKeyIndex = (currentKeyIndex + 1) % TMDB_API_KEYS.length;
        console.log(`Rate limited, switching to API key index: ${currentKeyIndex}`);
        return fetchFromTMDB(endpoint, retryCount + 1);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('TMDB API error:', error);
      throw error;
    }
  };

  // Get video/trailer for content
  const getContentVideos = async (contentId, mediaType = 'movie') => {
    try {
      const data = await fetchFromTMDB(`/${mediaType}/${contentId}/videos`);
      const trailer = data.results?.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailer?.key || null;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return null;
    }
  };

  // Enhanced content processing
  const processContent = (item) => {
    const isMovie = item.media_type === 'movie' || item.title;
    return {
      id: item.id,
      title: isMovie ? item.title : item.name,
      overview: item.overview,
      backdrop: item.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${item.backdrop_path}` : null,
      poster: item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : null,
      rating: item.vote_average,
      releaseDate: isMovie ? item.release_date : item.first_air_date,
      mediaType: isMovie ? 'movie' : 'tv',
      originalData: item
    };
  };

  // Load all content
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
        // Load hero content (trending)
        const trendingData = await fetchFromTMDB('/trending/all/day');
        if (trendingData?.results?.length > 0) {
          const heroItem = trendingData.results[0];
          const processedHero = processContent(heroItem);
          
          // Get trailer for hero content
          const trailerKey = await getContentVideos(heroItem.id, heroItem.media_type);
          processedHero.trailerKey = trailerKey;
          
          setHeroContent(processedHero);
        }

        // Load content rows
        const rowPromises = CONTENT_CATEGORIES.map(async (category) => {
          try {
            const data = await fetchFromTMDB(category.endpoint);
            const processedResults = data.results?.slice(0, 20).map(processContent) || [];
            return { [category.id]: { ...category, content: processedResults } };
          } catch (error) {
            console.error(`Error loading ${category.title}:`, error);
            // Return mock data on error
            return { [category.id]: { ...category, content: getMockContent(category.id) } };
          }
        });

        const rowResults = await Promise.all(rowPromises);
        const combinedRows = rowResults.reduce((acc, row) => ({ ...acc, ...row }), {});
        setContentRows(combinedRows);

      } catch (error) {
        console.error('Error loading content:', error);
        setError('Failed to load content. Using fallback data.');
        // Load mock data as fallback
        setHeroContent(getMockHeroContent());
        setContentRows(getMockContentRows());
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  // Mock data fallback
  const getMockHeroContent = () => ({
    id: 1,
    title: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    backdrop: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    poster: "https://image.tmdb.org/t/p/original/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    rating: 8.7,
    releaseDate: "2016-07-15",
    mediaType: "tv",
    trailerKey: "b9EkMc79ZSU"
  });

  const getMockContent = (categoryId) => {
    const mockMovies = [
      { id: 1, title: "The Dark Knight", overview: "Batman faces the Joker.", backdrop: "https://image.tmdb.org/t/p/original/hqkIcbrOHL86UncnHIsHVcVmzue.jpg", poster: "https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg", rating: 9.0, releaseDate: "2008-07-18", mediaType: "movie" },
      { id: 2, title: "Inception", overview: "A thief who steals corporate secrets.", backdrop: "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg", poster: "https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", rating: 8.8, releaseDate: "2010-07-16", mediaType: "movie" },
      { id: 3, title: "Interstellar", overview: "A team of explorers travel through a wormhole.", backdrop: "https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg", poster: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rating: 8.6, releaseDate: "2014-11-07", mediaType: "movie" },
      { id: 4, title: "Pulp Fiction", overview: "The lives of two mob hitmen intersect.", backdrop: "https://image.tmdb.org/t/p/original/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg", poster: "https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", rating: 8.9, releaseDate: "1994-10-14", mediaType: "movie" },
      { id: 5, title: "The Matrix", overview: "A computer hacker learns about reality.", backdrop: "https://image.tmdb.org/t/p/original/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg", poster: "https://image.tmdb.org/t/p/original/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg", rating: 8.7, releaseDate: "1999-03-31", mediaType: "movie" }
    ];
    return mockMovies.slice(0, 10);
  };

  const getMockContentRows = () => {
    const mockRows = {};
    CONTENT_CATEGORIES.forEach(category => {
      mockRows[category.id] = { ...category, content: getMockContent(category.id) };
    });
    return mockRows;
  };

  // Handle movie selection for modal
  const handleMovieSelect = async (movie) => {
    const enhancedMovie = { ...movie };
    
    // Get trailer if not already loaded
    if (!enhancedMovie.trailerKey) {
      const trailerKey = await getContentVideos(movie.id, movie.mediaType);
      enhancedMovie.trailerKey = trailerKey;
    }
    
    setSelectedMovie(enhancedMovie);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    console.warn(error);
  }

  return (
    <div className="min-h-screen bg-netflix-black text-white">
      <Header />
      
      {heroContent && (
        <HeroSection 
          content={heroContent}
          onPlayClick={() => handleMovieSelect(heroContent)}
        />
      )}

      <main className="relative z-10 -mt-32">
        {Object.values(contentRows).map((row) => (
          <ContentRow
            key={row.id}
            title={row.title}
            content={row.content}
            onMovieClick={handleMovieSelect}
          />
        ))}
      </main>

      <AnimatePresence>
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="mt-20 py-10 px-4 bg-netflix-black text-gray-400">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">
            This is an ANDYBEXT streaming platform for demonstration purposes. All content is fetched from TMDB API.
          </p>
          <p className="text-xs mt-2 opacity-60">
            Made with ❤️ using React, TailwindCSS, and TMDB API
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NetflixClone />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;