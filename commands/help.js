const { execute } = require("./stop");

module.exports = {
    name: 'help',
    description: 'Shows all of the available commands that can be used',
    execute(message, args) {

        let commandList = [
            {
                name: "!lfg",
                description: "Starts the queue for you to find a game with others"
            },
            {
                name: "!lfg add",
                description: "Add a game to the database that can be configured by system and player number"
            },
            {
                name: "!lfg stop",
                description: "Stops you from searching for a game"
            },
            {
                name: "!lfg help",
                description: "Displays this popup window explaining the commands that can be used"
            }
        ]
        let commandListString = "Here is a list of compatable commands:\n";
        for (i = 0; i < commandList.length; i++) {
            commandListString += "**" + commandList[i].name + "** - " + commandList[i].description + "\n";
        }

        message.author.send(commandListString);
    }
}