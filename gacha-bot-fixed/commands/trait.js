const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');

const TRAIT_DETAILS = [
    "This trait emerged early — it defines everything she does without her realizing it.",
    "She has no idea this is her defining characteristic. Everyone else does.",
    "It started as a coping mechanism and became her entire personality.",
    "Ancient, instinctual, and completely non-negotiable.",
    "She's been this way forever. She'll be this way forever. And that's okay.",
    "The trait chose her, not the other way around.",
    "It shows up most in the moments she thinks no one is watching.",
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('trait')
        .setDescription("Reveal your mascot's signature trait! 🌟"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const detail = TRAIT_DETAILS[Math.floor(Math.random() * TRAIT_DETAILS.length)];

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name}'s Signature Trait`)
            .setDescription(`**${mascot.signatureTrait}**\n\n*${detail}*`)
            .setColor(getMoodColor(mascot.mood))
            .addFields({ name: '✨ Type', value: `${mascot.emoji} ${mascot.type}`, inline: true })
            .setFooter({ text: 'Some things just are. 🌸' });

        await interaction.reply({ embeds: [embed] });
    },
};
