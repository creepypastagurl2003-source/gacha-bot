const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');

const FORMS = [
    {
        name: 'Base Form',
        suffix: '',
        description: 'She is as she was found — full of potential, still discovering her edges.',
        aura: 'A quiet, unassuming glow. Easy to overlook. That\'s the point.',
        power: 'Untapped.',
    },
    {
        name: 'Awakened Form',
        suffix: '✦',
        description: 'Something cracked open. She is aware of herself in a way she wasn\'t before.',
        aura: 'Brighter. More defined. Like she finally decided to take up space.',
        power: 'Growing and visible.',
    },
    {
        name: 'True Form',
        suffix: '✦✦',
        description: 'This is who she actually is — no performance, no filter. Rare to witness.',
        aura: 'Intense and unmistakable. The room shifts when she enters it.',
        power: 'Fully realized.',
    },
    {
        name: 'Ascended Form',
        suffix: '✦✦✦',
        description: 'She has passed through every version of herself and kept going. This is beyond.',
        aura: 'Transcendent. Something between presence and myth.',
        power: 'Absolute.',
    },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('form')
        .setDescription("View your mascot's current evolution form! 🌱"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const level = Math.min(mascot.evolutionLevel || 0, 3);
        const form = FORMS[level];

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} ${form.suffix} — ${form.name}`)
            .setDescription(`*${form.description}*`)
            .setColor(getMoodColor(mascot.mood))
            .addFields(
                { name: '✨ Type', value: `${mascot.emoji} ${mascot.type}`, inline: true },
                { name: '🌱 Evolution Level', value: `${level} / 3`, inline: true },
                { name: '💫 Aura', value: form.aura, inline: false },
                { name: '⚡ Power State', value: form.power, inline: false },
            )
            .setFooter({ text: level < 3 ? 'Use /evolve to grow further. 🌱' : 'She has reached her final form. ✦✦✦' });

        await interaction.reply({ embeds: [embed] });
    },
};
