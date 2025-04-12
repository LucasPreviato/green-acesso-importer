import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { parse } from 'csv-parse/sync';
import { Express } from 'express';
import { SplitBoletosPdfUseCase } from 'src/boletos/application/use-cases/split-boletos-pdf.use-case';
import { ListBoletosUseCase } from 'src/boletos/application/use-cases/list-boletos.use-case';
import { ImportBoletosUseCase } from '../../application/use-cases/import-boletos.use-case';
import { Result, Left, Right } from '../../../shared/result';
import { GenerateBoletosReportUseCase } from 'src/boletos/application/use-cases/generate-boletos-report.use-case';
import { ValidateFileExtensionInterceptor } from 'src/shared/interceptors/validate-file-extension.interceptor';
import { ValidateMimeTypeInterceptor } from 'src/shared/interceptors/validate-mime-type.interceptor';

@Controller('boletos')
export class BoletosController {
  constructor(
    private readonly importBoletosUseCase: ImportBoletosUseCase,
    private readonly splitBoletosPdfUseCase: SplitBoletosPdfUseCase,
    private readonly listBoletosUseCase: ListBoletosUseCase,
    private readonly generateBoletosReportUseCase: GenerateBoletosReportUseCase,
  ) {}

  @Post('upload-csv')
  @UseInterceptors(
    FileInterceptor('file'),
    new ValidateFileExtensionInterceptor(['csv']),
    new ValidateMimeTypeInterceptor(['text/csv', 'application/vnd.ms-excel']),
  )
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

    throw new HttpException(
      'Erro inesperado',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Post('upload-pdf')
  @UseInterceptors(
    FileInterceptor('file'),
    new ValidateFileExtensionInterceptor(['pdf']),
    new ValidateMimeTypeInterceptor(['application/pdf']),
  )
  async uploadPdf(@UploadedFile() file: Express.Multer.File) {
    const result = await this.splitBoletosPdfUseCase.execute(file.buffer);

    if (result instanceof Left) {
      throw new HttpException({ error: result.value }, HttpStatus.BAD_REQUEST);
    }

    if (result instanceof Right) {
      return {
        success: true,
        totalDivididos: result.value.total,
      };
    }

    throw new HttpException(
      'Erro inesperado',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Get()
  async listBoletos(
    @Query('nome') nome?: string,
    @Query('id_lote') id_lote?: string,
    @Query('valor_inicial') valor_inicial?: string,
    @Query('valor_final') valor_final?: string,
    @Query('relatorio') relatorio?: string,
  ) {
    const filters = {
      nome,
      id_lote: id_lote ? parseInt(id_lote) : undefined,
      valor_inicial: valor_inicial ? parseFloat(valor_inicial) : undefined,
      valor_final: valor_final ? parseFloat(valor_final) : undefined,
    };

    if (relatorio === '1') {
      const result = await this.generateBoletosReportUseCase.execute(filters);

      if (result instanceof Left) {
        throw new HttpException(
          { error: result.value },
          HttpStatus.BAD_REQUEST,
        );
      }

      return { base64: result.value.base64 };
    }

    const result = await this.listBoletosUseCase.execute(filters);

    if (result instanceof Left) {
      throw new HttpException({ error: result.value }, HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      data: result.value,
    };
  }
}
