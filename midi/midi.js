var MidiPlayer = MidiPlayer;
var loadFile, Player;
var AudioContext = window.AudioContext || window.webkitAudioContext || false; 
var ac = new AudioContext || new webkitAudioContext;

var ch10_second = [];

Soundfont.instrument(ac, 'js/acoustic_guitar_nylon-mp3.js').then(function (instrument) {

	loadFile = function() {
		var file = document.querySelector('input[type=file]').files[0];
		var reader = new FileReader();
		if (file) reader.readAsArrayBuffer(file);

		reader.addEventListener("load", function () {
			Player = new MidiPlayer.Player(function(event) {
				if(midiplay.ch10 == false){
					instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
				}
				else{
					if (event.name == 'Note on' && event.track == 10) {
						instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
					}
				}
			});
			Player.loadArrayBuffer(reader.result);
		}, false);
	}
});