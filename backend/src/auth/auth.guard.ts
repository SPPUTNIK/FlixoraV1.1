
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from './constants';
  import { Request } from 'express';
  import { JwtPayload } from './jwt-payload.interface';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      try {
        const token = request.cookies['access_token'];
        if (!token) {
          throw new UnauthorizedException();
        }
        const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
        request.user = payload;
        return true;
      } catch {
        throw new UnauthorizedException();
      }
    }
  }
  