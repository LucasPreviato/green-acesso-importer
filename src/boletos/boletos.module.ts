import { Module } from '@nestjs/common';
import { ImportBoletosUseCase } from './application/use-cases/import-boletos.use-case';
import { BoletosController } from './infra/controllers/boletos.controller';
import { SplitBoletosPdfUseCase } from './application/use-cases/split-boletos-pdf.use-case';
import { ListBoletosUseCase } from './application/use-cases/list-boletos.use-case';
@Module({
  providers: [ImportBoletosUseCase,SplitBoletosPdfUseCase,ListBoletosUseCase],
  controllers: [BoletosController],
  exports: [ImportBoletosUseCase],
})
export class BoletosModule {}
