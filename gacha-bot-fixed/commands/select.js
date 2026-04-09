const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { setActiveMascot, getMascotById, getAllMascots } = require('../utils/storage');
const { getMoodColor, getMoodEmoji } = require('../utils/responses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('select')
        .setDescription('Set your active mascot! 🎯')
        .addStringOption(opt =>
            opt.setName('id').setDescription('The mascot ID to activate').setRequired(true)
        ),

    async execute(interaction) {
        const id = interaction.options.getString('id').toUpperCase();
        const mascot = getMascotById(interaction.user.id, interaction.guildId, id);

        if (!mascot) {
            const { mascots } = getAllMascots(interaction.user.id, interaction.guildId);
            const ids = mascots.map(m => `\`${m.id}\` ${m.emoji} ${m.name}`).join('\n') || 'None';
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ Mascot not found')
                        .setDescription(`No mascot with ID \`${id}\` in your collection.\n\n**Your mascots:**\n${ids}`)
                        .setColor(0xff6b6b),
                ],
                ephemeral: true,
            });
        }

        setActiveMascot(interaction.user.id, interaction.guildId, id);

        const embed = new EmbedBuilder()
            .setTitle(`⭐ Active mascot set!`)
            .setDescription(`**${mascot.name}** is now your active mascot.`)
            .setColor(getMoodColor(mascot.mood))
            .addFields(
                { name: '🆔 ID', value: `\`${id}\``, inline: true },
                { name: '✨ Type', value: `${mascot.emoji} ${mascot.type}`, inline: true },
                { name: `${getMoodEmoji(mascot.mood)} Mood`, value: mascot.mood, inline: true },
            )
            .setFooter({ text: 'All commands now use this mascot. ✨' });

        await interaction.reply({ embeds: [embed] });
    },
};
