import { Module } from '@nestjs/common';
import { ImportBoletosUseCase } from './application/use-cases/import-boletos.use-case';

@Module({
  providers: [ImportBoletosUseCase],
  exports: [ImportBoletosUseCase],
})
export class BoletosModule {}
