import { Module } from '@nestjs/common';
import { PrismaModule } from './boletos/infra/prisma/prisma.module';
import { BoletosModule } from './boletos/boletos.module';

@Module({
  imports: [PrismaModule, BoletosModule],
})
export class AppModule {}
