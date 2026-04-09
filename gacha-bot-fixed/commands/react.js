const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor, getReactLine } = require('../utils/responses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('react')
        .setDescription('Your mascot reacts to someone! 👀')
        .addUserOption(opt =>
            opt.setName('user').setDescription('Who to react to').setRequired(true)
        ),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const target = interaction.options.getUser('user');
        const line = getReactLine();

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} reacts to ${target.displayName || target.username}`)
            .setDescription(`*"${line}"*`)
            .setColor(getMoodColor(mascot.mood))
            .setFooter({ text: `Energy: ${mascot.energy}` });

        await interaction.reply({ embeds: [embed] });
    },
};
