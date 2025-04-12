import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BoletoPrismaRepository } from './repositories/boleto-prisma.repository';
import { LotePrismaRepository } from './repositories/lote-prisma.repository';
@Global()
@Module({
  providers: [
    PrismaService,
    BoletoPrismaRepository,
    LotePrismaRepository,
    {
      provide: 'BoletoRepository',
      useClass: BoletoPrismaRepository,
    },
    {
      provide: 'LoteRepository',
      useClass: LotePrismaRepository,
    },
  ],
  exports: ['BoletoRepository', 'LoteRepository', PrismaService],
})
export class PrismaModule {}
