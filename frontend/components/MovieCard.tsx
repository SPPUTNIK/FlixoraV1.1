import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Movie } from '@/services/types';

interface MovieCardProps {
  movie: Movie;
  language: string;
}

export const MovieCard = ({ movie, language }: MovieCardProps) => {
  const router = useRouter();
  
  return (
    <div 
      key={movie.id} 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative group cursor-pointer">
        <Image 
          src={movie.image} 
          alt={movie.name}
          className="w-full h-60 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          width={500}
          height={300}
          loading='lazy' // Use lazy loading for performance
        />
        <div
          onClick={(e) => {
                e.stopPropagation();
                router.push(`/movie/${movie.id}`);
              }}
          className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
          <div className="space-y-2 w-full">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/movie/${movie.id}`);
              }}
            >
             <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              {language === 'fr' ? 'Regarder' : 'Watch Now'}
            </button>
          </div>
        </div>
        {movie.watched && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{language === 'fr' ? 'Vu' : 'Watched'}</span>
          </div>
        )}
        {movie.quality && (
          <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded">
            {movie.quality}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.name}</h3>
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">
            {movie.date ? movie.date.split('-')[0] : ''}
          </span>
          <span className="text-yellow-500 font-medium flex items-center">
            <svg className="w-4 h-4 mr-1 inline" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24 0.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            {movie.vote ? movie.vote.toFixed(1) : 'N/A'}
          </span>
        </div>
        
        {/* Only render genres if they exist */}
        {Array.isArray(movie.genre) && movie.genre.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genre.slice(0, 2).map((g) => (
              <span 
                key={g} 
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full"
              >
                {g}
              </span>
            ))}
            {movie.genre.length > 2 && (
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                +{movie.genre.length - 2}
              </span>
            )}
          </div>
        )}       
        {movie.director && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {language === 'fr' ? 'Réalisateur' : 'Director'}: {movie.director}
          </div>
        )}
        
        {movie.runTime && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {Math.floor(movie.runTime / 60)}h {movie.runTime % 60}m
            {movie.language && <span className="ml-2">{movie.language}</span>}
          </div>
        )}
      </div>
    </div>
  );
};