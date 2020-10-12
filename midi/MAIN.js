var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

var camera, scene, renderer;

var clock = new THREE.Clock();
var keyboard = new KeyboardState();

var spheres = [];
var ch10_note_on = [];
var begin = false, pause = false;
var time;
var tempo;
var i = 0;
var midiplay = {
	ch10: false
};

init();
animate();

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
		if(!pause){
			clock.start();
			Player.play();
		}
		else{
			clock.stop();
			Player.pause();
		}
	}

	if(Player != undefined && begin != true){
		begin = true;
		time = 0;

		tempo = Player.tempo;
		let tpqn = Player.division;
		let tick_to_sec = 60 / (tempo * tpqn);
		let ch10 = Player.getEvents()[9];
		
		for(let i = 0; i < ch10.length; i++){
			if(ch10[i].name == 'Note on'){
				let second = ch10[i].tick * tick_to_sec;
				ch10_note_on.push(second);
			}
		}

		clock.start();
		Player.play();
	}
	if(begin && !pause){
		let delta = clock.getDelta();
		if(time >= ch10_note_on[i]){
			i++;
			spheres.push(new Sphere(tempo));
		}
		spheres.forEach(s => {
			s.update(delta);
		});
		time += delta;
	}

	requestAnimationFrame(animate);
	render();

}

function render() {

	renderer.render(scene, camera);

}