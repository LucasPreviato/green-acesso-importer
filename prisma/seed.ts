import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const lotes = ['0017', '0018', '0019'];

  for (const nome of lotes) {
    await prisma.lote.upsert({
      where: { nome },
      update: {},
      create: {
        nome,
        ativo: true,
      },
    });
  }

  console.log('Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao rodar seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
