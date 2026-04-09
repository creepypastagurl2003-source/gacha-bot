const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor, getMoodEmoji, getTalkLine } = require('../utils/responses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('talk')
        .setDescription('Let your mascot speak! 💬'),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const line = getTalkLine(mascot.mood);
        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} says...`)
            .setDescription(`*"${line}"*`)
            .setColor(getMoodColor(mascot.mood))
            .setFooter({ text: `Mood: ${getMoodEmoji(mascot.mood)} ${mascot.mood} • Energy: ${mascot.energy}` });

        await interaction.reply({ embeds: [embed] });
    },
};
