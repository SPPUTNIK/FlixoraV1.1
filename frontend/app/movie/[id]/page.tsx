'use client';

import { useParams } from 'next/navigation';
import { useMovie } from '@/hooks/useMovies';
import { MovieHeader } from '@/components/MovieHeader';
import { MoviePlayer } from '@/components/MoviePlayer';
import { MovieInfo } from '@/components/MovieInfo';
import { useTranslation } from '@/hooks/useTranslation';

export default function MovieDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const { t } = useTranslation();

  const { data: movie, isLoading, error } = useMovie(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-300/30 border-t-purple-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-pink-300/30 border-t-pink-500 mx-auto animate-spin" style={{animationDelay: '0.5s', animationDirection: 'reverse'}}></div>
            </div>
            <p className="mt-6 text-gray-300 font-medium text-lg">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
            <h1 className="text-3xl font-bold text-white mb-4">
              {t('common.error')}
            </h1>
            <p className="text-gray-300">
              {t('movie.errorLoading')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-4">
              {t('movie.notFound')}
            </h1>
            <p className="text-gray-300">
              {t('movie.doesNotExist')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-blob animation-delay-6000"></div>
      </div>
      
      <div className="relative">
        <MovieHeader movie={movie.movieData} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content - Video Player */}
            <div className="xl:col-span-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 mb-8 transition-all duration-300 hover:shadow-purple-500/10 hover:border-white/30">
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    {t('movies.watchMovie')}
                  </h2>
                  <p className="text-gray-300">{t('movies.enjoyMovieHQ')}</p>
                </div>
                <MoviePlayer movie={movie.movieData} />
              </div>
              
              {/* Movie Info for Mobile - shown below video on smaller screens */}
              <div className="block xl:hidden">
                <MovieInfo movie={movie} />
              </div>
            </div>
            
            {/* Sidebar - Movie Details and Info */}
            <div className="xl:col-span-1 space-y-8">
              {/* IMDb Link Card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 transition-all duration-300 hover:shadow-purple-500/10 hover:border-white/30">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                  </div>
                  {t('movies.movieDetails')}
                </h2>
                
                {movie.movieData.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${movie.movieData.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 w-full justify-center px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-2xl transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-2xl hover:scale-105"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.3 5.9c0-.4-.3-.7-.7-.7H2.4c-.4 0-.7.3-.7.7v12.2c0 .4.3.7.7.7h19.2c.4 0 .7-.3.7-.7V5.9zM3.8 7.3h1.6v9.4H3.8V7.3zm3.2 0h1.6v9.4H7V7.3zm3.2 0h1.6v9.4h-1.6V7.3zm3.2 0h1.6v9.4h-1.6V7.3zm3.2 0h1.6v9.4h-1.6V7.3zm3.2 0h1.6v9.4h-1.6V7.3z"/>
                        <path d="M15.512 11.207h-1.403v5.157h1.403v-5.157zM8.667 11.207v5.157h1.297v-3.102l.45.005 1.053 3.097h1.121l1.158-3.338h.011v3.338h1.264v-5.157h-1.913l-1.12 3.284-1.206-3.284H8.667zm5.695-.781c0 .391.307.709.685.709.378 0 .686-.318.686-.71 0-.392-.308-.71-.686-.71-.378 0-.686.318-.686.71z" fill="#000"/>
                      </svg>
                    </div>
                    <span>{t('movies.viewOnImdb')}</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
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
    </div>
  );
}
