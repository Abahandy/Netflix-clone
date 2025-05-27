import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import { 
  Play, 
  Info, 
  Plus, 
  Minus,
  ThumbsUp, 
  ThumbsDown,
  ChevronDown, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Bell,
  User,
  Menu,
  Home,
  Tv,
  Film,
  Star,
  Clock,
  Heart
} from 'lucide-react';

// Enhanced Header Component with Mobile Support
export const Header = ({ 
  searchQuery, 
  setSearchQuery, 
  showSearch, 
  setShowSearch, 
  currentUser, 
  onProfileClick,
  isMobile,
  showMobileNav,
  setShowMobileNav 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

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
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button 
            onClick={() => setShowMobileNav(!showMobileNav)}
            className="text-white hover:text-gray-300 transition-colors mr-4"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Logo and Navigation */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <div className="text-netflix-red text-xl md:text-2xl font-bold tracking-wider">
            NETFLIX
          </div>
          
          {!isMobile && (
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">TV Shows</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Movies</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">New & Popular</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">My List</a>
            </nav>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search */}
          <div className="relative">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="text-white hover:text-gray-300 transition-colors p-1"
            >
              <Search size={isMobile ? 18 : 20} />
            </button>
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: isMobile ? 180 : 250, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="absolute right-0 top-0"
                >
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black bg-opacity-80 border border-gray-600 text-white px-3 py-2 text-sm rounded"
                    placeholder="Search movies, shows..."
                    autoFocus
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {!isMobile && (
            <button className="text-white hover:text-gray-300 transition-colors">
              <Bell size={20} />
            </button>
          )}
          
          {/* User Profile */}
          <button 
            onClick={onProfileClick}
            className="w-8 h-8 bg-netflix-red rounded flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            {currentUser?.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-full h-full rounded object-cover"
              />
            ) : (
              <User size={isMobile ? 14 : 16} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

// Mobile Navigation Component
export const MobileNav = ({ isOpen, onClose, currentUser, onProfileClick }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Slide-out menu */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-72 bg-netflix-black z-50 p-6"
          >
            {/* User Profile Section */}
            <div className="flex items-center space-x-3 mb-8 pt-16">
              <div className="w-10 h-10 bg-netflix-red rounded flex items-center justify-center">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-full h-full rounded object-cover"
                  />
                ) : (
                  <User size={18} className="text-white" />
                )}
              </div>
              <div>
                <p className="text-white font-semibold">{currentUser?.name || 'User'}</p>
                <button 
                  onClick={onProfileClick}
                  className="text-gray-400 text-sm hover:text-white transition-colors"
                >
                  Switch Profiles
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-4">
              <a href="#" className="flex items-center space-x-3 text-white hover:text-gray-300 transition-colors py-2">
                <Home size={20} />
                <span>Home</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2">
                <Tv size={20} />
                <span>TV Shows</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2">
                <Film size={20} />
                <span>Movies</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2">
                <Star size={20} />
                <span>New & Popular</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2">
                <Heart size={20} />
                <span>My List</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors py-2">
                <Clock size={20} />
                <span>Recently Added</span>
              </a>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// User Profiles Component
export const UserProfiles = ({ onUserSelect }) => {
  const profiles = [
    { id: 1, name: 'John', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', color: 'bg-blue-600' },
    { id: 2, name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b2c2?w=150&h=150&fit=crop&crop=face', color: 'bg-pink-600' },
    { id: 3, name: 'Kids', avatar: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=150&h=150&fit=crop&crop=face', color: 'bg-green-600' },
    { id: 4, name: 'Add Profile', avatar: null, color: 'bg-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl text-white mb-8 md:mb-12 font-light">
          Who's watching?
        </h1>
        
        <div className="grid grid-cols-2 md:flex md:justify-center gap-4 md:gap-8">
          {profiles.map((profile) => (
            <motion.div
              key={profile.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer text-center group"
              onClick={() => profile.avatar && onUserSelect(profile)}
            >
              <div className={`w-24 h-24 md:w-32 md:h-32 rounded-lg ${profile.color} flex items-center justify-center mb-2 md:mb-4 mx-auto group-hover:ring-4 group-hover:ring-white transition-all`}>
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt={profile.name}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <Plus size={32} className="text-white" />
                )}
              </div>
              <p className="text-gray-400 group-hover:text-white transition-colors text-sm md:text-base">
                {profile.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Hero Section with Mobile Optimization
export const HeroSection = ({ content, onPlayClick, onToggleMyList, isMobile }) => {
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
      <div className="relative z-10 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`${isMobile ? 'text-3xl' : 'text-5xl md:text-7xl'} font-bold mb-4 text-white text-with-shadow`}
          >
            {content.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`${isMobile ? 'text-sm' : 'text-lg md:text-xl'} text-gray-200 mb-6 leading-relaxed line-clamp-3`}
          >
            {content.overview}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`flex ${isMobile ? 'flex-col space-y-3' : 'flex-row space-x-4'}`}
          >
            <button 
              onClick={onPlayClick}
              className={`flex items-center justify-center space-x-2 bg-white text-black ${isMobile ? 'py-3 px-6' : 'px-8 py-3'} rounded font-semibold hover:bg-gray-200 transition-colors w-full md:w-auto`}
            >
              <Play size={isMobile ? 18 : 20} fill="currentColor" />
              <span>Play</span>
            </button>
            
            <button 
              onClick={() => onToggleMyList(content)}
              className={`flex items-center justify-center space-x-2 bg-gray-600 bg-opacity-70 text-white ${isMobile ? 'py-3 px-6' : 'px-8 py-3'} rounded font-semibold hover:bg-opacity-50 transition-colors w-full md:w-auto`}
            >
              {content.isInMyList ? <Minus size={isMobile ? 18 : 20} /> : <Plus size={isMobile ? 18 : 20} />}
              <span>{content.isInMyList ? 'Remove from List' : 'My List'}</span>
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

          {/* Continue Watching Progress */}
          {content.watchProgress > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-4"
            >
              <div className="bg-gray-600 rounded-full h-1 w-full max-w-xs">
                <div 
                  className="bg-netflix-red h-1 rounded-full"
                  style={{ width: `${content.watchProgress * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Continue watching • {Math.round(content.watchProgress * 100)}% complete
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// Enhanced Content Row with Mobile Touch Support
export const ContentRow = ({ title, content, onMovieClick, onToggleMyList, isMobile }) => {
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
      const scrollAmount = isMobile ? 300 : 400;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
      
      setTimeout(checkScrollability, 300);
    }
  };

  if (!content || content.length === 0) return null;

  return (
    <div className="mb-6 md:mb-8 px-4 md:px-6">
      <h2 className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} font-semibold mb-3 md:mb-4 text-white`}>
        {title}
      </h2>
      
      <div className="relative group">
        {/* Left Arrow - Hidden on Mobile */}
        {!isMobile && canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Right Arrow - Hidden on Mobile */}
        {!isMobile && canScrollRight && (
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
          className={`flex ${isMobile ? 'space-x-2' : 'space-x-2'} overflow-x-auto scrollbar-hide scroll-smooth ${isMobile ? 'snap-x snap-mandatory' : ''}`}
          onScroll={checkScrollability}
        >
          {content.map((item, index) => (
            <ContentCard
              key={`${item.id}-${index}`}
              content={item}
              onClick={() => onMovieClick(item)}
              onToggleMyList={onToggleMyList}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Enhanced Content Card with Mobile Optimization
const ContentCard = ({ content, onClick, onToggleMyList, isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const imageSrc = imageError 
    ? `https://via.placeholder.com/300x450/141414/ffffff?text=${encodeURIComponent(content.title)}`
    : content.poster;

  const cardWidth = isMobile ? 'w-32' : 'w-48';
  const cardHeight = isMobile ? 'h-48' : 'h-72';

  return (
    <motion.div
      className={`flex-shrink-0 ${cardWidth} cursor-pointer ${isMobile ? 'snap-start' : ''}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      whileHover={!isMobile ? { scale: 1.05 } : {}}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <div className="relative group">
        <img
          src={imageSrc}
          alt={content.title}
          className={`w-full ${cardHeight} object-cover rounded-md transition-all duration-300`}
          onError={handleImageError}
        />
        
        {/* Progress Bar for Continue Watching */}
        {content.watchProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-600 rounded-b-md h-1">
            <div 
              className="bg-netflix-red h-1 rounded-b-md"
              style={{ width: `${content.watchProgress * 100}%` }}
            />
          </div>
        )}
        
        {/* Hover Overlay - Desktop Only */}
        {!isMobile && (
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
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMyList(content);
                }}
                className="p-1 bg-gray-600 bg-opacity-70 rounded-full text-white hover:bg-opacity-50 transition-colors"
              >
                {content.isInMyList ? <Minus size={12} /> : <Plus size={12} />}
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
        )}

        {/* Mobile: Show title below image */}
        {isMobile && (
          <div className="mt-2">
            <h3 className="text-white text-xs font-medium line-clamp-2">
              {content.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
              <span>★ {content.rating?.toFixed(1)}</span>
              <span>{new Date(content.releaseDate).getFullYear()}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Search Results Component
export const SearchResults = ({ results, query, onMovieClick, onToggleMyList }) => {
  return (
    <div className="pt-24 px-4 md:px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">
          Search results for "{query}"
        </h2>
        
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((item) => (
              <ContentCard
                key={item.id}
                content={item}
                onClick={() => onMovieClick(item)}
                onToggleMyList={onToggleMyList}
                isMobile={window.innerWidth < 768}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No results found for "{query}"</p>
            <p className="text-gray-500 text-sm mt-2">Try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Movie Modal with Mobile Optimization
export const MovieModal = ({ movie, onClose, onToggleMyList, isMobile }) => {
  const [showTrailer, setShowTrailer] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const youtubeOpts = {
    height: isMobile ? '250' : '400',
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        className={`bg-netflix-black rounded-lg ${isMobile ? 'w-full' : 'max-w-4xl w-full'} max-h-[90vh] overflow-y-auto`}
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
                className={`w-full ${isMobile ? 'h-48' : 'h-64 md:h-96'} object-cover rounded-t-lg`}
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
            <X size={isMobile ? 18 : 20} />
          </button>

          {/* Play Button Overlay */}
          {!showTrailer && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setShowTrailer(true)}
                className="bg-white bg-opacity-20 backdrop-blur-sm text-white p-4 md:p-6 rounded-full hover:bg-opacity-30 transition-colors"
                disabled={!movie.trailerKey}
              >
                <Play size={isMobile ? 32 : 40} fill="currentColor" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={`p-4 md:p-6`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl md:text-3xl'} font-bold text-white mb-2`}>
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
            
            <div className="flex space-x-2 ml-4">
              <button 
                onClick={() => onToggleMyList(movie)}
                className="p-2 bg-gray-600 bg-opacity-70 rounded-full text-white hover:bg-opacity-50 transition-colors"
              >
                {movie.isInMyList ? <Minus size={isMobile ? 18 : 20} /> : <Plus size={isMobile ? 18 : 20} />}
              </button>
              <button 
                onClick={() => setUserRating(userRating === 'up' ? null : 'up')}
                className={`p-2 rounded-full transition-colors ${userRating === 'up' ? 'bg-green-600 text-white' : 'bg-gray-600 bg-opacity-70 text-white hover:bg-opacity-50'}`}
              >
                <ThumbsUp size={isMobile ? 18 : 20} />
              </button>
              <button 
                onClick={() => setUserRating(userRating === 'down' ? null : 'down')}
                className={`p-2 rounded-full transition-colors ${userRating === 'down' ? 'bg-red-600 text-white' : 'bg-gray-600 bg-opacity-70 text-white hover:bg-opacity-50'}`}
              >
                <ThumbsDown size={isMobile ? 18 : 20} />
              </button>
            </div>
          </div>

          <p className={`text-gray-300 leading-relaxed mb-6 ${isMobile ? 'text-sm' : ''}`}>
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'space-x-4'} mb-6`}>
            <button 
              onClick={() => setShowTrailer(!showTrailer)}
              className={`flex items-center justify-center space-x-2 bg-white text-black ${isMobile ? 'py-3 px-6' : 'px-6 py-2'} rounded font-semibold hover:bg-gray-200 transition-colors ${isMobile ? 'w-full' : ''}`}
              disabled={!movie.trailerKey}
            >
              <Play size={16} fill="currentColor" />
              <span>{showTrailer ? 'Hide Trailer' : 'Play Trailer'}</span>
            </button>
            
            <button className={`flex items-center justify-center space-x-2 bg-gray-600 bg-opacity-70 text-white ${isMobile ? 'py-3 px-6' : 'px-6 py-2'} rounded font-semibold hover:bg-opacity-50 transition-colors ${isMobile ? 'w-full' : ''}`}>
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
      <span className="ml-3 text-white">Loading Netflix...</span>
    </div>
  );
};