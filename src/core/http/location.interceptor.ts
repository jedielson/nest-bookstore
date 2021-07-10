import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocationUrlMetadata } from './location.decorator';

@Injectable()
export class LocationInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((x) => this.setLocationHeader(x, context)));
  }

  private setLocationHeader(x: any, context: ExecutionContext) {
    const res = context.switchToHttp().getResponse();
    if (!(res.req.method === 'POST' && res.statusCode === 201)) {
      return x;
    }

    const urls = this.reflector.get<string[]>(
      LocationUrlMetadata,
      context.getHandler(),
    );

    let url = urls === undefined ? '' : urls[0];
    if (!url) {
      url = '';
    }

    const req = context.switchToHttp().getRequest();

    res.set(
      'Location',
      `${req.protocol}://${req.headers.host}${req.url}/${url}${x.id}`,
    );
    return null;
  }
}
