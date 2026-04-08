const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor, getMoodEmoji } = require('../utils/responses');

const GREETINGS = {
    happy: [
        "Oh!! You're here!! I was JUST thinking about you!! 🌸",
        "HI HI HI!! Welcome back!! ✨",
        "There you are!! I saved you a spot~ 💕",
    ],
    sad: [
        "...oh. Hi. 💧 I'm glad you came.",
        "Hey. You showed up. That means something. 🫧",
        "Hi... I was hoping someone would stop by. 🌧️",
    ],
    excited: [
        "YOU'RE HERE!! I HAVE SO MUCH TO TELL YOU!! ⭐⭐⭐",
        "FINALLY!! I've been waiting!! Let's GO!! 🎊",
        "HELLO!!! THE DAY JUST GOT 1000% BETTER!! ✨",
    ],
    bored: [
        "Oh. You. Finally. 😑",
        "Hey. Took you long enough. 😶",
        "You're here. Cool. ...now what. 🫠",
    ],
    jealous: [
        "Oh so NOW you come to visit. Interesting. 💚",
        "Hi. Who were you with before this? 👀",
        "Hello~ I see you decided I was worth your time today. 😒",
    ],
    loving: [
        "You came back~ I knew you would 💕",
        "Hi... I missed you more than I should admit. 🫀",
        "Oh— hi— *tries to act casual* ...hi. 🌸",
    ],
    sleepy: [
        "mmm... oh!! Hi!! *wipes eyes* I wasn't sleeping 💤",
        "heyyy... you're here... *yawn* good... 😴",
        "hi... soft voice... glad you came... zzzz 🌙",
    ],
    angry: [
        "Oh. It's you. Good. We need to talk. 🔥",
        "Hello. I am FINE. Don't ask. 😤",
        "Hi. ...sorry. Hi. 💢",
    ],
    confused: [
        "Oh! Hi! Wait— where did you come from?? ❓",
        "Hello?? Is this real?? Are you real?? 🫠",
        "Hi! I was just— wait what was I doing. Hi! ❓",
    ],
    content: [
        "Oh, hey~ Good timing. ✨",
        "Hello. Everything is nice right now. Come enjoy it with me. 🌿",
        "Hi~ Pull up a chair. It's a good day. 🍃",
    ],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Say hello to your mascot! 👋'),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const lines = GREETINGS[mascot.mood] || GREETINGS.content;
        const line = lines[Math.floor(Math.random() * lines.length)];
        const moodEmoji = getMoodEmoji(mascot.mood);

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} greets you!`)
            .setDescription(`*"${line}"*`)
            .setColor(getMoodColor(mascot.mood))
            .setFooter({ text: `${moodEmoji} ${mascot.mood} • ${mascot.energy} energy` });

        await interaction.reply({ embeds: [embed] });
    },
};
