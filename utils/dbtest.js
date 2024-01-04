const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAllUsers() {
  const users = await prisma.user.findMany();
  return users;
}

module.exports = getAllUsers;
