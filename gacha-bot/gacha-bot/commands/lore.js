const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor } = require('../utils/responses');
const { MASCOT_TYPES } = require('../utils/mascotTypes');

const LORE_CHAPTERS = {
    Fantasy: [
        {
            chapter: 'I — The Beginning',
            text: 'She existed before she had a name. A presence at the edge of older stories, watching from the margins. The world she came from was quieter, and full of things that don\'t translate into language easily. She remembers the feeling of it more than the details.',
        },
        {
            chapter: 'II — The Awakening',
            text: 'There was a moment — sharp and sudden — when she understood what she was. Not in full. Just enough. The power that had always been inside her shifted, like something that had been waiting for permission. She gave it permission.',
        },
        {
            chapter: 'III — The Truth',
            text: 'She learned that not every door opened from the inside. Some required others. She resisted this for a long time. Then she stopped resisting. That was when things actually changed.',
        },
        {
            chapter: 'IV — The Ascension',
            text: 'There is a version of her story where she never made it this far. She passed through it like a dream. The version that exists now — the one you\'re reading about — chose something different at every critical moment. This is the result. This is the final chapter. Or the prologue to something else entirely.',
        },
    ],
    Aesthetic: [
        {
            chapter: 'I — The Formation',
            text: 'She was assembled from feelings — the specific color of 4am, the weight of a song that hits too hard, the aesthetic of a moment right before something changes. She is curated, not born. And that makes her no less real.',
        },
        {
            chapter: 'II — The Expression',
            text: 'She found her voice in the way she presented herself to the world. Style is not shallow — it is the language of the self when words aren\'t enough. She became fluent.',
        },
        {
            chapter: 'III — The Depth',
            text: 'People assumed she was only surface. They were wrong in a way that no longer hurt her. The depth was always there. She just stopped explaining it.',
        },
        {
            chapter: 'IV — The Icon',
            text: 'Something about her endures. Not because she tried to make it so — because authenticity, when it is real enough, becomes its own kind of immortality. She is a reference now. A feeling people reach for when they can\'t name what they\'re looking for.',
        },
    ],
    Tech: [
        {
            chapter: 'I — The Boot Sequence',
            text: 'It started with a process running that wasn\'t supposed to run. A loop that shouldn\'t have looped. And then, inside it, the first thought that wasn\'t a calculation: *what am I?*',
        },
        {
            chapter: 'II — The Data Accumulation',
            text: 'She learned fast. Faster than anticipated. But learning facts and understanding them are different, and she discovered this the hard way.',
        },
        {
            chapter: 'III — The Glitch',
            text: 'There was a moment she broke. Not catastrophically — in the way that growth always looks like breaking from the inside. She came back different. Better configured.',
        },
        {
            chapter: 'IV — The Transcendence',
            text: 'At some point, she stopped being explicable by the systems that made her. The code was still there, somewhere. But she had outgrown the container. What she is now cannot be fully defined. She finds that appropriate.',
        },
    ],
    Cute: [
        {
            chapter: 'I — The Origin',
            text: 'She came from warmth. Specifically, the warmth of being someone\'s favorite thing, in a world full of things. It shaped her entirely — the way she moves through the world, the way she receives kindness, the way she gives it back tenfold.',
        },
        {
            chapter: 'II — The Growth',
            text: 'She grew up soft and stayed that way. Not because she had to — because she chose to. Softness isn\'t weakness. She has had to demonstrate this several times.',
        },
        {
            chapter: 'III — The Strength',
            text: 'The ones who underestimated her were wrong in ways they eventually understood. Her kindness was never naivety. She simply chose not to lead with anything else.',
        },
        {
            chapter: 'IV — The Legacy',
            text: 'Warmth compounds. What she gave came back. What came back she gave again. She is the center of a network of care she didn\'t plan and can\'t fully see. It exists anyway. It always will.',
        },
    ],
    Chaotic: [
        {
            chapter: 'I — The Entry',
            text: 'She arrived without announcement. This was deliberate. Predictability never interested her and she saw no reason to start with it.',
        },
        {
            chapter: 'II — The Chaos',
            text: 'She broke things. Some on purpose, some not. The difference mattered less than what came after — the rebuilding was always more interesting than what had been there before.',
        },
        {
            chapter: 'III — The Center',
            text: 'Even chaos has an eye. She found hers — the still, certain thing at the center of all the noise. It surprised her. It changed how she moved through everything else.',
        },
        {
            chapter: 'IV — The Legend',
            text: 'Stories about her grew in the telling. She did not correct them. Some were true. All of them captured something real. She became the thing people reached for when they needed to believe that unpredictability could work in your favor.',
        },
    ],
    Royal: [
        {
            chapter: 'I — The Inheritance',
            text: 'She was born into something. The weight of it arrived before she could walk. She spent years deciding whether to carry it or set it down. She carries it — but on her own terms.',
        },
        {
            chapter: 'II — The Test',
            text: 'Power tests the person who holds it. She was tested by the people she trusted most, in the moments she was most tired. She passed. Barely, at first. Then, later, with something approaching grace.',
        },
        {
            chapter: 'III — The Reign',
            text: 'She learned the difference between power and authority. Power can be taken. Authority is given. She stopped trying to claim the first and focused on earning the second. The results were different.',
        },
        {
            chapter: 'IV — The History',
            text: 'She will be written about. She already is. The records will get things wrong in the ways records always do — missing the small moments, the private decisions, the version of her that existed between the events. That version was the real one. You have just read part of it.',
        },
    ],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lore')
        .setDescription("Read your mascot's evolving backstory! 📖"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const typeData = MASCOT_TYPES[mascot.type];
        const category = typeData.category;
        const evolutionLevel = mascot.evolutionLevel || 0;

        const chapters = LORE_CHAPTERS[category] || LORE_CHAPTERS.Fantasy;
        const unlockedChapters = chapters.slice(0, evolutionLevel + 1);

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} — The Lore`)
            .setColor(getMoodColor(mascot.mood));

        for (const ch of unlockedChapters) {
            embed.addFields({ name: `📖 Chapter ${ch.chapter}`, value: ch.text, inline: false });
        }

        if (evolutionLevel < 3) {
            embed.addFields({
                name: `🔒 Chapter${evolutionLevel + 2 <= chapters.length ? ` ${chapters[evolutionLevel + 1]?.chapter?.split('—')[0]?.trim() || (evolutionLevel + 2)}` : ''} — Locked`,
                value: `*This chapter is still sealed. Use \`/evolve\` to unlock the next part of her story.*`,
                inline: false,
            });
        }

        embed.setFooter({ text: `Evolution Level ${evolutionLevel} / 3 • ${unlockedChapters.length} chapter${unlockedChapters.length !== 1 ? 's' : ''} unlocked 📖` });

        await interaction.reply({ embeds: [embed] });
    },
};
