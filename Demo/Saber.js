class Saber {
	constructor() {
		this.group = this.makeGroup();
		scene.add(this.group);
	}

	update() {
		keyboard.update();
		if (keyboard.pressed("W")) {
			this.group.position.y += 0.5;
		}
		if (keyboard.pressed("S")) {
			this.group.position.y -= 0.5;
		}
		if (keyboard.pressed("A")) {
			this.group.position.x -= 0.5;
		}
		if (keyboard.pressed("D")) {
			this.group.position.x += 0.5;
		}
	}

	makeGroup() {
		let SaberGroup = new THREE.Group();
		SaberGroup.name = 'SaberGroup';
		let Saber = this.makeSaber();
		SaberGroup.add( Saber );
		
		let DotGroup = this.makeDot( Saber );
		SaberGroup.add(DotGroup);

		return SaberGroup;
	}

	makeSaber() {
		let Saber = new THREE.Mesh(
			new THREE.CylinderGeometry(1, 1, 20, 32),
			new THREE.MeshBasicMaterial(
				{
					color: "white",
					side: THREE.DoubleSide,
					transparent: true,
					opacity: 0.6
				})
			);

		return Saber;
	}

	makeDot(Saber) {
		let DotGroup = new THREE.Group();

		this.dotTop = new THREE.Mesh(
			new THREE.SphereGeometry(1, 32, 32),
			new THREE.MeshBasicMaterial({ color: "yellow" })
		);
		this.dotBot = new THREE.Mesh(
			new THREE.SphereGeometry(1, 32, 32),
			new THREE.MeshBasicMaterial({ color: "red" })
		);

		let Top = Saber.position.clone();
		Top.y += 10;
		this.dotTop.position.copy(Top);
		this.dotTop.name = 'dotTop';
		DotGroup.add(this.dotTop);
		
		let Bot = Saber.position.clone();
		Bot.y -= 10;
		this.dotBot.position.copy(Bot);
		this.dotBot.name = 'dotBot';
		DotGroup.add(this.dotBot);

		return DotGroup;
	}
}