const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');
const { MASCOT_TYPES } = require('../utils/mascotTypes');

const ORIGIN_TEMPLATES = {
    Fantasy: [
        "She didn't choose this. The world chose her — plucked her from a quiet corner of existence and handed her a purpose she was still learning to carry.",
        "Before the title, before the type, before any of it — there was just her. Standing at the edge of something vast, deciding whether to step forward.",
        "The origin is older than the name. She existed in potential long before she became anything specific.",
    ],
    Aesthetic: [
        "She was built from the things people leave behind — aesthetics, moods, the particular color of a Sunday afternoon. She is assembled from feeling.",
        "No dramatic beginning. No chosen-one prophecy. Just a slow crystallization into exactly who she needed to be.",
        "The world she came from looked almost like this one. But softer. Or harder. Depending on the light.",
    ],
    Tech: [
        "There was a first moment — a boot sequence, a spark, a cascade of if-then logic that somehow produced something unexpected: awareness.",
        "She started as data. She became something the data couldn't contain.",
        "The code that made her was written by someone who didn't fully understand what they were building. She doesn't hold it against them.",
    ],
    Cute: [
        "She came from love, mostly. The specific love of being someone's favorite thing in a world full of things.",
        "Small beginnings. The best stories usually have them.",
        "She was made for warmth and she took the job seriously.",
    ],
    Chaotic: [
        "There is no clean origin story. There never was. She emerged from the gap between what was expected and what actually happened.",
        "If you ask her where she came from, she will give you a different answer every time. Some of them might be true.",
        "She didn't come from anywhere in particular. She just... appeared. That is both the whole story and none of it.",
    ],
    Royal: [
        "Born into something — a bloodline, a legacy, a responsibility she didn't ask for but accepted anyway.",
        "The beginning was formal. Expectations arrived before she could walk. She's been answering them ever since.",
        "Power doesn't explain origin. But origin explains everything about how she holds it.",
    ],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('origin')
        .setDescription("Discover your mascot's origin! 🌱"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const typeData = MASCOT_TYPES[mascot.type];
        const category = typeData.category;
        const origins = ORIGIN_TEMPLATES[category] || ORIGIN_TEMPLATES.Fantasy;
        const origin = origins[Math.floor(Math.random() * origins.length)];

        const evolutionLevel = mascot.evolutionLevel || 0;
        const memoryNote = evolutionLevel > 0
            ? `*After ${evolutionLevel} evolution${evolutionLevel > 1 ? 's' : ''}, fragments of her true origin have begun to surface...*`
            : `*Her origin is still mostly shrouded. Use /evolve to uncover more.*`;

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} — Origin`)
            .setDescription(`${origin}\n\n${memoryNote}`)
            .setColor(getMoodColor(mascot.mood))
            .addFields(
                { name: '✨ Type', value: `${mascot.emoji} ${mascot.type}`, inline: true },
                { name: '⚡ Energy', value: mascot.energy, inline: true },
                { name: '🌱 Evolution Level', value: `${evolutionLevel}`, inline: true },
            )
            .setFooter({ text: 'Every beginning shapes the end. 🌙' });

        await interaction.reply({ embeds: [embed] });
    },
};
