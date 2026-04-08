const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View all commands and how to use them! ✨'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🌙 Nyxie ✦ — Command Guide')
            .setDescription('A full Gacha-style mascot collection system. Collect, evolve, and bond with your mascots!\n\u200b')
            .setColor(0x9b59b6)
            .addFields(
                {
                    name: '🧬 Collection',
                    value: [
                        '`/mascot` — Generate a new mascot and add them to your collection',
                        '`/list` — View all mascots in your roster with their IDs',
                        '`/select <id>` — Set a mascot as active (all commands use this one)',
                        '`/reroll [id]` — Regenerate a mascot, keeping their slot and ID',
                        '`/delete <id>` — Permanently delete a mascot by ID',
                        '`/deletemascot` — Delete your current active mascot',
                    ].join('\n'),
                },
                {
                    name: '💬 Interaction',
                    value: [
                        '`/talk` — Chat with your active mascot',
                        '`/react` — See how your mascot reacts to something',
                        '`/hello` — Say hello and get a greeting back',
                        '`/thought` — Hear what your mascot is thinking right now',
                        '`/gift` — Give your mascot a gift and see their reaction',
                    ].join('\n'),
                },
                {
                    name: '🌱 Growth & Stats',
                    value: [
                        '`/evolve` — Evolve your mascot to the next level (unlocks lore chapters)',
                        '`/stats` — View your mascot\'s generated stat sheet',
                        '`/lore` — Read your mascot\'s evolving story',
                        '`/energy` — Check and manage your mascot\'s energy level',
                        '`/mood` — See your mascot\'s current mood',
                    ].join('\n'),
                },
                {
                    name: '🎨 Customization',
                    value: [
                        '`/rename <name>` — Give your mascot a new name',
                        '`/outfit` — Generate a full type-matched outfit for your mascot',
                        '`/palette` — View your mascot\'s full color palette (R# D# system)',
                        '`/form` — See your mascot\'s current form details',
                        '`/origin` — Read where your mascot comes from',
                    ].join('\n'),
                },
                {
                    name: '🌟 Identity',
                    value: [
                        '`/personality` — Reveal your mascot\'s personality profile',
                        '`/trait` — Discover a unique trait your mascot has',
                        '`/summon` — Dramatically summon your mascot with flair',
                        '`/prophecy` — Receive a mysterious prophecy from your mascot',
                        '`/origin` — Learn your mascot\'s backstory and origins',
                    ].join('\n'),
                },
                {
                    name: '🏠 Server',
                    value: [
                        '`/serverstats` — View mascot statistics for this server',
                        '`/serverlore` — Read the collective story of this server\'s mascots',
                        '`/createchannel <name> [category]` — Create a text channel, optionally inside a category *(Manage Channels)*',
                    ].join('\n'),
                },
                {
                    name: '\u200b',
                    value: [
                        '**How to get started:**',
                        '1. `/mascot` — Roll your first mascot',
                        '2. `/list` — See your roster and copy an ID',
                        '3. `/select <id>` — Set them as active',
                        '4. `/talk` `/outfit` `/evolve` — Start interacting!',
                        '',
                        '*All commands use your **active** mascot. Use `/select` to switch between them.*',
                    ].join('\n'),
                },
            )
            .setFooter({ text: '🌙 Nyxie ✦ • Gacha Mascot Collector • 45 types • unlimited collection' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
