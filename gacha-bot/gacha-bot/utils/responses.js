const MOOD_COLORS = {
    happy: 0xffb6c1,
    sad: 0x6a8fc8,
    excited: 0xffd700,
    bored: 0xa0a0a0,
    jealous: 0xff6b6b,
    loving: 0xff4081,
    sleepy: 0x9c88d4,
    angry: 0xff3333,
    confused: 0xffa500,
    content: 0x90ee90,
};

const MOOD_EMOJIS = {
    happy: '🌸',
    sad: '💧',
    excited: '⭐',
    bored: '😑',
    jealous: '💚',
    loving: '💕',
    sleepy: '💤',
    angry: '🔥',
    confused: '❓',
    content: '✨',
};

const TALK_LINES = {
    happy: [
        "Today feels like it was made just for us~ 🌸",
        "I'm in such a good mood right now!! ✨",
        "Everything is wonderful and YOU are wonderful! 💕",
        "La la la~ Nothing could ruin this! 🎶",
    ],
    sad: [
        "...I'm fine. Probably. 💧",
        "Some days are just heavy, you know? 🌧️",
        "I don't want to talk about it. But... thank you for asking. 🫧",
        "I'll be okay. I think. 💙",
    ],
    excited: [
        "OKAY OKAY OKAY I HAVE TO TELL YOU SOMETHING— ⭐",
        "I can barely sit still right now!! 🌟",
        "THIS IS THE BEST DAY EVER!! ✨✨✨",
        "Do you feel that?? The energy?? 🎊",
    ],
    bored: [
        "...entertain me. 😑",
        "nothing to do. nothing to say. just vibes. 💨",
        "I could be doing something fun right now. I am not. 🫠",
        "yawn. what do you want. 😶",
    ],
    jealous: [
        "Who were you talking to just now? 💚",
        "I'm not jealous. I'm just... observing. Closely. 👀",
        "They're not more interesting than me. Right? 🐍",
        "Just so you know I noticed. Everything. 😒",
    ],
    loving: [
        "You came back~ I knew you would 💕",
        "I made something for you. It's stupid. Take it anyway. 🌸",
        "You mean more to me than you know. 🫀",
        "Stay a little longer? Please? 💗",
    ],
    sleepy: [
        "mmmm... what time is it... 💤",
        "I promise I'm listening. *falls asleep* 😴",
        "five more minutes and then I'll be fully functional 🌙",
        "zzzz... oh— hi— I was awake. 💤",
    ],
    angry: [
        "DON'T. 🔥",
        "I am VERY calm right now. VERY. 😤",
        "Whoever did this is going to HEAR about it. 💢",
        "I'm not yelling. I'm expressing at high volume. 🔥",
    ],
    confused: [
        "Wait what? No. Wait. WHAT? ❓",
        "Can you say that again but slower and also differently ❓",
        "I understood none of that and I am choosing to move on. 🫠",
        "My brain is loading please hold. ⏳",
    ],
    content: [
        "Everything is exactly as it should be right now. ✨",
        "I have everything I need. This is nice. 🌿",
        "Peaceful. Calm. Present. 💚",
        "No complaints. That's rare. Enjoy it. 🍃",
    ],
};

const REACT_LINES = [
    "Oh? Them? I see them. I see everything. 👁️",
    "Interesting choice of person to mention~ 💅",
    "They seem... fine. I GUESS. 😌",
    "I'll allow it. This time. 🌸",
    "Noted. Filed. Remembered forever. 📋",
    "Are they important to you? ...interesting. 🔍",
    "Hi! ...I'm watching. Warmly. 💕",
    "*looks them up and down* ...okay. 😶",
];

const GIFT_REACTIONS = {
    food: ["*happy munching sounds* 🍡", "OH!! FOOD FOR ME?? 😭💕", "I will eat this entire thing right now. Thank you.", "You remembered what I like... 🥹"],
    flower: ["*holds flower like it's made of glass* 🌸", "It's so pretty... almost as pretty as— never mind. 💐", "I'll press this in my journal forever. 🌺", "Flowers mean you thought of me. I love that. 💕"],
    plush: ["SQUISH!! 🧸💕", "*immediately attaches to it forever*", "Adding to the collection~ It will know my secrets. 🧸", "So soft... I will name it after you. Maybe."],
    gem: ["*eyes sparkling intensely* 💎", "Ooooh shinyyyy... 🌟", "It's beautiful. You're forgiven for everything. 💎", "*cannot look away* mine now. 💍"],
    sword: ["...a weapon. You trust me with this. 👀", "This is either a gift or a challenge. I accept either. ⚔️", "Now I'm dangerous. Dangerously CUTE. 🗡️", "I'll keep this. For reasons. 😌"],
    default: ["OH!! For me?? 💕", "You didn't have to— but I'm glad you did~ 🌸", "I'll treasure this forever. No matter what it is. ✨", "This goes in the special box. You get a special box. 🎀"],
};

function getMoodColor(mood) {
    return MOOD_COLORS[mood] || 0xffb6c1;
}

function getMoodEmoji(mood) {
    return MOOD_EMOJIS[mood] || '✨';
}

function getTalkLine(mood) {
    const lines = TALK_LINES[mood] || TALK_LINES.content;
    return lines[Math.floor(Math.random() * lines.length)];
}

function getReactLine() {
    return REACT_LINES[Math.floor(Math.random() * REACT_LINES.length)];
}

function getGiftReaction(item) {
    const lower = item.toLowerCase();
    if (['food', 'cake', 'candy', 'snack', 'cookie', 'bread', 'sweets', 'chocolate'].some(f => lower.includes(f))) return GIFT_REACTIONS.food;
    if (['flower', 'rose', 'petal', 'bloom', 'bouquet', 'lily', 'daisy'].some(f => lower.includes(f))) return GIFT_REACTIONS.flower;
    if (['plush', 'stuffed', 'toy', 'doll', 'bear', 'plushie', 'soft'].some(f => lower.includes(f))) return GIFT_REACTIONS.plush;
    if (['gem', 'jewel', 'crystal', 'diamond', 'ruby', 'sapphire', 'ring', 'necklace'].some(f => lower.includes(f))) return GIFT_REACTIONS.gem;
    if (['sword', 'knife', 'blade', 'weapon', 'dagger', 'axe', 'bow'].some(f => lower.includes(f))) return GIFT_REACTIONS.sword;
    return GIFT_REACTIONS.default;
}

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = { getMoodColor, getMoodEmoji, getTalkLine, getReactLine, getGiftReaction, pick };
