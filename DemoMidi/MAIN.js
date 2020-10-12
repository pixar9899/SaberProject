var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

var MidiPlayer = MidiPlayer;
var loadFile, Player;
var AudioContext = window.AudioContext || window.webkitAudioContext || false; 
var ac = new AudioContext || new webkitAudioContext;

var camera, scene, renderer;

var keyboard = new KeyboardState();

init();
animate();

Soundfont.instrument(ac, 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/acoustic_guitar_nylon-mp3.js').then(function (instrument) {
	
	loadFile = function() {
		var file    = document.querySelector('input[type=file]').files[0];
		var reader  = new FileReader();
		if (file) reader.readAsArrayBuffer(file);

		reader.addEventListener("load", function () {
			Player = new MidiPlayer.Player(function(event) {
				if (event.name == 'Note on') {
					console.log(event);
					instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
				}
			});

			Player.loadArrayBuffer(reader.result);
			Player.play();

		}, false);
	}

});

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	// scene

	scene = new THREE.Scene();

	// camera

	camera = new THREE.PerspectiveCamera(30, aspect, 1, 10000);
	camera.position.set(200, 200, 0);

	// renderer

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setClearColor(0xcce0ff);

	container.appendChild(renderer.domElement);

	// controls

	let controls = new THREE.OrbitControls(camera, renderer.domElement);

	// grid

	let gridXZ = new THREE.GridHelper(200, 20, 'red', 'black');
	scene.add(gridXZ);

	// resize

	window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;

	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

}

function animate() {
	keyboard.update();
	
	if(Player != undefined){
		//console.log(Player.getCurrentTick());
	}
	requestAnimationFrame(animate);
	render();

}

function render() {

	renderer.render(scene, camera);

}