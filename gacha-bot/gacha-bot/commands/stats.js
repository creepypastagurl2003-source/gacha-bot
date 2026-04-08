const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot, setMascot } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');
const { MASCOT_TYPES } = require('../utils/mascotTypes');

function generateStats(type, energy) {
    const typeData = MASCOT_TYPES[type];
    const category = typeData.category;

    const base = () => Math.floor(Math.random() * 40) + 30;

    const modifiers = {
        Fantasy: { power: 15, charm: 10, mystery: 20 },
        Aesthetic: { charm: 25, mystery: 15, style: 20 },
        Tech: { power: 10, speed: 20, mystery: 10 },
        Cute: { charm: 25, luck: 20 },
        Chaotic: { power: 15, speed: 25, chaos: 30 },
        Royal: { power: 20, charm: 15, luck: 10 },
    };

    const mods = modifiers[category] || {};

    const clamp = (v) => Math.min(100, Math.max(1, v));

    return {
        power: clamp(base() + (mods.power || 0)),
        charm: clamp(base() + (mods.charm || 0)),
        speed: clamp(base() + (mods.speed || 0)),
        mystery: clamp(base() + (mods.mystery || 0)),
        luck: clamp(base() + (mods.luck || 0)),
        chaos: clamp(base() + (mods.chaos || 0)),
    };
}

function statBar(value) {
    const filled = Math.round(value / 10);
    return '█'.repeat(filled) + '░'.repeat(10 - filled) + ` ${value}`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription("View your mascot's stats! 📊"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        if (!mascot.stats) {
            mascot.stats = generateStats(mascot.type, mascot.energy);
            setMascot(interaction.user.id, interaction.guildId, mascot);
        }

        const s = mascot.stats;
        const total = Object.values(s).reduce((a, b) => a + b, 0);
        const evolutionLevel = mascot.evolutionLevel || 0;

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} — Stats`)
            .setColor(getMoodColor(mascot.mood))
            .addFields(
                { name: '⚔️ Power', value: statBar(s.power), inline: false },
                { name: '💖 Charm', value: statBar(s.charm), inline: false },
                { name: '💨 Speed', value: statBar(s.speed), inline: false },
                { name: '🔮 Mystery', value: statBar(s.mystery), inline: false },
                { name: '🍀 Luck', value: statBar(s.luck), inline: false },
                { name: '🌀 Chaos', value: statBar(s.chaos), inline: false },
                { name: '✨ Total Power', value: `${total} / 600`, inline: true },
                { name: '🌱 Evolution', value: `Level ${evolutionLevel}`, inline: true },
            )
            .setFooter({ text: `Stats are fixed to your mascot's type and nature. 📊` });

        await interaction.reply({ embeds: [embed] });
    },
};
