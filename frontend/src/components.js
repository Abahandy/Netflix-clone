import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import YouTube from 'react-youtube';
import { 
  Play, 
  Info, 
  Plus, 
  ThumbsUp, 
  ChevronDown, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Bell,
  User
} from 'lucide-react';

// Header Component
export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-netflix-black bg-opacity-95 backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="text-netflix-red text-2xl font-bold tracking-wider">
            ANDYBEXT
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">TV Shows</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Movies</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">New & Popular</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">My List</a>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Search size={20} />
            </button>
            {showSearch && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="absolute right-0 top-0 bg-black bg-opacity-80 border border-gray-600 text-white px-3 py-1 text-sm"
                placeholder="Search..."
                autoFocus
              />
            )}
          </div>
          
          <button className="text-white hover:text-gray-300 transition-colors">
            <Bell size={20} />
          </button>
          
          <div className="w-8 h-8 bg-netflix-red rounded flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Section Component
export const HeroSection = ({ content, onPlayClick }) => {
  if (!content) return null;

  return (
    <section className="relative h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={content.backdrop}
          alt={content.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = content.poster || 'https://via.placeholder.com/1920x1080/141414/ffffff?text=Netflix';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 max-w-6xl mx-auto">
        <div className="max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-4 text-white"
          >
            {content.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 mb-6 leading-relaxed"
          >
            {content.overview}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex space-x-4"
          >
            <button 
              onClick={onPlayClick}
              className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
            >
              <Play size={20} fill="currentColor" />
              <span>Play</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded font-semibold hover:bg-opacity-50 transition-colors">
              <Info size={20} />
              <span>More Info</span>
            </button>
          </motion.div>

          {/* Rating and Year */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center space-x-4 mt-6 text-sm text-gray-300"
          >
            <span className="bg-red-600 px-2 py-1 rounded text-xs font-semibold">
              ★ {content.rating?.toFixed(1)}
            </span>
            <span>{new Date(content.releaseDate).getFullYear()}</span>
            <span className="uppercase tracking-wider">{content.mediaType}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Content Row Component
export const ContentRow = ({ title, content, onMovieClick }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [content]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      
      setTimeout(checkScrollability, 300);
    }
  };

  if (!content || content.length === 0) return null;

  return (
    <div className="mb-8 px-6">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">{title}</h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Content Row */}
        <div
          ref={scrollRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth"
          onScroll={checkScrollability}
        >
          {content.map((item, index) => (
            <ContentCard
              key={`${item.id}-${index}`}
              content={item}
              onClick={() => onMovieClick(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Content Card Component
const ContentCard = ({ content, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const imageSrc = imageError 
    ? `https://via.placeholder.com/300x450/141414/ffffff?text=${encodeURIComponent(content.title)}`
    : content.poster;

  return (
    <motion.div
      className="flex-shrink-0 w-48 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <div className="relative group">
        <img
          src={imageSrc}
          alt={content.title}
          className="w-full h-72 object-cover rounded-md transition-all duration-300"
          onError={handleImageError}
        />
        
        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black bg-opacity-80 rounded-md flex flex-col justify-end p-4"
        >
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
            {content.title}
          </h3>
          
          <div className="flex items-center space-x-2 mb-2">
            <button className="p-1 bg-white rounded-full text-black hover:bg-gray-200 transition-colors">
              <Play size={12} fill="currentColor" />
            </button>
            <button className="p-1 bg-gray-600 bg-opacity-70 rounded-full text-white hover:bg-opacity-50 transition-colors">
              <Plus size={12} />
            </button>
            <button className="p-1 bg-gray-600 bg-opacity-70 rounded-full text-white hover:bg-opacity-50 transition-colors">
              <ThumbsUp size={12} />
            </button>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>★ {content.rating?.toFixed(1)}</span>
            <span>{new Date(content.releaseDate).getFullYear()}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Movie Modal Component
export const MovieModal = ({ movie, onClose }) => {
  const [showTrailer, setShowTrailer] = useState(false);

  const youtubeOpts = {
    height: '400',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        className="bg-netflix-black rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header with Backdrop */}
        <div className="relative">
          {showTrailer && movie.trailerKey ? (
            <div className="aspect-video">
              <YouTube
                videoId={movie.trailerKey}
                opts={youtubeOpts}
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={movie.backdrop || movie.poster}
                alt={movie.title}
                className="w-full h-64 md:h-96 object-cover rounded-t-lg"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/800x450/141414/ffffff?text=${encodeURIComponent(movie.title)}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent rounded-t-lg" />
            </div>
          )}
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Play Button Overlay */}
          {!showTrailer && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setShowTrailer(true)}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-6 rounded-full hover:bg-opacity-30 transition-colors"
                disabled={!movie.trailerKey}
              >
                <Play size={40} fill="currentColor" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {movie.title}
              </h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
                <span className="bg-red-600 px-2 py-1 rounded text-xs font-semibold">
                  ★ {movie.rating?.toFixed(1)}
                </span>
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
                <span className="uppercase tracking-wider">{movie.mediaType}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-600 bg-opacity-70 rounded-full text-white hover:bg-opacity-50 transition-colors">
                <Plus size={20} />
              </button>
              <button className="p-2 bg-gray-600 bg-opacity-70 rounded-full text-white hover:bg-opacity-50 transition-colors">
                <ThumbsUp size={20} />
              </button>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <button 
              onClick={() => setShowTrailer(!showTrailer)}
              className="flex items-center space-x-2 bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition-colors"
              disabled={!movie.trailerKey}
            >
              <Play size={16} fill="currentColor" />
              <span>{showTrailer ? 'Hide Trailer' : 'Play Trailer'}</span>
            </button>
            
            <button className="flex items-center space-x-2 bg-gray-600 bg-opacity-70 text-white px-6 py-2 rounded font-semibold hover:bg-opacity-50 transition-colors">
              <Info size={16} />
              <span>More Info</span>
            </button>
          </div>

          {!movie.trailerKey && (
            <p className="text-yellow-400 text-sm">
              No trailer available for this content.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-netflix-red border-t-transparent rounded-full"
      />
      <span className="ml-3 text-white">Loading ANDYBEXT...</span>
    </div>
  );
};