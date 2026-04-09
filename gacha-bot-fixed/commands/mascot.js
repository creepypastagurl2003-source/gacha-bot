const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { addMascot } = require('../utils/storage');
const { generatePalette } = require('../utils/colorSystem');
const { MASCOT_TYPES, ALL_TYPES, ENERGIES, MOODS, pickGender, pickName } = require('../utils/mascotTypes');
const { getMoodColor, getMoodEmoji } = require('../utils/responses');

function generateMascot() {
    const type = ALL_TYPES[Math.floor(Math.random() * ALL_TYPES.length)];
    const typeData = MASCOT_TYPES[type];
    const gender = pickGender();
    const name = pickName(gender);
    const age = Math.random() < 0.1 ? '???' : String(Math.floor(Math.random() * 8) + 14);
    const energy = ENERGIES[Math.floor(Math.random() * ENERGIES.length)];
    const mood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const colors = generatePalette(type);
    const personality = typeData.personalities[Math.floor(Math.random() * typeData.personalities.length)];
    return {
        name, age, energy, type, mood, gender,
        colors,
        signatureTrait: `Always seems ${personality}`,
        interactionStyle: typeData.dialogueStyle,
        catchphrases: typeData.catchphraseTemplates,
        lore: typeData.loreTemplate,
        accessories: typeData.accessories,
        emoji: typeData.emoji,
        evolutionLevel: 0,
    };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mascot')
        .setDescription('Generate a new mascot and add them to your collection! ✨'),

    async execute(interaction) {
        const mascot = generateMascot();
        const id = addMascot(interaction.user.id, interaction.guildId, mascot);

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} has joined your collection!`)
            .setDescription(`*${mascot.lore}*`)
            .setColor(getMoodColor(mascot.mood))
            .addFields(
                { name: '🆔 ID', value: `\`${id}\``, inline: true },
                { name: '📛 Name', value: mascot.name, inline: true },
                { name: '🎂 Age', value: mascot.age, inline: true },
                { name: `${mascot.gender.emoji} Gender`, value: `${mascot.gender.label} (${mascot.gender.pronouns})`, inline: true },
                { name: '⚡ Energy', value: mascot.energy, inline: true },
                { name: '✨ Type', value: `${mascot.emoji} ${mascot.type}`, inline: true },
                { name: `${getMoodEmoji(mascot.mood)} Mood`, value: mascot.mood, inline: true },
                { name: '🎀 Accessories', value: mascot.accessories.slice(0, 2).join(', '), inline: true },
                { name: '🌱 Evolution', value: 'Level 0', inline: true },
                { name: '🎨 Palette', value: mascot.colors.paletteName, inline: false },
                { name: '💇 Hair', value: `Main: \`${mascot.colors.hair.main}\`  Sub: \`${mascot.colors.hair.sub}\`  Outline: \`${mascot.colors.hair.outline}\``, inline: false },
                { name: '👁️ Eyes', value: `Main: \`${mascot.colors.eyes.main}\`  Sub: \`${mascot.colors.eyes.sub}\`  Outline: \`${mascot.colors.eyes.outline}\``, inline: false },
                { name: '👗 Outfit', value: `Top: \`${mascot.colors.outfit.top}\`  Bottom: \`${mascot.colors.outfit.bottom}\`  Outline: \`${mascot.colors.outfit.outline}\``, inline: false },
                { name: '🌟 Signature Trait', value: mascot.signatureTrait, inline: false },
                { name: '💬 Catchphrases', value: mascot.catchphrases.join('\n'), inline: false },
            )
            .setFooter({ text: `ID: ${id} • Use /list to see your collection • /select ${id} to set active` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },

    generateMascot,
};
