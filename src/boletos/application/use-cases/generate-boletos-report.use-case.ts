import { Inject, Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import {
  BoletoRepository,
  ListBoletosFilters,
} from '../../domain/repositories/boleto.repository';
import { Result, left, right } from '../../../shared/result';
import { Buffer } from 'buffer';
import { logger } from '../../../shared/logger';
import { Data } from '../../domain/value-objects/data.vo';

@Injectable()
export class GenerateBoletosReportUseCase {
  constructor(
    @Inject('BoletoRepository')
    private readonly boletoRepo: BoletoRepository,
  ) {}

  async execute(
    filters: ListBoletosFilters,
  ): Promise<Result<string, { base64: string }>> {
    try {
      const boletos = await this.boletoRepo.findMany(filters);

      logger.info(
        `Gerando relatório de boletos com ${boletos.length} registros`,
      );

      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {});

      doc.fontSize(16).text('Relatório de Boletos', { align: 'center' });
      doc.moveDown();

      doc.fontSize(10);
      doc.text('ID | Nome Sacado | ID Lote | Valor | Linha Digitável | Data de Criação', {
        underline: true,
      });

      boletos.forEach((boleto) => {
        const dataCriacao = Data.create(boleto.criadoEm);
        const dataStr = dataCriacao.isRight()
          ? dataCriacao.value.formatPtBr()
          : '-';

        doc.text(
          `${boleto.id} | ${boleto.nomeSacado} | ${boleto.idLote} | R$ ${boleto.valor.toFixed(
            2,
          )} | ${boleto.linhaDigitavel} | ${dataStr}`,
        );
        logger.debug(`Boleto ${boleto.id} incluído no relatório`);
      });

      doc.end();

      return await new Promise((resolve) => {
        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const base64 = buffer.toString('base64');
          logger.info(
            `Relatório gerado com sucesso (${boletos.length} boletos)`,
          );
          resolve(right({ base64 }));
        });
      });
    } catch (error) {
      logger.error({ err: error }, 'Erro ao gerar relatório de boletos');
      return left('Erro ao gerar relatório');
    }
  }
}
