const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const getAllUsers = require('../../utils/dbtest.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('dbusers')
    .setDescription('Get all users in db.'),
  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('Users');

    const users = await getAllUsers();

    for (const user of users) {
      embed.addFields({ name: '\u200B', value: `ID: ${user.id} | Username: ${user.name} | Points: ${user.points}` });
    }
    await interaction.reply({ embeds: [embed] });

  },
};