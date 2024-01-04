const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modal')
    .setDescription('A modal test!'),
  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('myModal')
      .setTitle('My Modal');

    const favoriteColorInput = new TextInputBuilder()
      .setCustomId('favoriteColorInput')
      .setLabel("What's your favorite color?")
      .setStyle(TextInputStyle.Short);

    const hobbiesInput = new TextInputBuilder()
      .setCustomId('hobbiesInput')
      .setLabel("What's some of your favorite hobbies? LULUL")
      .setStyle(TextInputStyle.Paragraph);

    const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
    const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);

    interaction
      .awaitModalSubmit({ time: 30000 })
      .then((modalInteraction) => {
        const favColorValue = modalInteraction.fields.getTextInputValue('favoriteColorInput');
        const favHobValye = modalInteraction.fields.getTextInputValue('hobbiesInput');
        console.log({ favColorValue, favHobValye });
        modalInteraction.reply('Noice!');
      });
  },
};