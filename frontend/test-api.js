// Test API connection
console.log('Testing API connection...');
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies/755898`)
  .then(response => {
    console.log('Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Movie data received:', data);
    if (data.movieData) {
      console.log('Movie name:', data.movieData.name);
      console.log('IMDB ID:', data.movieData.imdb_id);
    }
  })
  .catch(error => {
    console.error('API test failed:', error);
  });
