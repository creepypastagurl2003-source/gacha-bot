const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, MessageFlags } = require('discord.js');
const { getMascot, getActiveMascotId, deleteMascotById } = require('../utils/storage');

const FAREWELLS = [
    'has faded back into the gacha void… 💫',
    'dissolved into glittering light and returned to wherever mascots come from. ✨',
    'took a slow breath, smiled once, and vanished. 🌸',
    'stepped back through the portal, looking over their shoulder one last time. 🌙',
    'became stardust again. They were here. That mattered. 💕',
    'slipped quietly back into the unknown, carrying everything they were. 🫧',
    'said nothing — just gave a small wave, and was gone. 👋',
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletemascot')
        .setDescription('Release your active mascot back into the void. 💫'),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have an active mascot. Use `/mascot` to generate one first. ✨", flags: MessageFlags.Ephemeral });
        }

        const confirmEmbed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} Release ${mascot.name}?`)
            .setDescription(`**Are you sure you want to release your active mascot?**\n\n*This cannot be undone. ${mascot.name} will be gone permanently.*\n\nTip: Use \`/delete ${mascot.id}\` to delete any specific mascot by ID.`)
            .setColor(0xff6b6b)
            .addFields(
                { name: '🆔 ID', value: `\`${mascot.id || '??'}\``, inline: true },
                { name: '📛 Name', value: mascot.name, inline: true },
                { name: '✨ Type', value: `${mascot.emoji} ${mascot.type}`, inline: true },
                { name: '🌱 Evolution Level', value: `${mascot.evolutionLevel || 0}`, inline: true },
            )
            .setFooter({ text: 'This action is permanent.' });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('confirm_delete').setLabel('✅ Confirm Delete').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('cancel_delete').setLabel('❌ Cancel').setStyle(ButtonStyle.Secondary),
        );

        await interaction.reply({ embeds: [confirmEmbed], components: [row] });
        const reply = await interaction.fetchReply();

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (i) => i.user.id === interaction.user.id,
            time: 30_000,
            max: 1,
        });

        collector.on('collect', async (i) => {
            await i.deferUpdate();
            if (i.customId === 'confirm_delete') {
                const id = getActiveMascotId(interaction.user.id, interaction.guildId);
                const name = mascot.name;
                const emoji = mascot.emoji;
                const farewell = FAREWELLS[Math.floor(Math.random() * FAREWELLS.length)];
                const result = deleteMascotById(interaction.user.id, interaction.guildId, id);

                const farewellEmbed = new EmbedBuilder()
                    .setTitle(`${emoji} Goodbye, ${name}…`)
                    .setDescription(`*${name} ${farewell}*`)
                    .setColor(0x9c88d4);

                if (result?.newActive) {
                    farewellEmbed.addFields({
                        name: '⭐ New Active Mascot',
                        value: `**${result.newActive.name}** is now your active mascot.`,
                        inline: false,
                    });
                }

                farewellEmbed.setFooter({ text: "Use /mascot whenever you're ready for someone new. 🌸" });
                await interaction.editReply({ embeds: [farewellEmbed], components: [] });
            } else {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${mascot.emoji} ${mascot.name} is safe 💖`)
                            .setDescription("*They're staying. Everything is okay.*")
                            .setColor(0xffb6c1),
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
                            .setDescription("*No response. They're staying.*")
                            .setColor(0xffb6c1),
                    ],
                    components: [],
                }).catch(() => {});
            }
        });
    },
};
