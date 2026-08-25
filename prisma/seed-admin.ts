import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_INITIAL_LOGIN;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  const name = process.env.ADMIN_INITIAL_NAME ?? username;
  const email = process.env.ADMIN_INITIAL_EMAIL || null;

  if (!username || !password) {
    throw new Error(
      "Defina ADMIN_INITIAL_LOGIN e ADMIN_INITIAL_PASSWORD para criar/atualizar o administrador inicial.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { username },
    update: {
      email,
      name,
      passwordHash,
      role: "ADMIN",
      active: true,
    },
    create: {
      username,
      email,
      name,
      passwordHash,
      role: "ADMIN",
      active: true,
    },
    select: {
      id: true,
      username: true,
      role: true,
      active: true,
    },
  });

  console.log(`Administrador pronto: ${user.username} (${user.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
