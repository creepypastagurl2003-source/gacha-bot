const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getAllMascots } = require('../utils/storage');
const { getMoodColor, getMoodEmoji } = require('../utils/responses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('View all mascots in your collection! 📜'),

    async execute(interaction) {
        const { mascots, activeMascotId } = getAllMascots(interaction.user.id, interaction.guildId);

        if (mascots.length === 0) {
            return interaction.reply({ content: "You don't have any mascots yet! Use `/mascot` to generate your first one. ✨", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(`📜 ${interaction.user.username}'s Collection`)
            .setDescription(`**${mascots.length}** mascot${mascots.length !== 1 ? 's' : ''} in roster`)
            .setColor(0x5865f2);

        for (const m of mascots) {
            const isActive = m.id === activeMascotId;
            const genderTag = m.gender ? `${m.gender.emoji} ${m.gender.pronouns}` : '';
            const evoStars = '✦'.repeat(m.evolutionLevel || 0) || '—';
            embed.addFields({
                name: `${isActive ? '⭐ ' : ''}${m.emoji} ${m.name} ${isActive ? '(Active)' : ''}`,
                value: [
                    `\`ID: ${m.id}\``,
                    `✨ **${m.type}** • ${genderTag}`,
                    `⚡ ${m.energy} • ${getMoodEmoji(m.mood)} ${m.mood}`,
                    `🌱 Evo ${m.evolutionLevel || 0} ${evoStars}`,
                    isActive ? '*Use /talk /outfit /stats etc.*' : `*Use \`/select ${m.id}\` to activate*`,
                ].join('\n'),
                inline: true,
            });
        }

        embed.setFooter({ text: `Active: ${activeMascotId ? mascots.find(m => m.id === activeMascotId)?.name ?? 'None' : 'None'} • /select <id> to switch` });

        await interaction.reply({ embeds: [embed] });
    },
};
