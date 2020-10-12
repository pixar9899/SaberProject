class Saber {
	static joyconHost = 'http://localhost:2222';
	constructor() {
		this.group = this.makeGroup();
		scene.add(this.group);
		// 光尾
		this.tail = new Tail();
	}
	kbControl() {
		keyboard.update();
		if (keyboard.pressed("W")) {
			this.group.position.z += 0.5;
		}
		if (keyboard.pressed("S")) {
			this.group.position.z -= 0.5;
		}
		if (keyboard.pressed("A")) {
			this.group.position.x += 0.5;
		}
		if (keyboard.pressed("D")) {
			this.group.position.x -= 0.5;
		}
	}
	update(joycon = false) {
		//控制
		if (joycon)
			this.getJoyconOriented();
		else
			this.kbControl();
		// 光劍更新光影(光尾)
		this.tail.update(this.calcTailPos());
	}

	getJoyconOriented() {
		let group = this.group;
		$.ajax({
			type: 'GET',
			url: Saber.joyconHost,
			success: function (result) {
				let rotation = result[0].rotate;
				group.rotation.set(rotation.X * Math.PI / 180, 0, -rotation.Y * Math.PI / 180);
				let gyro = result[0].gyro;
				group.position.x += gyro.Y / 2;
				group.position.z -= gyro.Z / 2;
			},
			error: function (xhr, textStatus, thrownError) {
				console.log(textStatus);
			}
		});
	}

	makeGroup() {
		let SaberGroup = new THREE.Group();
		SaberGroup.name = 'SaberGroup';
		let Saber = this.makeSaber();
		SaberGroup.add(Saber);

		let DotGroup = this.makeDot(Saber);
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
		Saber.position.y = 10;
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
		this.dotTop.visible = false;
		DotGroup.add(this.dotTop);

		let Bot = Saber.position.clone();
		Bot.y -= 10;
		this.dotBot.position.copy(Bot);
		this.dotBot.name = 'dotBot';
		this.dotBot.visible = false;
		DotGroup.add(this.dotBot);

		return DotGroup;
	}

	// 算出光影需要的位置
	calcTailPos() {
		// 一個用於取出當前上下兩端的世界座標
		let tmpVec = new THREE.Vector3();
		let needPos = [];
		//上中下
		[this.dotTop, this.group, this.dotBot].forEach((pos) => {
			pos.getWorldPosition(tmpVec);
			needPos.push([tmpVec.x, tmpVec.y, tmpVec.z]);
		});
		return needPos;
	}
}