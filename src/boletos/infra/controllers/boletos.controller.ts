import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ImportBoletosUseCase } from '../../application/use-cases/import-boletos.use-case';
  import { parse } from 'csv-parse/sync';
  import { Express } from 'express';
  import { Result, Left, Right } from '../../../shared/result';
  
  @Controller('boletos')
  export class BoletosController {
    constructor(private readonly importBoletosUseCase: ImportBoletosUseCase) {}
  
    @Post('upload-csv')
    @UseInterceptors(FileInterceptor('file'))
    async uploadCsv(@UploadedFile() file: Express.Multer.File) {
      const csvText = file.buffer.toString('utf-8');
  
      const records = parse(csvText, {
        columns: true,
        delimiter: ';',
        skip_empty_lines: true,
        trim: true,
      });
  
      const boletos = records.map((row: any) => ({
        nome: row.nome,
        unidade: row.unidade,
        valor: parseFloat(row.valor),
        linha_digitavel: row.linha_digitavel,
      }));
  
      const result: Result<string, { total: number }> =
        await this.importBoletosUseCase.execute(boletos);
  
      if (result instanceof Left) {
        return new HttpException({ error: result.value }, HttpStatus.BAD_REQUEST);
      }
  
      if (result instanceof Right) {
        return {
          success: true,
          total: result.value.total,
        };
      }
  
      throw new HttpException('Erro inesperado', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  