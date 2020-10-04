var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

var camera, scene, renderer;
var keyboard = new KeyboardState();

var midi, audio;
var clock = new THREE.Clock(), begin = false, pause = false;

var mySaber, mySpheres = [];

var startButton = document.getElementById( 'startButton' );
startButton.addEventListener( 'click', init );

function init() {
	// overlay
	var overlay = document.getElementById( 'overlay' );
	overlay.remove();

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

	// saber
	mySaber = new Saber();

	// midi
	let CountDown = ['3', '2', '1', 'GO']
	let audioLoader = new THREE.AudioLoader();
	let listener = new THREE.AudioListener();
	audioLoader.load( 'test.mp3', function ( buffer ) {
		audio = new THREE.PositionalAudio( listener );
		audio.setBuffer( buffer );
		let json = $.getJSON("test.json", function(data) {
			midi = new GameCreate(data);
			setTimeout(animate, 4000);
			for( let i = 0; i <= 4; i++ ) {
				(function(x){
					window.setTimeout(function() {
						$("#counts").text(CountDown[x]);
					}, 1000 * x);
				})(i);
			}
		});
	});
}

function onWindowResize() {

	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;

	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

}

function animate() {
	
	if(midi != undefined && !begin){
		$("#counts").text("");
		begin = true;
		clock.start();
		midi.node.forEach(function(n){
			mySpheres.push(new Sphere(n.time));
		});
		audio.play();
	}
	else if(begin && !pause){
		let delta = clock.getDelta() * 50;
		mySpheres.forEach(function (s) {
			s.update( delta );
			if(s.group.position.z > -10 && s.group.position.z < 10){ // 簡單判定
				let pointTop = new THREE.Vector3();
				mySaber.dotTop.getWorldPosition(pointTop);
				let pointBot = new THREE.Vector3();
				mySaber.dotBot.getWorldPosition(pointBot);
				s.collision(pointTop, pointBot);
			}
		});
	}

	mySaber.update();

	requestAnimationFrame(animate);
	render();

}

function render() {

	renderer.render(scene, camera);

}