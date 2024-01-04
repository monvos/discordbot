const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Get a random cat image.'),

  async execute(interaction) {
    const url = 'https://api.thecatapi.com/v1/images/search';
    await axios.get(url)
      .then(response => {
        console.log(response.data[0].url);

        const embed = new EmbedBuilder()
          .setTitle('Here is a Cat! LUL!')
          .setImage(response.data[0].url);


        interaction.reply({ embeds: [embed] });
      })
      .catch(error => {
        console.error(error);
      });

  },
};