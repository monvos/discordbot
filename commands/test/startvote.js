const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { PrismaClient } = require('@prisma/client');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('startvote')
    .setDescription('Start a prediction')
    .addStringOption(option =>
      option.setName('desc')
        .setDescription('Description.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('1')
        .setDescription('Option 1')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('2')
        .setDescription('Option 2')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('3')
        .setDescription('Option 3'))
    .addStringOption(option =>
      option.setName('4')
        .setDescription('Option 4'))
    .addStringOption(option =>
      option.setName('5')
        .setDescription('Option 5'))
    .addStringOption(option =>
      option.setName('6')
        .setDescription('Option 6'))
    .addStringOption(option =>
      option.setName('7')
        .setDescription('Option 7'))
    .addStringOption(option =>
      option.setName('8')
        .setDescription('Option 8'))
    .addStringOption(option =>
      option.setName('9')
        .setDescription('Option 9'))
    .addStringOption(option =>
      option.setName('10')
        .setDescription('Option 10')),
  async execute(interaction) {
    const interactionId = parseInt(interaction.id);
    const user = parseInt(interaction.user.id);
    const desc = interaction.options.getString('desc');

    const optionNames = ['1', '2', '3', '4 ', '5', '6', '7', '8', '9', '10',];
    const components = [];
    const body = [desc, []];
    optionNames.map(optionName => {
      const optionValue = interaction.options.getString(optionName);
      if (optionValue) {
        const obj = {
          'id': `${optionName}Btn`,
          'value': optionValue,
        }
        body[1].push(obj);
        console.log(obj);
        console.log(interaction.options.getString(optionName));
        const btn = new ButtonBuilder()
          .setCustomId(`${optionName}Btn`)
          .setLabel(optionValue)
          .setStyle(ButtonStyle.Primary);

        components.push(btn);
      }
    })
    console.log(body);
    console.log(user);


    const prisma = new PrismaClient()

    async function main() {
      await prisma.prediction.create({
        data: {
          id: interactionId,
          body: JSON.stringify(body),
          status: 'ACTIVE',
          userId: user,
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

    const row = new ActionRowBuilder()
      .addComponents(components);


    const response = await interaction.reply({ content: `${desc}`, components: [row] });

    const collector = response.createMessageComponentCollector({ time: 30000 });


    collector.on('collect', async i => {
      console.log(i.customId);
      console.log(interactionId);
      const btnUser = parseInt(i.user.id)

      const voteValue = body[1].find(obj => obj.id === i.customId);
      console.log(body[1].find(obj => obj.id === i.customId))

      const modal = new ModalBuilder()
        .setCustomId('bettingPointsModal')
        .setTitle(voteValue.value);

      const pointToBetInput = new TextInputBuilder()
        .setCustomId('pointToBetInput')
        .setLabel("Hur mycket vill du betta?")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Du har 1337 points att betta.');

      const firstActionRow = new ActionRowBuilder().addComponents(pointToBetInput);

      modal.addComponents(firstActionRow);

      await i.showModal(modal);

      const modalInteraction = await i.awaitModalSubmit({ time: 30000 });
      const pointsToBet = await modalInteraction.fields.getTextInputValue('pointToBetInput');
      console.log(pointsToBet);


      async function vote() {
        await prisma.vote.create({
          data: {
            answer: voteValue.value,
            predictionId: interactionId,
            userId: btnUser,
            amount: parseInt(pointsToBet),
          },
        })

      }

      vote()
        .then(async () => {
          await prisma.$disconnect()
        })
        .catch(async (e) => {
          console.error(e)
          await prisma.$disconnect()
          process.exit(1)
        })

      await modalInteraction.deferUpdate();
      await interaction.editReply({ content: `${desc} \n ${i.user} has betted ${pointsToBet}!`, components: [row] });
    });

    collector.on('end', async () => {
      await interaction.editReply({ content: `${desc} \n STÄNGD!`, components: [] });
    })
  },
};