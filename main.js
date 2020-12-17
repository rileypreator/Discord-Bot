const Discord = require('discord.js');
const client = new Discord.Client();
const Game = require("./Game.js");
const fs = require('fs');

client.commands = new Discord.Collection();

//list that will contain all of the commands
let commandList = [];
//reads the list of files from the folder /commands
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
    commandList.push(command.name, command.description);
}

//sets the prefix to be what the user would like
//when this becomes open source this can be changed
const prefix = '!';

client.once('ready', () => {
    console.log('LFG Bot is online!');
});

//gets the message and depending on the arguements will results in a different command that is called
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'lfg') {

        //will stop looking for a game if this command is run
        if (args[0] === 'stop') {
            return client.commands.get('clear').execute(message, args);
        }

        //triggers add command
        if (args[0] === 'add') {
            return client.commands.get('add').execute(message, args);
        }

        //triggers help command
        if (args[0] === 'help') {
            return client.commands.get('help').execute(message, args);
        }
        else {
            return client.commands.get('lfg').execute(message, args);
        }

    }
});
//Login to the client so the bot can run
client.login('NzgzNTI3MTg0OTc5MzI5MDI0.X8cCjg.d7wHAxfelYgIAVbcDwRU3MKGvTE');