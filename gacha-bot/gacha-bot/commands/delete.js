const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { deleteMascotById, getMascotById, getAllMascots } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');

const FAREWELLS = [
    'has faded back into the gacha void… 💫',
    'dissolved into glittering light and returned to wherever mascots go. ✨',
    'took a slow breath, smiled once, and vanished. 🌸',
    'stepped back through the portal, looking over their shoulder one last time. 🌙',
    'became stardust again. They were here. That mattered. 💕',
    'slipped quietly back into the unknown, carrying everything they were. 🫧',
    'said nothing — just gave a small wave, and was gone. 👋',
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Delete a mascot from your collection. 🗑️')
        .addStringOption(opt =>
            opt.setName('id').setDescription('The mascot ID to delete').setRequired(true)
        ),

    async execute(interaction) {
        const id = interaction.options.getString('id').toUpperCase();
        const mascot = getMascotById(interaction.user.id, interaction.guildId, id);

        if (!mascot) {
            const { mascots } = getAllMascots(interaction.user.id, interaction.guildId);
            const ids = mascots.map(m => `\`${m.id}\` ${m.emoji} ${m.name}`).join('\n') || 'None';
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ Mascot not found')
                        .setDescription(`No mascot with ID \`${id}\` in your collection.\n\n**Your mascots:**\n${ids}`)
                        .setColor(0xff6b6b),
                ],
                ephemeral: true,
            });
        }

        const confirmEmbed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} Delete ${mascot.name}?`)
            .setDescription('**This cannot be undone.** Are you sure?')
            .setColor(0xff6b6b)
            .addFields(
                { name: '🆔 ID', value: `\`${id}\``, inline: true },
                { name: '✨ Type', value: `${mascot.emoji} ${mascot.type}`, inline: true },
                { name: '🌱 Evolution', value: `Level ${mascot.evolutionLevel || 0}`, inline: true },
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('confirm_del').setLabel('✅ Confirm Delete').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('cancel_del').setLabel('❌ Cancel').setStyle(ButtonStyle.Secondary),
        );

        const reply = await interaction.reply({ embeds: [confirmEmbed], components: [row], fetchReply: true });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: i => i.user.id === interaction.user.id,
            time: 30_000,
            max: 1,
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'confirm_del') {
                const result = deleteMascotById(interaction.user.id, interaction.guildId, id);
                const farewell = FAREWELLS[Math.floor(Math.random() * FAREWELLS.length)];

                const farewellEmbed = new EmbedBuilder()
                    .setTitle(`${mascot.emoji} Goodbye, ${mascot.name}…`)
                    .setDescription(`*${mascot.name} ${farewell}*`)
                    .setColor(0x9c88d4);

                if (result?.newActive) {
                    farewellEmbed.addFields({
                        name: '⭐ New Active Mascot',
                        value: `**${result.newActive.name}** \`${result.newActive.id}\` is now active.`,
                        inline: false,
                    });
                }

                farewellEmbed.setFooter({ text: "Use /mascot to add someone new. 🌸" });
                await i.update({ embeds: [farewellEmbed], components: [] });
            } else {
                await i.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${mascot.emoji} ${mascot.name} is safe 💖`)
                            .setDescription("*They're staying. Everything is okay.*")
                            .setColor(getMoodColor(mascot.mood)),
                    ],
                    components: [],
                });
            }
        });

        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${mascot.emoji} ${mascot.name} is safe 💖`)
                            .setDescription('*No response. They\'re staying.*')
                            .setColor(getMoodColor(mascot.mood)),
                    ],
                    components: [],
                }).catch(() => {});
            }
        });
    },
};
