const fs = require("fs");
const fsSync = require("fs").promises;
const role = "785661641177169930";

async function checkGame(message, args) {

    if (message.member.roles.cache.has('785661641177169930')) {
        message.channel.send("You are already looking for a game. Please type \`!lfg stop\` to stop looking for a game to queue for another.")
    }
    else {
        //variables to be used throughout the function
        let gameList = [];
        let nameOfGame = '';
        let foundGame = false;

        //reads a list of all of the games in the json file
        fs.readFile("./games.json", async function (err, data) {

            if (err)
                throw err;
            gameList = JSON.parse(data);
            nameOfGame = args.join(' ');
            for (let i = 0; i < gameList.length; i++) {
                if (gameList[i].name === nameOfGame) {
                    message.channel.send("Joining the queue for **" + nameOfGame + "**");
                    foundGame = true;
                    if (!message.member.roles.cache.has('785661641177169930')) {
                        message.member.roles.add('785661641177169930');
                    }
                }
            }
            if (!foundGame) {
                message.channel.send("It seems like that game isn't added. use \`!lfg add\` to add the game to the database.");
            }

            await addToQueue(nameOfGame, gameList, message);
            let resetQueue = checkQueue(nameOfGame, gameList, message);
            clearQueue(nameOfGame, gameList, resetQueue, message);
        });

        // setTimeout(async function() {

        //     let author = message.author;
        //     const filter = (m) => m.author.id === message.author.id;
        //     await author.send("Are you still looking for a game in **" + nameOfGame + "**?\nPlease type **Yes** to confirm in the next 30 seconds.");
        //     author.dmChannel.awaitMessages(filter, {max:1, time: 30000})
        //     .then(collected => {
        //         let response = collected.first().content;

        //         if (response === "Yes") {
        //             author.send("Sounds good. You can use the \`!lfg clear\` command to stop looking for a game.");
        //         }
        //     })
        //     .catch(collected => {
        //         author.send("Stopped looking for a game for you. Type \`!lfg [nameOfGame]\` to search again");
        //     });

        // }, 30000)
    }
}

async function addToQueue(nameOfGame, gameList, message) {
    //adds the person the queue in the json file
    let author = message.author.id;
    for (let i = 0; i < gameList.length; i++) {
        if (gameList[i].name === nameOfGame) {
            gameList[i].currentPlayerData.push(author);
            console.log(gameList);
        }
    }
    await fsSync.writeFile("./games.json", JSON.stringify(gameList), err => {
        if (err)
            console.log(err);
    });
}

async function checkQueue(nameOfGame, gameList, message) {
    //if the queue has a full party ready will send a message to the server
    for (let i = 0; i < gameList.length; i++) {
        if (gameList[i].name === nameOfGame && gameList[i].currentPlayerData.length == gameList[i].maxPlayers) {

            //message that is sent within the channel to let the players know who is in the group
            let playerList = '';
            for (let j = 0; j < gameList[i].currentPlayerData.length; j++) {
                playerList += "\n- <@" + gameList[i].currentPlayerData[j] + ">";
            }
            message.channel.send("🎮 **Full Party Ready In " + nameOfGame + "** 🎮" + playerList);
            return true;
        }
    }

    return false;
}

//clears the queue of the party is full
async function clearQueue(nameOfGame, gameList, resetQueue, message) {
    for (let i = 0; i < gameList.length; i++) {
        if (gameList[i].name === nameOfGame && gameList[i].currentPlayerData.length == gameList[i].maxPlayers) {
            gameList[i].currentPlayerData = [];
            console.log(gameList[i].currentPlayerData);

            //This removes the role of Looking for Game on the server
            break;
        }
    }
    console.log(gameList);
    await fsSync.writeFile("./games.json", JSON.stringify(gameList), err=> {
        console.log("done");
        console.log(JSON.stringify(gameList));
        if (err)
        console.log(err);
    }) 

    for (let i = 0; i < gameList.length; i++) {
        for (let j = 0; j < gameList[i].maxPlayers; j++) {
            let member = message.guild.members.get(gameList[i].currentPlayerData[j]);
            await member.roles.remove('785661641177169930');
        }
    }    
}

module.exports = {
    name: 'lfg',
    description: 'This command looks for a game based on the arguments',
    execute(message, args) {

        checkGame(message, args);
    }
}
