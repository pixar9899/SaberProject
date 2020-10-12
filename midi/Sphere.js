class Sphere{
	constructor(tempo) {
		this.sphere = new THREE.Mesh(
			new THREE.SphereGeometry(5, 32, 32),
			new THREE.MeshBasicMaterial({color: "black"})
		);
		scene.add(this.sphere);
		this.sphere.position.set(0, 0, 0);
		this.tempo = tempo;
	}
	update(time){
		this.sphere.position.z += time * this.tempo;
		if(this.sphere.position.z > 100)
			scene.remove(this.sphere);
	}
}