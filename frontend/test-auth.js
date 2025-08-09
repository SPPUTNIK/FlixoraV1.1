// Simple test to check authentication
const API_URL = 'https://fantastic-winner-gwgwx4q5jqw2v9w7-3001.app.github.dev';

// Test if authentication is working
async function testAuth() {
  try {
    // Test getting current user
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const user = await response.json();
      console.log('User authenticated:', user);
      
      // Test getting movies
      const moviesResponse = await fetch(`${API_URL}/movies`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (moviesResponse.ok) {
        const movies = await moviesResponse.json();
        console.log('Movies fetched successfully:', movies.length, 'movies');
      } else {
        console.error('Failed to fetch movies:', moviesResponse.status);
      }
    } else {
      console.error('User not authenticated:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();
