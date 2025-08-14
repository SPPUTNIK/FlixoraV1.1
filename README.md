# FLIXORA - Localhost Movie Streaming

A simple anonymous movie streaming platform running on localhost.

## Quick Start

1. Make sure Docker and Docker Compose are installed
2. Run the application:
   ```bash
   chmod +x start.sh
   ./start.sh
   ```
3. Open http://localhost in your browser

## Stop the Application

```bash
./stop.sh
```

## Configuration

Edit the `.env` file to configure:
- TMDB API key (required for movie data)
- OMDB API key (optional)
- Database credentials

## Features

- Anonymous movie browsing (no registration required)
- Movie search and filtering
- Multiple quality streaming
- Responsive design
- Localhost-only deployment

