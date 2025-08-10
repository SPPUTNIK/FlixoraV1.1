import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Movie } from '@/services/types';
import { useLanguageStore } from '../store/languageStore';

interface MovieCardProps {
  movie: Movie;
  language: string;
}

export default function MovieCard({ movie }: { movie: any }) {
  const router = useRouter();
  const { language } = useLanguageStore();

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

  const genresArray = getGenresArray(movie.genres);
  
  return (
    <div className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Image 
          src={movie.image} 
          alt={movie.name}
          className="w-full h-64 sm:h-72 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
          width={500}
          height={400}
          loading='lazy'
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Movie Rating Badge */}
        {movie.rating && (
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-sm font-semibold flex items-center">
            <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {movie.rating}
          </div>
        )}

        {/* Watched Badge */}
        {movie.watched && (
          <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-xl flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            {language === 'fr' ? 'Vu' : 'Watched'}
          </div>
        )}

        {/* Play Button - appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/movie/${movie.id}`);
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {language === 'fr' ? 'Regarder' : 'Watch Now'}
          </button>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4 sm:p-5 space-y-3">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {movie.name}
          </h3>
          {movie.year && (
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              {movie.year}
            </p>
          )}
        </div>

        {genresArray.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {genresArray.slice(0, 2).map((genre: string, index: number) => (
              <span 
                key={index}
                className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium"
              >
                {genre}
              </span>
            ))}
            {genresArray.length > 2 && (
              <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-medium">
                +{genresArray.length - 2}
              </span>
            )}
          </div>
        )}

        {movie.length && (
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {movie.length} {language === 'fr' ? 'min' : 'min'}
          </div>
        )}
      </div>
    </div>
  );
};
