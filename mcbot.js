//credit to vegeta897 for the request URL part from his 'Simple Minecraft server status bot'
const Discord = require("discord.js");
const client = new Discord.Client();
const settings = require('./config.json');
var statustring = "No signal";

var request = require('request');
var mcCommand = '/minecraft'; // Command for triggering
var mcIP = settings.ip; // Your MC server IP
var mcPort = settings.port; // Your MC server port
var url = 'https://api.mcsrvstat.us/2/' + mcIP + ':' + mcPort;



function update() {
	request(url, function(err, response, body) {
	if(err) {
		console.log(err); //If api is down show error, then waits to update
		client.setInterval(update,60000);
		var status = 'API не отвечает';
		console.log("-------------\nWaiting 60 seconds until update")
	} else {
	body = JSON.parse(body);
	var status = 'cервер недоступен'; //Set variable status if server unavailable
	client.user.setStatus('dnd')
	.catch(console.error);
	console.log("----------------\nUpdating...Done!");
		if(body.online) {
			if(body.players.online<1) { //Check if there less than 1 player on server, then
           	client.user.setStatus('idle') //Set bot status as "Idling" if server empty"
			status = 'cервер пуст'
			} else {
			client.user.setStatus('online') //Shows server status as "Online" if parsing sucessfull
    		.catch(console.error);
          	}
            	if(body.players.online>=1) { //check if there 1 or more players on server, then
               		status = ' ' + body.players.online + '  /  ' + body.players.max + " | .help"; //Show as status players count
            	} 
		}
     }
      client.user.setActivity(status, { type: 'Playing' }) //Set variable 'status' as discordPresence for bot
      .then(presence => console.log('Status:' + status)) //Log status to console 
      .catch(console.error);
  	}
	);

}


client.on("ready", () => {
	client.user.setActivity("запуск бота", { type: 'Playing' });
	client.user.setStatus('idle');
	console.log("Bot is active!\nWaiting status update in 2 minutes\nForce-update available by typing \".update\" in discord channel");
	client.setInterval(update,120000); //Time to wait until next update, in miliseconds
});

client.on("message", (message) => {
  if (message.content.startsWith(".обновить")) { 
    message.channel.send("Статус обновлен!");
    update(); //Force-update of players state
  }
});

client.on("message", (message) => {
  if (message.content.startsWith(".update")) { 
    message.channel.send("Status updated!");
    update(); //Force-update of players state
  }
});

client.on("message", (message) => { //Russian ver of status
     if (message.content.startsWith(".статус")) {
        request(url, function(err, response, body) {
			if(err) {
			console.log(err);
			message.channel.send("Ошибка получения данных, повторите попытку позднее.");} //An error message if cannot connect to api
			body = JSON.parse(body);
			if(body.online==true) {	
                if(body.players.online!=0) { //If there is not 0 players, show number and list of players
					message.channel.send("```\nИграют " + body.players.online + ' / ' + body.players.max + "\n\nСписок игроков:\n" + body.players.list.toString().replace(/,/g, '\n') + "```");
				} else { //Else show message there is no players
				message.channel.send("Сервер пуст");}
            } else {
            message.channel.send("Сервер выключен");}} //Message if server is offline
            
		);
}});

client.on("message", (message) => { //English ver of status
     if (message.content.startsWith(".status")) {
        request(url, function(err, response, body) {
			if(err) {
			console.log(err);
			messagd.channel.send("An error occurred trying to get server info. Please try again later.");} //An error message if cannot connect to api
			body = JSON.parse(body);
			if(body.online==true) {	
                if(body.players.online!=0) { //If there is not 0 players, show number and list of players
					message.channel.send("```\nPlaying " + body.players.online + ' / ' + body.players.max + "\n\nPlayer list:\n" + body.players.list.toString().replace(/,/g, '\n') + "```");
				} else { //Else show message there is no players
				message.channel.send("Server empty");}
            } else {
            message.channel.send("Server offline");}} //Message if server is offline
    );
}});


client.on("message", (message) => { //Help message on command
  if (message.content.startsWith(".help")) { 
    message.channel.send("```\n.статус - чтобы получить состояние сервера и список игроков\n.плагины - чтобы получить список плагинов\n.status - to get server stats and players list```");
  }
});


client.login(settings.token);
