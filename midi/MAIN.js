var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

var camera, scene, renderer;

var clock = new THREE.Clock();
var keyboard = new KeyboardState();

var spheres = [];
var ch_note_on = [], wave_index = [];
var begin = false, pause = false;
var time;
var tempo;
var i = 0, j = 0;
var midiplay = {
	ch10: false
};
var wave;
init();
animate();

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	// scene

	scene = new THREE.Scene();

	// camera

	camera = new THREE.PerspectiveCamera(30, aspect, 1, 10000);
	camera.position.set(0, 100, 200);

	// renderer

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setClearColor(0x000000);

	container.appendChild(renderer.domElement);

	// controls

	let controls = new THREE.OrbitControls(camera, renderer.domElement);

	// grid

	let gridXZ = new THREE.GridHelper(200, 20, 'red', 'white');
	scene.add(gridXZ);

	// resize

	window.addEventListener('resize', onWindowResize, false);

	wave = new Wave();

	var gui = new dat.GUI();
	gui.add(midiplay, 'ch10');
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
	if (keyboard.down("esc")) {
		pause = !pause;
		if (!pause) {
			clock.start();
			Player.play();
		}
		else {
			clock.stop();
			Player.pause();
		}
	}

	if (Player != undefined && begin != true) {
		begin = true;
		time = 0;

		tempo = Player.tempo;
		let tpqn = Player.division;
		let tick_to_sec = 60 / (tempo * tpqn);
		wave_index = [...Array(Player.events.length)].fill(0);
		ch_note_on = [...Array(Player.events.length)].map(e => Array(0));
		for (let index = 0; index < Player.events.length; index++) {
			let nowCh = Player.events[index];
			for (let i = 0; i < nowCh.length; i++) {
				if (nowCh[i].name == 'Note on') {
					let second = nowCh[i].tick * tick_to_sec;
					ch_note_on[index].push({ 'second': second, 'noteName': nowCh[i].noteName, 'velocity': nowCh[i].velocity });
				}
			}
		}

		clock.start();
		Player.play();
	}
	if (begin && !pause) {
		let delta = clock.getDelta();
		for (let i = 0; i < wave_index.length; i++) {
			if (i == 9) {
				if (time >= ch_note_on[9][wave_index[9]].second) {
					wave_index[9]++;
					spheres.push(new Sphere(tempo));
				}
			} else {
				if (ch_note_on[i].length==0) continue;
				if (time >= ch_note_on[i][wave_index[i]].second) {
					wave.waveGroup[ch_note_on[i][wave_index[i]].noteName].update(ch_note_on[i][wave_index[i]].velocity);
					wave_index[i]++;
				}
			}
		}
		spheres.forEach(s => {
			s.update(delta);
			if(s.sphere.position.z>=Sphere.DeletePos){
				scene.remove(s.sphere);
				delete s;
			}
		});
		time += delta;

	}
	wave.update();
	requestAnimationFrame(animate);
	render();
}

function render() {
	renderer.render(scene, camera);
}