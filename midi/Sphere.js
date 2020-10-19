class Sphere {
	static DeletePos = 200;
	constructor(tempo) {
		this.sphere = new THREE.Mesh(
			new THREE.SphereGeometry(5, 32, 32),
			new THREE.MeshBasicMaterial({ color: "white" })
		);
		scene.add(this.sphere);
		this.sphere.position.set(0, 0, 0);
		this.tempo = tempo;
	}
	update(time) {
		this.sphere.position.z += time * this.tempo;
	}
}