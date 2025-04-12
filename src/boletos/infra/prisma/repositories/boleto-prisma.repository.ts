import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BoletoRepository } from '../../../domain/repositories/boleto.repository';

@Injectable()
export class BoletoPrismaRepository implements BoletoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    nomeSacado: string;
    idLote: number;
    valor: number;
    linhaDigitavel: string;
  }): Promise<number> {
    const boleto = await this.prisma.boleto.create({ data });
    return boleto.id;
  }
}
