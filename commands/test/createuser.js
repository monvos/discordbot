const { SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('createuser')
    .setDescription('Creates a user in the db!'),
  async execute(interaction) {

    const prisma = new PrismaClient()

    async function main() {
      await prisma.user.create({
        data: {
          id: parseInt(interaction.user.id),
          name: interaction.user.username,
          points: 500,
        },
      })
    }

    main()
      .then(async () => {
        await prisma.$disconnect()
      })
      .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
      })

    await interaction.reply(`Created user ${interaction.user.username}.`);
  },
};