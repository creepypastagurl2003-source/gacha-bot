const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('palette')
        .setDescription("View your mascot's color palette! 🎨"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const c = mascot.colors;
        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name}'s Palette — ${c.paletteName}`)
            .setColor(getMoodColor(mascot.mood))
            .addFields(
                { name: '💇 Hair — Main', value: `\`${c.hair.main}\``, inline: true },
                { name: '💇 Hair — Sub', value: `\`${c.hair.sub}\``, inline: true },
                { name: '💇 Hair — Outline', value: `\`${c.hair.outline}\``, inline: true },
                { name: '👁️ Eyes — Main', value: `\`${c.eyes.main}\``, inline: true },
                { name: '👁️ Eyes — Sub', value: `\`${c.eyes.sub}\``, inline: true },
                { name: '👁️ Eyes — Outline', value: `\`${c.eyes.outline}\``, inline: true },
                { name: '👗 Outfit — Top', value: `\`${c.outfit.top}\``, inline: true },
                { name: '👗 Outfit — Bottom', value: `\`${c.outfit.bottom}\``, inline: true },
                { name: '👗 Outfit — Outline', value: `\`${c.outfit.outline}\``, inline: true },
                { name: '✨ Accessory Color', value: `\`${c.accessory}\``, inline: true },
            )
            .setFooter({ text: 'Format: R# D# — Gacha Club color coordinates 🎨' });

        await interaction.reply({ embeds: [embed] });
    },
};
