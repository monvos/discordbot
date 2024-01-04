const { SlashCommandBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getTransactions() {
  const transactions = await prisma.transaction.findMany();
  return transactions;
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName('cmduser')
    .setDescription('Transactions')
    .addStringOption(option =>
      option.setName('win')
        .setDescription('Vem vann?')),
  async execute(interaction) {
    const transactions = await getTransactions();

    const options = transactions.map((x) => ({
      name: x.amount + x.id,
      description: 'The amount',
      type: 4,
      choices: [{ name: x.amount + x.id, value: x.amount + x.id }],
    }))

    await interaction.client.guilds.cache.get(interaction.guildId).commands.edit(interaction.commandId, {
      name: 'cmduser',
      description: 'Transactions',
      options: options,
    })

    await interaction.reply({ content: 'Command updated with new user options!', ephemeral: true });

  },
};