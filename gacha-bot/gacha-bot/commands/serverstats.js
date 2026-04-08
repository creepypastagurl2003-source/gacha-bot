const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function ageString(createdAt) {
    const now = new Date();
    const diff = now - createdAt;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    if (years > 0) return `${years}y ${months}m`;
    if (months > 0) return `${months} month${months !== 1 ? 's' : ''}`;
    return `${days} day${days !== 1 ? 's' : ''}`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverstats')
        .setDescription('View detailed stats for this server! 🌍'),

    async execute(interaction) {
        await interaction.deferReply();
        const g = interaction.guild;
        await g.fetch();

        const members = g.memberCount;
        const bots = g.members.cache.filter(m => m.user.bot).size;
        const humans = members - bots;
        const textChannels = g.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = g.channels.cache.filter(c => c.type === 2).size;
        const categories = g.channels.cache.filter(c => c.type === 4).size;
        const roles = g.roles.cache.size - 1;
        const emojis = g.emojis.cache.size;
        const boosts = g.premiumSubscriptionCount || 0;
        const boostTier = g.premiumTier;
        const age = ageString(g.createdAt);
        const owner = await g.fetchOwner();

        const embed = new EmbedBuilder()
            .setTitle(`📊 ${g.name} — Server Stats`)
            .setColor(0x5865f2)
            .addFields(
                { name: '👥 Total Members', value: `${members}`, inline: true },
                { name: '🧍 Humans', value: `${humans}`, inline: true },
                { name: '🤖 Bots', value: `${bots}`, inline: true },
                { name: '💬 Text Channels', value: `${textChannels}`, inline: true },
                { name: '🔊 Voice Channels', value: `${voiceChannels}`, inline: true },
                { name: '📁 Categories', value: `${categories}`, inline: true },
                { name: '🎭 Roles', value: `${roles}`, inline: true },
                { name: '😄 Emojis', value: `${emojis}`, inline: true },
                { name: '💎 Boosts', value: `${boosts} (Tier ${boostTier})`, inline: true },
                { name: '🎂 Server Age', value: age, inline: true },
                { name: '📅 Created', value: g.createdAt.toDateString(), inline: true },
                { name: '👑 Owner', value: owner.user.username, inline: true },
            );

        if (g.icon) embed.setThumbnail(g.iconURL({ dynamic: true }));

        await interaction.editReply({ embeds: [embed] });
    },
};
