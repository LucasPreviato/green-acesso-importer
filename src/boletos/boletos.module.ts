import { Module } from '@nestjs/common';
import { GenerateBoletosReportUseCase } from './application/use-cases/generate-boletos-report.use-case';
import { ImportBoletosUseCase } from './application/use-cases/import-boletos.use-case';
import { BoletosController } from './infra/controllers/boletos.controller';
import { SplitBoletosPdfUseCase } from './application/use-cases/split-boletos-pdf.use-case';
import { ListBoletosUseCase } from './application/use-cases/list-boletos.use-case';
@Module({
  providers: [ImportBoletosUseCase,SplitBoletosPdfUseCase,ListBoletosUseCase,GenerateBoletosReportUseCase],
  controllers: [BoletosController],
  exports: [ImportBoletosUseCase],
})
export class BoletosModule {}
