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
  
  return (
    <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
      {/* Background Image */}
      {movie?.image && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${movie.image})` }}
        />
      )}
      
      <div className="relative bg-gradient-to-r from-black/90 via-black/70 to-black/50 text-white min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-200 hover:text-white transition-colors mb-6 sm:mb-8 p-2 rounded-lg hover:bg-white/10"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span className="text-sm sm:text-base font-medium">{t('movie.backToLibrary')}</span>
          </button>

          {/* Movie Title and Info */}
          {movie && (
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 lg:gap-12">
              {/* Movie Poster */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <img 
                  src={movie.image} 
                  alt={movie.name}
                  className="w-40 h-60 sm:w-48 sm:h-72 lg:w-56 lg:h-84 object-cover rounded-xl shadow-2xl border-2 border-white/20"
                />
              </div>
              
              {/* Movie Info */}
              <div className="flex-1 text-center sm:text-left space-y-4 sm:space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-4 leading-tight">
                    {movie.name}
                  </h1>
                  {movie.year && (
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-2">
                      ({movie.year})
                    </p>
                  )}
                </div>

                {/* Genres */}
                {movie.genres && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {movie.genres.split(', ').map((genre, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Movie Stats */}
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 sm:gap-6 text-sm sm:text-base">
                  {movie.length && (
                    <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{movie.length} {t('movie.minutes')}</span>
                    </div>
                  )}
                  {movie.rating && (
                    <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                      <svg className="w-4 h-4 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">{movie.rating}/10</span>
                    </div>
                  )}
                </div>

                {/* Overview Preview (Mobile) */}
                {movie.overview && (
                  <div className="block sm:hidden">
                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {movie.overview}
                    </p>
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