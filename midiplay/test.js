var MidiPlayer = require('midi-player-js');

// Initialize player and register event handler
var Player = new MidiPlayer.Player(function(event) {
	//console.log(event);
});


// Load a MIDI file
Player.loadFile('./happy_birthday.mid');

var tempo = Player.tempo;
var ppqn = Player.division;

var ticks = [];
//Player.play();

for (let i = 0; i < Player.getEvents()[1].length; i++){
	var node = Player.getEvents()[1][i];
	console.log(Player);
	
	if(Player.getEvents().name == "Set Tempo"){
		//console.log(node);
		tempo = node.data;
	}
	if(node.name == "Note on" || node.name == "Note off"){
		var new_node = [];
		new_node.second = node.tick * 60000 / ppqn / tempo / 1000;
		new_node.name = [node.noteName];

		if(ticks.length > 0 && ticks[ticks.length - 1].second == new_node.second){
			ticks[ticks.length - 1].name.push(node.noteName);
		}
		else{
			ticks.push(new_node);
		}
	}
}

for(let i = 0; i < ticks.length; i++){
	//console.log(ticks[i]);
}