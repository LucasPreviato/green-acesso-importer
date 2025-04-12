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
  export class ValidateFileExtensionInterceptor implements NestInterceptor {
    constructor(private readonly allowedExtensions: string[]) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const file = request.file;
  
      if (!file || !file.originalname) {
        throw new HttpException(
          { error: 'Arquivo não encontrado ou inválido.' },
          HttpStatus.BAD_REQUEST,
        );
      }
  
      const extension = file.originalname.split('.').pop()?.toLowerCase();
      const isAllowed = this.allowedExtensions.includes(extension || '');
  
      if (!isAllowed) {
        throw new HttpException(
          { error: `Extensão de arquivo não permitida: .${extension}` },
          HttpStatus.BAD_REQUEST,
        );
      }
  
      return next.handle();
    }
  }
  