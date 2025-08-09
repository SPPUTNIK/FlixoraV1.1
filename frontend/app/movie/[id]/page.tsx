'use client';

import { useParams } from 'next/navigation';
import { useMovie } from '@/hooks/useMovies';
import { MovieHeader } from '@/components/MovieHeader';
import { MoviePlayer } from '@/components/MoviePlayer';
import { MovieInfo } from '@/components/MovieInfo';
import { useTranslation } from '@/hooks/useTranslation'; // Changed to use hooks version

export default function MovieDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { t } = useTranslation();

  const { data: movie, isLoading, error } = useMovie(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('common.error')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('movie.errorLoading')}
          </p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('movie.notFound')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('movie.doesNotExist')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MovieHeader movie={movie.movieData} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content - Video Player */}
          <div className="xl:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
              <MoviePlayer movie={movie.movieData} />
            </div>
            
            {/* Movie Info for Mobile - shown below video on smaller screens */}
            <div className="block xl:hidden">
              <MovieInfo movie={movie} />
            </div>
          </div>
          
          {/* Sidebar - Movie Details and Info */}
          <div className="xl:col-span-1">
            {/* IMDb Link Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
                {t('movie.details')}
              </h2>
              
              {movie.movieData.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${movie.movieData.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-semibold text-sm sm:text-base"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.3 5.9c0-.4-.3-.7-.7-.7H2.4c-.4 0-.7.3-.7.7v12.2c0 .4.3.7.7.7h19.2c.4 0 .7-.3.7-.7V5.9zM3.8 7.3h1.6v9.4H3.8V7.3zm3.2 0h1.6v9.4H7V7.3zm3.2 0h1.6v9.4h-1.6V7.3zm3.2 0h1.6v9.4h-1.6V7.3zm3.2 0h1.6v9.4h-1.6V7.3zm3.2 0h1.6v9.4h-1.6V7.3z"/>
                    <path d="M15.512 11.207h-1.403v5.157h1.403v-5.157zM8.667 11.207v5.157h1.297v-3.102l.45.005 1.053 3.097h1.121l1.158-3.338h.011v3.338h1.264v-5.157h-1.913l-1.12 3.284-1.206-3.284H8.667zm5.695-.781c0 .391.307.709.685.709.378 0 .686-.318.686-.71 0-.392-.308-.71-.686-.71-.378 0-.686.318-.686.71z" fill="#000"/>
                  </svg>
                  View on IMDb
                </a>
              )}
            </div>

            {/* Movie Info for Desktop - hidden on mobile */}
            <div className="hidden xl:block">
              <MovieInfo movie={movie} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}