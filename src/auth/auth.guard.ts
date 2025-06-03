import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = (request.headers.authorization as string).split(' ')[1];

    if (!token) throw new UnauthorizedException('Token not provided');

    try {
      const tokenPayload = this.jwtService.verify(token);
      request.user = {
        email: tokenPayload.email,
      };
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }

    return true;
  }
}
