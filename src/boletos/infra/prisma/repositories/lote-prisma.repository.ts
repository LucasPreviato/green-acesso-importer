import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LoteRepository } from '../../../domain/repositories/lote.repository';

@Injectable()
export class LotePrismaRepository implements LoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByNome(nome: string): Promise<{ id: number } | null> {
    return this.prisma.lote.findUnique({
      where: { nome },
      select: { id: true },
    });
  }
}
