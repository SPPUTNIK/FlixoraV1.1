import { type MovieDetails, type Movie } from '@/services/types';
import ReactPlayer from 'react-player';
import { useTranslation } from '@/hooks/useTranslation';

interface MovieInfoProps {
  movie: MovieDetails;
}

export const MovieInfo = ({ movie }: MovieInfoProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {t('movie.overview')}
        </h2>
        <div className="prose dark:prose-invert max-w-none">
          {movie.movieData.overview ? (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
              {movie.movieData.overview}
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic text-sm sm:text-base">
              {t('movie.noOverviewAvailable')}
            </p>
          )}
        </div>
      </div>

      {/* Trailer Section */}
      {movie.movieData.trailer && (
        <MovieTrailer movie={movie.movieData} />
      )}

      {/* Movie Details Section */}
      <MovieDetails movie={movie.movieData} />
    </div>
  );
};

const MovieTrailer = ({ movie }: { movie: Movie }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center">
        <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        {t('movie.trailer')}
      </h2>
      <div className="aspect-video rounded-xl overflow-hidden shadow-md bg-gray-100 dark:bg-gray-700">
        <ReactPlayer
          url={movie.trailer}
          width="100%"
          height="100%"
          controls
          light={movie.image}
          playing={false}
          config={{
            youtube: {
              playerVars: {
                showinfo: 1,
                modestbranding: 1,
              }
            }
          }}
        />
      </div>
    </div>
  );
};

const MovieDetails = ({ movie }: { movie: Movie }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        {t('movie.movieInfo')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">
            Movie ID
          </span>
          <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            {movie.id}
          </span>
        </div>
        
        {movie.imdb_id && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">
              IMDb ID
            </span>
            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
              {movie.imdb_id}
            </span>
          </div>
        )}
        
        {movie.length && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">
              {t('movie.length')}
            </span>
            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
              {movie.length} {t('movie.minutes')}
            </span>
          </div>
        )}
        
        {movie.rating && (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">
              {t('movie.rating')}
            </span>
            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white flex items-center">
              {movie.rating}/10
              <svg className="w-4 h-4 ml-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

