const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const ORIGINS = [
    'Founded by a small group with a shared vision that has since grown into something larger than any of them expected.',
    'Born from a single conversation that refused to end — and eventually became a place.',
    'Established as a refuge. The people who needed it found it. They built the rest.',
    'Created in a moment of impulse. Stayed because the community that grew inside it made it worth keeping.',
    'Started with one channel and one rule: be here. Everything else came later.',
    'The founding date exists. The founding feeling — excitement, uncertainty, hope — still echoes in every corner.',
];

const FACTIONS = [
    ['The Anchors', 'The Wanderers', 'The Builders'],
    ['The Old Guard', 'The New Wave', 'The Quiet Ones'],
    ['The Creatives', 'The Theorists', 'The Lurkers'],
    ['The Core', 'The Seasonal Visitors', 'The Lore Keepers'],
    ['The Loudest', 'The Most Reliable', 'The Ones Who Show Up When It Matters'],
    ['The Founders', 'The Regulars', 'The Yet-To-Arrive'],
];

const EVENTS = [
    [
        'A moment of chaos that the community navigated better than expected.',
        'A period of rapid growth that tested the server\'s identity.',
        'An event that brought everyone together in a way that\'s still talked about.',
    ],
    [
        'A quieter season — fewer messages, deeper conversations.',
        'The great reorganization, when everything was renamed and restructured.',
        'A late-night voice call that lasted until morning and is now legend.',
    ],
    [
        'The arrival of someone who changed the whole dynamic.',
        'A collaborative project that united the community behind a shared goal.',
        'A disagreement that, in the end, clarified what the server actually stood for.',
    ],
];

const MASCOT_INFLUENCES = [
    'Mascots summoned here carry the server\'s energy in their palette and personality, whether they know it or not.',
    'The mascots of this server reflect its mood — generated here, they are shaped by the collective spirit of its members.',
    'Every mascot born inside these walls carries a subtle imprint of this community\'s history.',
    'The lore of this server bleeds into the characters summoned within it. Energy is contagious.',
];

const SUMMARIES = [
    'This server is not just a place. It\'s an ongoing story written by everyone who stayed.',
    'Whatever it started as, it has become something more — defined not by its creation but by its continuation.',
    'The lore is still being written. Every message is a line. Every member, a character.',
    'It has survived change. It has generated community. It has, against reasonable odds, persisted. That is its legacy.',
    'The full story cannot be summarized. But this file is a start.',
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverlore')
        .setDescription('Generate the lore file for this server! 🌍📖'),

    async execute(interaction) {
        await interaction.deferReply();
        const g = interaction.guild;
        await g.fetch();

        const origin = pick(ORIGINS);
        const factions = pick(FACTIONS);
        const events = pick(EVENTS);
        const mascotInfluence = pick(MASCOT_INFLUENCES);
        const summary = pick(SUMMARIES);

        const age = Math.floor((Date.now() - g.createdAt) / (1000 * 60 * 60 * 24 * 365 * 10)) / 100;
        const era = age < 0.5 ? 'a young server' : age < 2 ? 'an established server' : 'a veteran server';

        const embed = new EmbedBuilder()
            .setTitle(`🌍 SERVER LORE FILE: ${g.name.toUpperCase()}`)
            .setColor(0x2b2d31)
            .addFields(
                {
                    name: '🏰 Origin',
                    value: `Classified as *${era}* with **${g.memberCount}** known members.\n${origin}`,
                    inline: false,
                },
                {
                    name: '🎭 Factions',
                    value: `Three groups have been identified within this community:\n\n• **${factions[0]}** — the ones who define the culture\n• **${factions[1]}** — the ones who challenge it\n• **${factions[2]}** — the ones who hold everything together quietly`,
                    inline: false,
                },
                {
                    name: '💥 Historical Events',
                    value: `The records show three significant moments:\n\n1. ${events[0]}\n2. ${events[1]}\n3. ${events[2]}`,
                    inline: false,
                },
                {
                    name: '🧬 Mascot Influence',
                    value: mascotInfluence,
                    inline: false,
                },
                {
                    name: '🧠 Final Lore Summary',
                    value: `*${summary}*`,
                    inline: false,
                },
            )
            .setFooter({ text: `Lore file generated • ${g.name} • This document is non-exhaustive.` })
            .setTimestamp();

        if (g.icon) embed.setThumbnail(g.iconURL({ dynamic: true }));

        await interaction.editReply({ embeds: [embed] });
    },
};
