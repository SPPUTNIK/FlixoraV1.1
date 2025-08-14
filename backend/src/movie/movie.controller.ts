import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, Req } from '@nestjs/common';
import { MovieService } from './movie.service';
import {ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiConflictResponse, ApiInternalServerErrorResponse, ApiQuery} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { FilterMoviesDto } from './dto/filter-movies.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  // @UseGuards(AuthGuard) // REMOVED - No authentication required
  @ApiOperation({summary: "Get Movies"})
  @ApiOkResponse({description: "get a list of Movies [id, name, date, vote, image]"})
  findAll(
      @Query('page') page: string,
      @Req() req
    ) {
    // const id = req.user.sub // REMOVED - No user context needed
    const id = "anonymous_user" // Use anonymous user
    console.log("Anonymous user accessing movies")
    const pageNumber =  parseInt(page, 10) || 1;
    return this.movieService.findAll(id, pageNumber);
  }

  // SPECIFIC ROUTES MUST COME BEFORE PARAMETERIZED ROUTES
  @Get('filter')
  // @UseGuards(AuthGuard) // REMOVED - No authentication required
  @ApiOperation({ summary: 'Filter Movies' })
  @ApiOkResponse({ 
    description: 'Get filtered movies with pagination',
    schema: {
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              date: { type: 'string' },
              vote: { type: 'number' },
              image: { type: 'string' },
              genres: { type: 'array', items: { type: 'number' } },
              year: { type: 'number' }
            }
          }
        },
        totalPages: { type: 'number' },
        totalResults: { type: 'number' },
        currentPage: { type: 'number' }
      }
    }
  })
  async filterMovies(
    @Query() filterDto: FilterMoviesDto,
    @Req() req
  ) {
    try {
      // const userId = req.user.sub // REMOVED - No user context needed
      const userId = "anonymous_user" // Use anonymous user
      console.log("Filter endpoint called with params:", filterDto)
      console.log("Anonymous user accessing filtered movies")
      
      const result = await this.movieService.filterMovies(userId, filterDto);
      console.log("Filter endpoint returning result with", result.results.length, "movies")
      
      return result;
    } catch (error) {
      console.error("Error in filter endpoint:", error);
      throw error; // Let NestJS handle the error response
    }
  }

  @Get('search')
  // @UseGuards(AuthGuard) // REMOVED - No authentication required
  @ApiOperation({ summary: 'Search for a Movie' })
  @ApiOkResponse({ description: 'Get movie information' })
  @ApiQuery({ name: 'title', required: false, type: String, description: 'Search for a movie by title' })
  async searchMovies(@Query() query) {
    return this.movieService.search(query.title);
  }

  @Get('stream')
  // @UseGuards(AuthGuard) // REMOVED - No authentication required
  async streamMovie(
    @Query('imdbID') imdbID: string,
    @Query('title') title: string,
    @Query('quality') quality: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    console.log("=================== > ", imdbID, title, quality)
    return this.movieService.streamMovie(imdbID, title, quality, req, res);
  }
  
  @Post('stream/prepare')
  // @UseGuards(AuthGuard) // REMOVED - No authentication required
  async prepareStream(
    @Body() streamData: { imdbID: string; title: string; quality: string },
    @Res() res: Response,
  ) {
    try {
      const ready = await this.movieService.prepareStream(
        streamData.imdbID,
        streamData.title,
        streamData.quality
      );
      return res.status(200).json({ ready });
    } catch (error) {
      console.error('Error preparing stream:', error);
      return res.status(500).json({ error: 'Failed to prepare stream' });
    }
  }
  
  @Get('stream/subtitle')
  // @UseGuards(AuthGuard) // REMOVED - No authentication required
  async getSubtitle(
    @Query('imdbID') imdbID: string,
    @Query('title') title: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    return this.movieService.getSubtitle(imdbID, title, req, res);
  }

  // PARAMETERIZED ROUTES MUST COME LAST
  @Get(':id')
  // @UseGuards(AuthGuard) // REMOVED - No authentication required
  @ApiOperation({summary: "Get Movie By ID"})
  @ApiOkResponse({description: "get a Movie infos [id, imdb_id, name, year, overview, length, genres, image, rating, trailer]"})
  findOne(@Param('id') id: string,
    @Req() req
  ) {
    // const userId = req.user.sub // REMOVED - No user context needed
    const userId = "anonymous_user" // Use anonymous user
    return this.movieService.findOne(userId, id);
  }

}
