const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot, setMascot } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');

const EVOLVE_MESSAGES = [
    {
        title: 'Awakening',
        description: 'Something stirred. Like a breath taken after holding it too long. She is changing.',
        unlock: 'Chapter II of her lore has been unsealed. Use /lore to read it.',
    },
    {
        title: 'True Form Emerging',
        description: 'The layers she wore to be understood are falling away. What remains is real.',
        unlock: 'Chapter III of her lore has been unsealed. Use /lore to read it.',
    },
    {
        title: 'Ascension',
        description: 'She has passed through every threshold. This is the final one. She steps through anyway.',
        unlock: 'Chapter IV — The Final Chapter — has been unsealed. Use /lore to read it.',
    },
];

const STAT_BOOST = 5;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('evolve')
        .setDescription('Evolve your mascot to unlock new lore and power! 🌱✨'),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const currentLevel = mascot.evolutionLevel || 0;

        if (currentLevel >= 3) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`${mascot.emoji} ${mascot.name} ✦✦✦ — Already Ascended`)
                        .setDescription('*She has reached the highest form. There is nowhere left to grow — only deeper into what she already is.*')
                        .setColor(getMoodColor(mascot.mood))
                        .setFooter({ text: 'Maximum evolution reached. ✦✦✦' }),
                ],
            });
        }

        const evolveData = EVOLVE_MESSAGES[currentLevel];
        mascot.evolutionLevel = currentLevel + 1;

        if (!mascot.stats) {
            mascot.stats = { power: 50, charm: 50, speed: 50, mystery: 50, luck: 50, chaos: 50 };
        }
        for (const key of Object.keys(mascot.stats)) {
            mascot.stats[key] = Math.min(100, mascot.stats[key] + STAT_BOOST);
        }

        setMascot(interaction.user.id, interaction.guildId, mascot);

        const suffix = '✦'.repeat(mascot.evolutionLevel);

        const embed = new EmbedBuilder()
            .setTitle(`🌟 ${mascot.name} ${suffix} — ${evolveData.title}!`)
            .setDescription(`*${evolveData.description}*`)
            .setColor(0xffd700)
            .addFields(
                { name: '🌱 New Evolution Level', value: `${mascot.evolutionLevel} / 3`, inline: true },
                { name: '📖 Lore Unlocked', value: evolveData.unlock, inline: false },
                { name: '⬆️ Stats Boosted', value: `All stats +${STAT_BOOST}`, inline: true },
            )
            .setFooter({ text: 'Growth is never accidental. 🌸' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
