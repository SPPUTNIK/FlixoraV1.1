// Example: Adding ads to your pages

// 1. Import the UnifiedAd component
import { UnifiedAd } from '@/components/ads';

// 2. Add banner ads in your JSX
export function SomePage() {
  return (
    <div>
      {/* Header banner ad */}
      <UnifiedAd 
        type="banner" 
        width={728} 
        height={90}
        className="mb-6"
      />
      
      <h1>Your Content</h1>
      
      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Your main content */}
          <p>Main content here...</p>
        </div>
        
        <div className="lg:col-span-1">
          {/* Sidebar banner ad */}
          <UnifiedAd 
            type="banner" 
            width={300} 
            height={250}
            className="mb-4"
          />
          
          {/* Native ad */}
          <UnifiedAd 
            type="native" 
            width={300} 
            height={250}
            className="mt-4"
          />
        </div>
      </div>
      
      {/* Bottom banner */}
      <UnifiedAd 
        type="banner" 
        width={728} 
        height={90}
        className="mt-8"
      />
    </div>
  );
}

// 3. For movie grids, add ads between rows
export function MovieLibraryWithAds() {
  // Mock data - replace with your actual movies array
  const movies = [
    { id: 1, title: 'Movie 1' },
    { id: 2, title: 'Movie 2' },
    // ... more movies
  ];

  return (
    <div>
      {/* Top banner */}
      <UnifiedAd type="banner" width={728} height={90} className="mb-6" />
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.map((movie: any, index: number) => (
          <div key={movie.id}>
            {/* Replace with your actual MovieCard component */}
            <div className="p-4 border rounded">
              {movie.title}
            </div>
            
            {/* Add banner ad every 12 movies */}
            {(index + 1) % 12 === 0 && (
              <div className="col-span-full my-6">
                <UnifiedAd 
                  type="banner" 
                  width={728} 
                  height={90}
                  className="mx-auto"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
