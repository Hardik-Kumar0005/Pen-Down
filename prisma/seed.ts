// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Use "upsert":
  // - If a user with this email exists, it does nothing.
  // - If they don't exist, it creates them.
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {}, // No updates needed if user exists
    create: {
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });