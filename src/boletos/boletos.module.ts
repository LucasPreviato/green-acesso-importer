import { Module } from '@nestjs/common';
import { ImportBoletosUseCase } from './application/use-cases/import-boletos.use-case';
import { BoletosController } from './infra/controllers/boletos.controller';
@Module({
  providers: [ImportBoletosUseCase],
  controllers: [BoletosController],
  exports: [ImportBoletosUseCase],
})
export class BoletosModule {}
