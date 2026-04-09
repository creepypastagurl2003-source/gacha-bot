const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMascot } = require('../utils/storage');
const { getMoodColor, getMoodEmoji } = require('../utils/responses');

const THOUGHTS = {
    happy: [
        "Today is really, truly good. I want to remember it exactly like this.",
        "I keep smiling and I don't entirely know why. That's okay.",
        "Everything feels like it's going right. Don't ruin it. (Please don't ruin it.)",
        "I want to make today last as long as possible.",
    ],
    sad: [
        "There's a weight in my chest I can't explain to anyone.",
        "I'm okay. Probably. I keep saying that and hoping it becomes true.",
        "Some thoughts come and go. Others just... stay.",
        "I'm not sure what I'm looking for right now. But I'm still looking.",
    ],
    excited: [
        "I HAVE SO MANY IDEAS RIGHT NOW AND NOT ENOUGH TIME FOR ALL OF THEM.",
        "My brain is moving faster than my mouth and THAT is saying something.",
        "What if— no wait— but WHAT IF—",
        "Everything is possible. RIGHT NOW. ALL OF IT.",
    ],
    bored: [
        "Nothing. Absolutely nothing. This is fine.",
        "I could be literally anywhere else. I am here. Staring.",
        "Time moves differently when nothing is happening.",
        "I wonder what would happen if I did something chaotic right now. ...probably nothing good.",
    ],
    jealous: [
        "I notice things. Everything. I log it all.",
        "I'm not jealous. I'm just keeping detailed mental records. That's different.",
        "If they knew what I was thinking right now they would be scared. Good.",
        "Eyes open. Always open.",
    ],
    loving: [
        "I care so much it is genuinely a little embarrassing.",
        "I think about the people I love more than I admit.",
        "I would do a lot for the right person. More than is probably reasonable.",
        "Warmth is the most underrated feeling in the world.",
    ],
    sleepy: [
        "zzzz... what... yes... I agree with that point... zzzz",
        "I had a thought and it is currently very blurry.",
        "The pillow is calling. It always wins eventually.",
        "Consciousness is optional. I am choosing optionally.",
    ],
    angry: [
        "I am FINE. I am SO fine. Everything is FINE.",
        "I have a list. It's growing. Don't be on it.",
        "Processing. Still processing. Still very much processing.",
        "If I think about it any more I'm going to do something about it.",
    ],
    confused: [
        "WAIT. No. Hold on. Start from the beginning.",
        "My thoughts are a room where someone rearranged all the furniture.",
        "I have a question and also I forgot the question.",
        "Something doesn't add up and I can feel it but I can't find it.",
    ],
    content: [
        "Nothing needs to be different right now. That's rare.",
        "I am here. This is enough. It really is.",
        "The kind of quiet that feels good, not empty.",
        "Everything is where it should be. For now.",
    ],
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thought')
        .setDescription("Peek at your mascot's current thought 💭"),

    async execute(interaction) {
        const mascot = getMascot(interaction.user.id, interaction.guildId);
        if (!mascot) {
            return interaction.reply({ content: "You don't have a mascot yet! Use `/mascot` to generate one. ✨", ephemeral: true });
        }

        const thoughts = THOUGHTS[mascot.mood] || THOUGHTS.content;
        const thought = thoughts[Math.floor(Math.random() * thoughts.length)];

        const embed = new EmbedBuilder()
            .setTitle(`${mascot.emoji} ${mascot.name} is thinking...`)
            .setDescription(`💭 *"${thought}"*`)
            .setColor(getMoodColor(mascot.mood))
            .setFooter({ text: `${getMoodEmoji(mascot.mood)} ${mascot.mood} • inner monologue` });

        await interaction.reply({ embeds: [embed] });
    },
};
