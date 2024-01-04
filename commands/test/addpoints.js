const { SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addpoints')
    .setDescription('Add points to a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Most select a user.')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('points')
        .setDescription('The amount of points.')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const points = interaction.options.getInteger('points');


    const prisma = new PrismaClient()

    async function main() {
      await prisma.user.update({
        where: {
          id: parseInt(user.id),
        },
        data: {
          points: {
            increment: points,
          },
          transactions: {
            create: [
              {
                operation: 'addition',
                amount: points,
                source: 'Added from /addpoints cmd.',
              },
            ],
          },
        },
        include: {
          transactions: true,
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

    await interaction.reply({ content: `Added ${points} points to user ${user}.`, ephemeral: true });
  },
};