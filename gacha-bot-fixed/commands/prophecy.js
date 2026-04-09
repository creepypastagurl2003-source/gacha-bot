const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');
const { MASCOT_TYPES } = require('../utils/mascotTypes');

const PROPHECY_OPENINGS = [
    "The stars have spoken and their message is this:",
    "From the void between moments, a vision emerges:",
    "The threads of fate have been read. They say:",
    "In the space between heartbeats, destiny whispers:",
    "The ancient records foretold this moment:",
    "What was written cannot be unwritten:",
];

const PROPHECY_MIDDLES = {
    Fantasy: [
        "she who wields {energy} energy shall face a trial of three shadows",
        "the {type} born of starlight will be tested before she may ascend",
        "when the moon breaks, the {type} alone will hold what remains",
        "her power will grow in the place where light fears to enter",
    ],
    Aesthetic: [
        "the one defined by {energy} will find her purpose in an unexpected mirror",
        "beauty and chaos are two sides of the same truth she must face",
        "the {type} shall be the last to understand what made her significant",
        "what she builds will outlast her and that is the point",
    ],
    Tech: [
        "the {type} will encounter a signal she cannot decode — and that is the answer",
        "somewhere in the data is a message written before she existed",
        "the system will break exactly once. she will be there when it does",
        "to evolve, she must first allow herself to glitch completely",
    ],
    Cute: [
        "the soft ones carry the heaviest truths",
        "the {type} will be underestimated once, and that will be her advantage",
        "warmth given freely returns as something far greater",
        "her greatest strength has always looked like a weakness from the outside",
    ],
    Chaotic: [
        "even chaos has a center. she will find hers when everything else falls away",
        "the {type} will be the one still standing when the storm clears",
        "unpredictability is not a flaw — it is her greatest weapon and she will learn this",
        "the day she chooses stillness will change everything",
    ],
    Royal: [
        "a crown is not given. it is earned in the moments no one is watching",
        "the {type} will be called upon and she will not hesitate",
        "her loyalty will be tested by the one she least expects",
        "power without purpose ends. she will find her purpose or forge it",
    ],
};

const PROPHECY_ENDINGS = [
    "And when this comes to pass, nothing will be the same.",
    "This is not a warning. This is a promise.",
    "The question is not if — only when.",
    "She already carries the answer. She simply hasn't opened it yet.",
    "The ending was written. The journey is hers.",
    "Whether she is ready or not, the moment will arrive.",
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prophecy')
        .setDescription("Reveal your mascot's destiny! 🔮"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const typeData = MASCOT_TYPES[mascot.type];
        const category = typeData.category;
        const middles = PROPHECY_MIDDLES[category] || PROPHECY_MIDDLES.Fantasy;

        const opening = PROPHECY_OPENINGS[Math.floor(Math.random() * PROPHECY_OPENINGS.length)];
        const middle = middles[Math.floor(Math.random() * middles.length)]
            .replace('{energy}', mascot.energy)
            .replace('{type}', mascot.type);
        const ending = PROPHECY_ENDINGS[Math.floor(Math.random() * PROPHECY_ENDINGS.length)];

        const embed = new EmbedBuilder()
            .setTitle(`🔮 The Prophecy of ${mascot.name}`)
            .setDescription(`*${opening}*\n\n**"...${middle}..."**\n\n*${ending}*`)
            .setColor(0x6a0dad)
            .addFields({ name: '✨ Type', value: `${mascot.emoji} ${mascot.type}`, inline: true })
            .setFooter({ text: 'The stars do not lie. They simply withhold. 🌙' });

        await interaction.reply({ embeds: [embed] });
    },
};
