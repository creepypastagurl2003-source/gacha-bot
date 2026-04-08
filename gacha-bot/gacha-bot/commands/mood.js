const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor, getMoodEmoji } = require('../utils/responses');

const MOOD_DESCRIPTIONS = {
    happy: 'Bright-eyed and radiating warmth. Everything feels good right now.',
    sad: 'Quiet and withdrawn. Something is weighing on her heart.',
    excited: 'Barely containable! Energy is at maximum, words are coming out too fast.',
    bored: 'Flat. Unimpressed. Could be doing literally anything else.',
    jealous: 'Watchful. Calculating. Keeping very careful track of things.',
    loving: 'Soft and devoted. You have her full, warm, undivided attention.',
    sleepy: 'Half-lidded and drifting. Probably going to fall asleep mid-sentence.',
    angry: 'Tense. Precise. Do not push it right now.',
    confused: 'Blinking rapidly. The processing bar is at 4%.',
    content: 'Settled and at peace. A rare and precious state.',
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mood')
        .setDescription("Check your mascot's current mood! 🌸"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const emoji = getMoodEmoji(mascot.mood);
        const desc = MOOD_DESCRIPTIONS[mascot.mood] || 'Somewhere between everything and nothing.';

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name}'s Mood`)
            .setDescription(`${emoji} **${mascot.mood.charAt(0).toUpperCase() + mascot.mood.slice(1)}**\n\n*${desc}*`)
            .setColor(getMoodColor(mascot.mood))
            .addFields({ name: '⚡ Energy', value: mascot.energy, inline: true })
            .setFooter({ text: 'Moods shift. Check back later. 🌙' });

        await interaction.reply({ embeds: [embed] });
    },
};
