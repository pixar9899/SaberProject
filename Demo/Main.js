var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
var camera, scene, renderer;
var keyboard = new KeyboardState();;

var midi, audio;
var elapsed = 0;
var clock = new THREE.Clock(), begin = false, pause = false;

var mySaber, mySpheres = [];

var ui;
let pointTop = new THREE.Vector3();
let pointBot = new THREE.Vector3();

var startButton = document.getElementById('startButton');

startButton.addEventListener('click', init);

function init() {
	// overlay
	let overlay = document.getElementById('overlay');
	overlay.remove();

	let container = document.createElement('div');
	document.body.appendChild(container);

	// scene

	scene = new THREE.Scene();

	// camera

	camera = new THREE.PerspectiveCamera(30, aspect, 1, 10000);
	camera.position.set(0, 200, -200);

	// renderer

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setClearColor(0xcce0ff);

	container.appendChild(renderer.domElement);

	// controls

	new THREE.OrbitControls(camera, renderer.domElement);

	// grid

	let gridXZ = new THREE.GridHelper(200, 20, 'red', 'black');
	scene.add(gridXZ);

	// resize

	window.addEventListener('resize', onWindowResize, false);

	// saber
	mySaber = new Saber(scene);

	// midi
	let CountDown = ['3', '2', '1', 'GO']
	let audioLoader = new THREE.AudioLoader();
	let listener = new THREE.AudioListener();
	audioLoader.load('test.mp3', function (buffer) {
		audio = new THREE.PositionalAudio(listener);
		audio.setBuffer(buffer);
		let json = $.getJSON("test.json", function (data) {
			midi = new GameCreate(data);
			setTimeout(animate, 4000);
			for (let i = 0; i <= 4; i++) {
				(function (x) {
					window.setTimeout(function () {
						$("#counts").text(CountDown[x]);
					}, 1000 * x);
				})(i);
			}
		});
	});

	ui = new UI();
}

function onWindowResize() {

	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;

	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

}

function animate() {
	if (midi != undefined && !begin) {
		$("#counts").hide();
		begin = true;
		clock.start();
		midi.node.forEach(function (n) {
			mySpheres.push(new Sphere(n.time, 20));
		});
		audio.play();
	}
	else if (begin && !pause) {
		let delta = clock.getDelta();
		elapsed += delta;
		mySpheres.forEach((s, idx) => {
			s.update(delta * TIME_SCALE, elapsed);
			if (s.group.position.z > -10 && s.group.position.z < 10) { // 簡單判定
				mySaber.dotTop.getWorldPosition(pointTop);
				mySaber.dotBot.getWorldPosition(pointBot);
				s.collision(pointTop, pointBot);
			} else if (s.group.position.z < -10 && s.flag == BombStatus.未碰撞) {
				ui.combo = 0;
				s.flag = BombStatus.紀錄完畢;
			}
			if (s.flag == BombStatus.反應完畢) {
				ui.score += s.score;
				ui.combo += 1;
				s.flag = BombStatus.紀錄完畢;
			}
		});
	}

	mySaber.update();
	ui.update();

	requestAnimationFrame(animate);
	render();
}

function render() {
	renderer.render(scene, camera);
}