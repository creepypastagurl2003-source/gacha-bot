const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot, setMascot } = require('../utils/storage');
const { ENERGIES } = require('../utils/mascotTypes');
const { getMoodColor } = require('../utils/responses');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('energy')
        .setDescription("Change your mascot's energy type! ⚡")
        .addStringOption(opt =>
            opt.setName('type')
                .setDescription('Choose an energy type')
                .setRequired(true)
                .addChoices(...ENERGIES.map(e => ({ name: e, value: e })))
        ),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const oldEnergy = mascot.energy;
        const newEnergy = interaction.options.getString('type');
        mascot.energy = newEnergy;
        setMascot(interaction.user.id, interaction.guildId, mascot);

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name}'s Energy Shifted!`)
            .setDescription(`*From **${oldEnergy}** to **${newEnergy}**...*\n\nSomething has changed. You can feel it.`)
            .setColor(getMoodColor(mascot.mood))
            .setFooter({ text: 'Energy shapes everything. ⚡' });

        await interaction.reply({ embeds: [embed] });
    },
};
