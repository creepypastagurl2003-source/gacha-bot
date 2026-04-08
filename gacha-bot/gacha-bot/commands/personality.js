const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { MASCOT_TYPES } = require('../utils/mascotTypes');
const { getMoodColor } = require('../utils/responses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('personality')
        .setDescription("View your mascot's full personality breakdown! 🎭"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const typeData = MASCOT_TYPES[mascot.type];

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} — Personality`)
            .setColor(getMoodColor(mascot.mood))
            .addFields(
                { name: '⚡ Energy Type', value: mascot.energy, inline: true },
                { name: '✨ Mascot Type', value: `${mascot.emoji} ${mascot.type}`, inline: true },
                { name: '🌟 Signature Trait', value: mascot.signatureTrait, inline: false },
                { name: '💬 Interaction Style', value: mascot.interactionStyle, inline: false },
                { name: '🎭 Type Traits', value: typeData.personalities.join(', '), inline: false },
                { name: '💬 Catchphrases', value: mascot.catchphrases.join('\n'), inline: false },
            )
            .setFooter({ text: 'Every detail matters. 🌸' });

        await interaction.reply({ embeds: [embed] });
    },
};
