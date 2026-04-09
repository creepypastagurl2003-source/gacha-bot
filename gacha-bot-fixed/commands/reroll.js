const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getActiveMascot, getMascotById, updateMascot, getActiveMascotId } = require('../utils/storage');
const { getMoodColor, getMoodEmoji } = require('../utils/responses');
const { generateMascot } = require('./mascot');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reroll')
        .setDescription('Regenerate a mascot — keeps same ID and slot! 🔄')
        .addStringOption(opt =>
            opt.setName('id').setDescription('Mascot ID to reroll (default: active mascot)').setRequired(false)
        ),

    async execute(interaction) {
        const rawId = interaction.options.getString('id');
        const id = rawId ? rawId.toUpperCase() : getActiveMascotId(interaction.user.id, interaction.guildId);

        if (!id) {
            return interaction.reply({ content: "You don't have any mascots! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const old = getMascotById(interaction.user.id, interaction.guildId, id);
        if (!old) {
            return interaction.reply({ content: `No mascot with ID \`${id}\` found in your collection.`, ephemeral: true });
        }

        const mascot = generateMascot();
        mascot.id = id;
        updateMascot(interaction.user.id, interaction.guildId, id, mascot);

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} has taken ${old.name}'s place!`)
            .setDescription(`*${old.name} fades away as ${mascot.name} steps into the light...*\n\n${mascot.lore}`)
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
                { name: '🌱 Evolution', value: 'Level 0 (reset)', inline: true },
                { name: '🎨 Palette', value: mascot.colors.paletteName, inline: false },
                { name: '💇 Hair', value: `Main: \`${mascot.colors.hair.main}\`  Sub: \`${mascot.colors.hair.sub}\`  Outline: \`${mascot.colors.hair.outline}\``, inline: false },
                { name: '👁️ Eyes', value: `Main: \`${mascot.colors.eyes.main}\`  Sub: \`${mascot.colors.eyes.sub}\`  Outline: \`${mascot.colors.eyes.outline}\``, inline: false },
                { name: '🌟 Signature Trait', value: mascot.signatureTrait, inline: false },
                { name: '💬 Catchphrases', value: mascot.catchphrases.join('\n'), inline: false },
            )
            .setFooter({ text: `ID: ${id} preserved • Use /list to see your collection` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
