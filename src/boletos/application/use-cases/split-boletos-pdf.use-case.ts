import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { left, right, Result } from '../../../shared/result';

@Injectable()
export class SplitBoletosPdfUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(pdfBuffer: Buffer): Promise<Result<string, { total: number }>> {
    const boletos = await this.prisma.boleto.findMany({
      orderBy: { id: 'asc' },
      select: { id: true },
    });

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();

    if (totalPages !== boletos.length) {
      return left(
        `Número de páginas (${totalPages}) é diferente da quantidade de boletos (${boletos.length})`,
      );
    }

    const outputDir = join(__dirname, '../../../../tmp/boletos');
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

    for (let i = 0; i < boletos.length; i++) {
      const boleto = boletos[i];
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(page);

      const pdfBytes = await newPdf.save();
      const filePath = join(outputDir, `${boleto.id}.pdf`);
      writeFileSync(filePath, pdfBytes);
    }

    return right({ total: boletos.length });
  }
}
