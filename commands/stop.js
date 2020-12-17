module.exports= {
    name: 'stop',
    description: 'This command clears your current Looking For Game info',
    execute(message, args) {
        message.channel.send("No longer looking for a game");
        message.member.roles.remove('785661641177169930');
    }
}