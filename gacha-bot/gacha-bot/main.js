const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const keepAlive = require('./keep_alive');

const client = new Client({
    intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', file));
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
    }
}

client.once('ready', async () => {
    console.log(`✨ Logged in as ${client.user.tag}`);

    const commands = [...client.commands.values()].map(c => c.data.toJSON());
    const rest = new REST().setToken(process.env.BOT5_TOKEN);

    try {
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log(`✨ Registered ${commands.length} slash commands globally.`);
    } catch (err) {
        console.error('Failed to register commands:', err.message);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(`Error in /${interaction.commandName}:`, err);
        const msg = { content: '✨ Something went wrong! Try again.', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(msg).catch(() => {});
        } else {
            await interaction.reply(msg).catch(() => {});
        }
    }
});

keepAlive();
client.login(process.env.BOT5_TOKEN);
