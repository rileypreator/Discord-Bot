const { Message, DiscordAPIError } = require("discord.js");
const Game = require("../Game.js");
const fs = require("fs");

async function gamePrompt(message, args) {
    //variable to be used in the function
    let nameOfGame;
    let systems = [];
    let maxPlayerNumber;
    let minPlayerNumber;

    const filter = (m) => m.author.id === message.author.id;

    //prompt for the name of the game
    message.channel.send("What is the name of the game you would like to add?");
    let nameOfGameResponse = await message.channel.awaitMessages(filter, { time: 300000, max: 1 });
    nameOfGame = nameOfGameResponse.first().content;
    message.channel.send("Added game: **" + nameOfGame + "**");

    //prompt for the systems the game is running on
    message.channel.send("What systems does this game run on?\n(Write the name of the system with spaces only between systems and not in the name)\n**Ex:** PC XboxSeriesX");
    let systemsResponse = await message.channel.awaitMessages(filter, { max: 1, time: 300000 });

    let systemString = systemsResponse.first().content;
    systems = systemString.trim().split(/ +/);
    let systemsFinalDisplay = "\n";
    message.channel.send("The added systems are:");
    systems.forEach(function (item, index) {
        message.channel.send("- **" + item + "**");

        //This line is used to display correctly the final game that you would like to add
        systemsFinalDisplay += ("- **" + item + "**\n");
    });


    //prompt for the size of the player groups
    message.channel.send("What is the **maximum** number of players that can be in a party?");
    let maxPlayerResponse = await message.channel.awaitMessages(filter, { time: 300000, max: 1 });
    maxPlayerNumber = maxPlayerResponse.first().content;

    message.channel.send("Lastly, what is the **minimum** number of players that can be in a party?");
    let minPlayerResponse = await message.channel.awaitMessages(filter, { time: 300000, max: 1 });
    minPlayerNumber = minPlayerResponse.first().content;

    //loop to use if the maximum player number is less than the minimum player number to reprompt for correct numbers
    //one thing to note is that the max and minimum can be the same. Therefore we don't include an equals in the while statement
    while (minPlayerNumber > maxPlayerNumber) {
        message.channel.send("The minimum is less than the maximum. What is that **maximum** player number again?")
        maxPlayerResponse = await message.channel.awaitMessages(filter, { time: 300000, max: 1 });
        maxPlayerNumber = maxPlayerResponse.first().content;

        message.channel.send("And what was that **minimum** player number again?");
        minPlayerResponse = await message.channel.awaitMessages(filter, { time: 300000, max: 1 });
        minPlayerNumber = minPlayerResponse.first().content;
    }


    //Final check to make sure that all of the information is correct with the user
    let responseMessage = await message.channel.send("Does all of this information look correct?\n- 🎲 Game: **" + nameOfGame + "**\n\n- 🎮 Systems:" + systemsFinalDisplay + "\n- ⛹️ Players: **" + minPlayerNumber + "** - **" + maxPlayerNumber + "**" + "\nRespond with a :white_check_mark: if correct, or a :x: if not");
    message.react('✅');

    //Used this page for better understanding of awaiting reactions
    //https://discordjs.guide/popular-topics/reactions.html#removing-reactions-by-user
    const reactionFilter = (reaction, user) => {
        return ['❌', '✅'].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    await responseMessage.awaitReactions(reactionFilter, { max: 1, time: 300000 })
        .then(collected => {
            const reaction = collected.first();
            if (reaction.emoji.name === '✅') {
                message.channel.send("Added **" + nameOfGame + "** to the database. Users can now look for groups in this game");
                let gameToAdd = new Game(nameOfGame, systems, maxPlayerNumber, minPlayerNumber);

                writeFile(gameToAdd);
            }
            else {
                message.channel.send("Won't add the game. Run the command again to ensure that all of the information is correct");
            }
        })
        .catch(collected => {
            // if (error)
            // console.log(error);
            //commmented out just in case
            message.channel.send("Didn't send the correct emoji or ran out of time. Cancelling game addition.");
        });
}

function writeFile(gameToAdd) {
    fs.readFile('./games.json', function (err, data) {

        if (err)
            console.log(err);
        let gameList = JSON.parse(data);

        console.log("gameList before the change: " + JSON.stringify(gameList));
        gameList.push(gameToAdd);

        fs.writeFile("./games.json", JSON.stringify(gameList), err=> {
            if (err) 
                console.log(err);
            console.log("Added: " + gameToAdd.name);
        });
    });
}

module.exports = {
    name: 'add',
    description: 'Adds game that can be searched for',
    execute(message, args) {
        //First prompts for the name of the game

        gamePrompt(message, args);
    }

}

