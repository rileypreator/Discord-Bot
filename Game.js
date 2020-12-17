class Game {
    constructor(name, systems, maxPlayers, minPlayers) {
        this.name = name;
        this.systems = systems;
        this.maxPlayers = maxPlayers;
        this.minPlayers = minPlayers;
        this.currentPlayersNumber = 0;
        this.currentPlayerData = [];
    }

    toNewString() {
        return "This is the name of the game: " + this.name;
    }
    
    clearCurrentPlayerData() {
        this.currentPlayerData = [];
    }
}
const fs = require("fs");
module.exports = Game;