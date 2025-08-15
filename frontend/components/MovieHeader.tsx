// MovieHeader.tsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { useRouter } from 'next/navigation';
import { Movie } from '@/services/types';

interface MovieHeaderProps {
  movie?: Movie;
  language?: string;
}

export const MovieHeader = ({ movie, language }: MovieHeaderProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  
  // Helper function to convert genres to array format
  const getGenresArray = (genres: any): string[] => {
    if (!genres) return [];
    if (Array.isArray(genres)) {
      return genres.map((genre: any) => 
        typeof genre === 'object' && genre?.name ? genre.name : String(genre)
      );
    }
    if (typeof genres === 'string') {
      return genres.split(', ');
    }
    return [];
  };
  
  return (
    <div className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] overflow-hidden">
      {/* Background Image with Parallax Effect */}
      {movie?.image && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${movie.image})` }}
        />
      )}
      
      {/* Multi-layer Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/60"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 animate-pulse"></div>
      </div>
      
      <div className="relative text-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="group flex items-center text-gray-200 hover:text-white transition-all duration-300 mb-8 sm:mb-12 p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20"
          >
            <svg className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span className="text-base font-medium">{t('movies.backToLibrary')}</span>
          </button>

          {/* Movie Title and Info */}
          {movie && (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
              {/* Movie Poster */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                <div className="relative group">
                  <img 
                    src={movie.image} 
                    alt={movie.name}
                    className="w-48 h-72 sm:w-56 sm:h-84 lg:w-64 lg:h-96 object-cover rounded-2xl shadow-2xl border-4 border-white/20 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Movie Info */}
              <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 lg:mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                      {movie.name}
                    </span>
                  </h1>
                  {movie.year && (
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-4 font-light">
                      ({movie.year})
                    </p>
                  )}
                </div>

                {/* Genres */}
                {movie && getGenresArray(movie.genres).length > 0 && (
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    {getGenresArray(movie.genres).map((genre: string, index: number) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-medium backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Movie Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 lg:gap-8 text-base lg:text-lg">
                  {movie.length && (
                    <div className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-300 group">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition-colors">
                        <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 font-medium">{t('movies.duration')}</div>
                        <div className="text-white font-semibold">{movie.length} {t('movies.minutes')}</div>
                      </div>
                    </div>
                  )}
                  {movie.rating && (
                    <div className="flex items-center bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/10 transition-all duration-300 group">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-500/30 transition-colors">
                        <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 font-medium">{t('movies.rating')}</div>
                        <div className="text-white font-semibold">{movie.rating}/10</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overview Preview (Mobile) */}
                {movie.overview && (
                  <div className="block lg:hidden mt-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                        {movie.overview}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
