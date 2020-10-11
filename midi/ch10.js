var MidiPlayer = require('midi-player-js');

// Initialize player and register event handler
var Player = new MidiPlayer.Player(function(event) {
	//console.log(event);
});

// Load a MIDI file
Player.loadFile('./Pure_Love.mid');

var tempo = Player.tempo;
var tpqn = Player.division;
/*

tempo: quarternote / minute
tpqn: tick / quarternote

second = 60 / (tempo * tpqn)

*/
var tick_to_sec = 60 / (tempo * tpqn);

console.log( tick_to_sec );

var ch10 = Player.getEvents()[9];

var ch10_note_on = [];

for(var i = 0; i < ch10.length; i++){
	if(ch10[i].name == 'Note on'){
		ch10_note_on.push(ch10[i].tick * tick_to_sec);
	}
}

for(var i = 0; i < ch10_note_on.length; i++){
	console.log( ch10_note_on[i] );
}