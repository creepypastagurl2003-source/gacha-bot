const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createchannel')
        .setDescription('Create a new text channel, optionally inside a category. 📁')
        .addStringOption(opt =>
            opt.setName('name')
                .setDescription('Name of the new channel')
                .setRequired(true)
        )
        .addStringOption(opt =>
            opt.setName('category')
                .setDescription('Category name to place the channel in (creates one if it doesn\'t exist)')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        if (!interaction.memberPermissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: '❌ You need the **Manage Channels** permission to use this command.', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: "❌ I don't have permission to manage channels in this server.", ephemeral: true });
        }

        const channelName = interaction.options.getString('name').toLowerCase().replace(/\s+/g, '-');
        const categoryInput = interaction.options.getString('category');

        await interaction.deferReply();

        let parent = null;

        if (categoryInput) {
            const categoryName = categoryInput.trim();

            const existing = interaction.guild.channels.cache.find(
                c => c.type === ChannelType.GuildCategory &&
                    c.name.toLowerCase() === categoryName.toLowerCase()
            );

            if (existing) {
                parent = existing;
            } else {
                parent = await interaction.guild.channels.create({
                    name: categoryName,
                    type: ChannelType.GuildCategory,
                });
            }
        }

        const newChannel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: parent?.id ?? null,
        });

        const embed = new EmbedBuilder()
            .setTitle('📁 Channel Created!')
            .setColor(0x57f287)
            .addFields(
                { name: '📢 Channel', value: `${newChannel}`, inline: true },
                { name: '🔤 Name', value: `\`${channelName}\``, inline: true },
            );

        if (parent) {
            embed.addFields({ name: '📂 Category', value: `\`${parent.name}\``, inline: true });
        }

        embed.setFooter({ text: `Created by ${interaction.user.username}` }).setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
