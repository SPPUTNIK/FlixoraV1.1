'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Movie } from '@/services/types';
import { getStreamUrl, checkStreamReady, getSubtitleContent, createSubtitleBlobUrl } from '@/services/movie-service';
import { useTranslation } from '@/hooks/useTranslation';

interface MoviePlayerProps {
  movie: Movie;
}

export const MoviePlayer = ({ movie }: MoviePlayerProps) => {
  const { t } = useTranslation();
  
  // Early return if movie data is not available
  if (!movie) {
    return (
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{t('movies.noData')}</p>
      </div>
    );
  }
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [quality, setQuality] = useState('720p');
  const [availableQualities] = useState(['2160p', '1080p', '720p', '480p']);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isStreamLoading, setIsStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [subtitleUrl, setSubtitleUrl] = useState<string | null>(null);
  const nativeVideoRef = useRef<HTMLVideoElement>(null);
  const qualityMenuRef = useRef<any>(null);
  
  // Build stream URL with quality parameter
  const streamUrl = movie.imdb_id 
    ? getStreamUrl(movie.imdb_id, movie.name, quality)
    : '';
  
  // Load subtitles
  useEffect(() => {
    const loadSubtitles = async () => {
      if (movie.imdb_id && isPlaying) {
        try {
          const subtitleContent = await getSubtitleContent(movie.imdb_id, movie.name || '');
          if (subtitleContent) {
            const blobUrl = createSubtitleBlobUrl(subtitleContent);
            setSubtitleUrl(blobUrl);
          }
        } catch (error) {
          console.error('Failed to load subtitles:', error);
          // Don't show error for subtitles, they're optional
        }
      }
    };

    loadSubtitles();

    // Cleanup blob URL when component unmounts or when subtitles change
    return () => {
      if (subtitleUrl) {
        URL.revokeObjectURL(subtitleUrl);
      }
    };
  }, [movie.imdb_id, movie.name, isPlaying]);
  
  // Handle play button click
  const handlePlayClick = async () => {
    setIsStreamLoading(true);
    setStreamError(null);
    
    try {
      // Check if stream is ready or start preparation
      if (!movie.imdb_id) {
        throw new Error('Movie IMDB ID is missing');
      }
      
      // Try to prepare the stream
      await checkStreamReady(movie.imdb_id, movie.name || '', quality);
      setIsPlaying(true);
    } catch (error) {
      console.error('Stream preparation error:', error);
      setStreamError('Failed to prepare stream. The movie might not be available for streaming.');
    } finally {
      setIsStreamLoading(false);
    }
  };

  // Handle quality change
  const handleQualityChange = (newQuality: string) => {
    setQuality(newQuality);
    setShowQualityMenu(false);
    // Store user preference in localStorage
    localStorage.setItem('preferredQuality', newQuality);
    
    // If already playing, restart with new quality
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => {
        handlePlayClick();
      }, 100);
    }
  };
  
  // Close quality menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (qualityMenuRef.current && !qualityMenuRef.current.contains(event.target)) {
        setShowQualityMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Load preferred quality from localStorage on component mount
  useEffect(() => {
    const savedQuality = localStorage.getItem('preferredQuality');
    if (savedQuality) {
      setQuality(savedQuality);
    }
  }, []);

  // Don't show player for movies without IMDB ID
  if (!movie.imdb_id) {
    return (
      <div className="aspect-video bg-black relative flex items-center justify-center rounded-lg overflow-hidden">
        <div className="text-center text-white">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">Not Available for Streaming</p>
          <p className="text-sm opacity-75 mt-2">This movie cannot be streamed</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (streamError) {
    return (
      <div className="aspect-video bg-black relative flex items-center justify-center rounded-lg overflow-hidden">
        <div className="text-center text-white p-6">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium mb-2">Streaming Error</p>
          <p className="text-sm opacity-75 mb-4">{streamError}</p>
          <button
            onClick={() => {
              setStreamError(null);
              handlePlayClick();
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show video player when playing
  if (isPlaying) {
    return (
      <div className="aspect-video bg-black relative rounded-lg overflow-hidden group">
        <video
          ref={nativeVideoRef}
          src={streamUrl}
          className="w-full h-full ios-video-fix"
          controls
          autoPlay
          playsInline
          muted={false}
          crossOrigin="anonymous"
          preload="metadata"
          onError={(e) => {
            console.error('Video playback error:', e);
            const videoElement = e.target as HTMLVideoElement;
            console.error('Video error code:', videoElement.error?.code);
            console.error('Video error message:', videoElement.error?.message);
            setStreamError('Video playback failed. The stream might not be available or the movie is still being prepared.');
            setIsPlaying(false);
          }}
          onLoadStart={() => {
            console.log('Video started loading');
          }}
          onCanPlay={() => {
            console.log('Video can play');
          }}
          onLoadedMetadata={() => {
            console.log('Video metadata loaded');
          }}
          onProgress={() => {
            console.log('Video loading progress');
          }}
        >
          {/* Add subtitle track if available */}
          {subtitleUrl && (
            <track
              kind="subtitles"
              src={subtitleUrl}
              srcLang="en"
              label="English"
              default
            />
          )}
          Your browser does not support the video tag.
        </video>

        {/* Quality selector overlay */}
        <div 
          ref={qualityMenuRef}
          className="absolute top-4 right-4 z-10"
        >
          <button
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            className="bg-black/70 hover:bg-black/90 text-white px-3 py-2 rounded-lg text-sm transition-all backdrop-blur-sm"
          >
            {quality}
            <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showQualityMenu && (
            <div className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl border border-gray-700 min-w-[100px]">
              {availableQualities.map((q) => (
                <button
                  key={q}
                  onClick={() => handleQualityChange(q)}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    quality === q 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show poster with play button overlay
  return (
    <div className="relative w-full">
      {/* Video Container */}
      <div className="aspect-video bg-black relative rounded-lg sm:rounded-xl overflow-hidden group cursor-pointer shadow-xl">
        <Image 
          src={movie.image} 
          alt={movie.name} 
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
          priority
        />
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayClick}
            disabled={isStreamLoading}
            className="group/btn flex flex-col items-center transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed p-4"
          >
            {isStreamLoading ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600/80 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover/btn:scale-110 shadow-lg shadow-blue-900/30 backdrop-blur-sm">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}
            <span className="text-white font-medium mt-2 sm:mt-4 text-base sm:text-lg group-hover/btn:text-blue-300 transition-colors text-center">
              {isStreamLoading ? t('movies.preparing') : t('movies.watchNow')}
            </span>
          </button>
        </div>

        {/* Quality selector button */}
        <div 
          ref={qualityMenuRef}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQualityMenu(!showQualityMenu);
            }}
            className="bg-black/70 hover:bg-black/90 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm transition-all backdrop-blur-sm"
          >
            {quality}
            <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showQualityMenu && (
            <div className="absolute right-0 top-full mt-1 sm:mt-2 bg-black/90 backdrop-blur-sm rounded-md sm:rounded-lg overflow-hidden shadow-xl border border-gray-700 min-w-[80px] sm:min-w-[100px]">
              {availableQualities.map((q) => (
                <button
                  key={q}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQualityChange(q);
                  }}
                  className={`block w-full text-left px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm transition-colors ${
                    quality === q 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Movie Title below player for mobile */}
      <div className="block sm:hidden mt-4 text-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {movie.name}
        </h1>
        {movie.year && (
          <p className="text-gray-600 dark:text-gray-400">
            ({movie.year})
          </p>
        )}
      </div>
    </div>
  );
};