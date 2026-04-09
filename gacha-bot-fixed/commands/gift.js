const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor, getGiftReaction, pick } = require('../utils/responses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gift')
        .setDescription('Give your mascot a gift! 🎁')
        .addStringOption(opt =>
            opt.setName('item').setDescription('What are you giving?').setRequired(true)
        ),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const item = interaction.options.getString('item');
        const reactions = getGiftReaction(item);
        const line = pick(reactions);

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} received: ${item}!`)
            .setDescription(`*"${line}"*`)
            .setColor(getMoodColor(mascot.mood))
            .setFooter({ text: `Every gift is treasured. 🎀` });

        await interaction.reply({ embeds: [embed] });
    },
};
