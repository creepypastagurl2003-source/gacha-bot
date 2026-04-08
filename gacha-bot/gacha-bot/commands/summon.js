const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor, getMoodEmoji } = require('../utils/responses');

const ENTRANCES = [
    "descends from above in a shower of light particles",
    "materializes from thin air with a dramatic spin",
    "steps through a glowing portal, perfectly on cue",
    "rises from the shadows with unnervingly perfect timing",
    "appears suddenly, as if she was always standing there",
    "crashes through the ceiling and somehow looks amazing doing it",
    "emerges from a swirl of petals and impossible color",
    "glitches into existence, one pixel at a time",
    "walks in casually, as if the dramatic entrance was YOUR idea",
    "manifests from pure energy and sheer force of personality",
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('summon')
        .setDescription('Dramatically summon your mascot! ✨'),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const entrance = ENTRANCES[Math.floor(Math.random() * ENTRANCES.length)];
        const catchphrase = mascot.catchphrases[Math.floor(Math.random() * mascot.catchphrases.length)];
        const moodEmoji = getMoodEmoji(mascot.mood);

        const embed = new EmbedBuilder()
            .setTitle(`✨ ${mascot.name} has arrived! ✨`)
            .setDescription(`*${mascot.name} ${entrance}.*\n\n**"${catchphrase}"**`)
            .setColor(getMoodColor(mascot.mood))
            .addFields(
                { name: '✨ Type', value: `${mascot.emoji} ${mascot.type}`, inline: true },
                { name: `${moodEmoji} Mood`, value: mascot.mood, inline: true },
                { name: '⚡ Energy', value: mascot.energy, inline: true },
            )
            .setFooter({ text: 'The stage is set. 🌟' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
