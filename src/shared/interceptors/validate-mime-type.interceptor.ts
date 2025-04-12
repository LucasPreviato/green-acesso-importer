import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class ValidateMimeTypeInterceptor implements NestInterceptor {
    constructor(private readonly allowedMimeTypes: string[]) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const file = request.file;
  
      if (!file || !file.mimetype) {
        throw new HttpException(
          { error: 'Tipo de arquivo não encontrado ou inválido.' },
          HttpStatus.BAD_REQUEST,
        );
      }
  
      const isAllowed = this.allowedMimeTypes.includes(file.mimetype);
  
      if (!isAllowed) {
        throw new HttpException(
          {
            error: `Tipo MIME não permitido: ${file.mimetype}`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
  
      return next.handle();
    }
  }
  