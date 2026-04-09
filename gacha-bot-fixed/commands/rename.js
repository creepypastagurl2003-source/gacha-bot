const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot, setMascot } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rename')
        .setDescription('Give your mascot a new name! 📛')
        .addStringOption(opt =>
            opt.setName('name').setDescription('The new name').setRequired(true)
        ),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const oldName = mascot.name;
        const newName = interaction.options.getString('name').slice(0, 32);
        mascot.name = newName;
        setMascot(interaction.user.id, interaction.guildId, mascot);

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} Name Updated!`)
            .setDescription(`*${oldName} is now known as... **${newName}**.*`)
            .setColor(getMoodColor(mascot.mood))
            .setFooter({ text: 'A name is just the beginning. 🌸' });

        await interaction.reply({ embeds: [embed] });
    },
};
