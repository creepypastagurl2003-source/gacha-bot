'use strict';

const { Client, GatewayIntentBits, Collection, REST, Routes, MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const keepAlive = require('./keep_alive');

keepAlive();

const TOKEN = process.env.BOT5_TOKEN;
if (!TOKEN) {
    console.error('✨ BOT5_TOKEN is not set — keep-alive running but Discord is offline.');
} else {
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

    client.on('clientReady', async () => {
        console.log(`✨ Nyxie online as ${client.user.tag}`);

        const commands = [...client.commands.values()].map(c => c.data.toJSON());
        const rest = new REST({ version: '10' }).setToken(TOKEN);

        try {
            await rest.put(Routes.applicationCommands(client.user.id), { body: [] });
            const guilds = client.guilds.cache.map(g => g.id);
            if (guilds.length === 0) {
                await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
                console.log(`✨ Registered ${commands.length} commands globally (no guilds found).`);
            } else {
                for (const guildId of guilds) {
                    await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: commands });
                }
                console.log(`✨ Registered ${commands.length} commands in ${guilds.length} guild(s) instantly.`);
            }
        } catch (err) {
            console.error('✨ Failed to register commands:', err.message);
        }
    });

    client.on('shardDisconnect',   (e, id) => console.warn(`✨ Shard ${id} disconnected (code ${e.code}). Reconnecting…`));
    client.on('shardReconnecting', id      => console.log(`✨ Shard ${id} reconnecting…`));
    client.on('shardResume',       (id, r) => console.log(`✨ Shard ${id} resumed (replayed ${r} events).`));
    client.on('warn',  msg => console.warn('✨ warn:', msg));
    client.on('error', err => console.error('✨ error:', err.message));

    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(`✨ Error in /${interaction.commandName}:`, err);
            const msg = { content: '✨ Something went wrong! Try again.', flags: MessageFlags.Ephemeral };
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(msg).catch(() => {});
            } else {
                await interaction.reply(msg).catch(() => {});
            }
        }
    });

    client.login(TOKEN);
}
