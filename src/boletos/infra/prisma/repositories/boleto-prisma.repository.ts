import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { BoletoRepository, ListBoletosFilters } from '../../../domain/repositories/boleto.repository';

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

  async findMany(filters: ListBoletosFilters): Promise<
    Array<{
      id: number;
      nomeSacado: string;
      idLote: number;
      valor: number;
      linhaDigitavel: string;
      criadoEm: Date;
    }>
  > {
    const where: any = {};

    if (filters.nome) {
      where.nomeSacado = {
        contains: filters.nome,
        mode: 'insensitive',
      };
    }

    if (filters.id_lote) {
      where.idLote = filters.id_lote;
    }

    if (filters.valor_inicial || filters.valor_final) {
      where.valor = {};
      if (filters.valor_inicial) where.valor.gte = filters.valor_inicial;
      if (filters.valor_final) where.valor.lte = filters.valor_final;
    }

    const boletos = await this.prisma.boleto.findMany({
      where,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        nomeSacado: true,
        idLote: true,
        valor: true,
        linhaDigitavel: true,
        criadoEm: true,
      },
    });

    return await Promise.all(
      boletos.map((b) => ({
        ...b,
        valor: Number(b.valor),
      })),
    );
  }
}
