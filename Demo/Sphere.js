class Sphere{
	constructor(time) {
		this.group = this.makeGroup();
		this.group.position.set(0, 0, time * 50);
		scene.add(this.group);
		
		this.flag = '未碰撞';
		this.points = [];
	}

	makeGroup() {
		let SphereGroup = new THREE.Group();
		SphereGroup.name = 'SphereGroup';
		
		this.sphere = new THREE.Mesh(
			new THREE.SphereGeometry(5, 32, 32),
			new THREE.MeshBasicMaterial({
				color: "white",
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.6
			})
		);
		SphereGroup.add(this.sphere);
		
		return SphereGroup;
	}
	update(delta) {
		this.group.position.z -= delta;
	}

	collision(pointTop, pointBot) {
		let point = new THREE.Vector3();
		point = this.group.position.clone();
		
		let line = pointTop.clone().sub(pointBot.clone());
		let line2 = point.clone().sub(pointTop.clone());
		let projectOnLine = line2.projectOnVector(line);
		let closestPoint = pointTop.clone().add(projectOnLine.clone());
		
		let DistanceToSaber = closestPoint.distanceTo(this.group.position);
		let DistanceToTop = closestPoint.distanceTo(pointTop);
		let DistanceToBot = closestPoint.distanceTo(pointBot);
		
		if (DistanceToTop < 20 && DistanceToBot < 20) {
			if(DistanceToSaber <= 5.0 && this.flag == '未碰撞') {
				this.flag = '碰撞中';
				this.points[0] = this.group.worldToLocal(closestPoint);
			}
			if(DistanceToSaber >= 5.0 && this.flag == '碰撞中') {
				this.flag = '碰撞完畢';
				this.points[1] = this.group.worldToLocal(closestPoint);
				console.log(this.points[1]);
				console.log(this.group.worldToLocal(closestPoint));
			}
			if(this.flag == '碰撞完畢') {
				this.flag = '反應完畢';
				this.reaction();
				this.group.remove(this.sphere);
			}
		}
	}

	reaction() {
		let angle = this.points[0].angleTo(this.points[1]);
		
		let Part1 = {
			radius: 5,
			widthSegments: 32,
			heightSegments: 32,
			phiStart: 0,
			phiLength: Math.PI * 2,
			thetaStart: 0,
			thetaLength: angle / 2
		};
		let SpherePart1 = new THREE.Mesh(
			new THREE.SphereGeometry(Part1.radius,
				Part1.widthSegments,
				Part1.heightSegments,
				Part1.phiStart,
				Part1.phiLength,
				Part1.thetaStart,
				Part1.thetaLength),
			new THREE.MeshBasicMaterial({
				color: "white",
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.6
			})
		);
		this.group.add( SpherePart1 );

		let Part2 = {
			radius: 5,
			widthSegments: 32,
			heightSegments: 32,
			phiStart: 0,
			phiLength: Math.PI * 2,
			thetaStart: angle / 2,
			thetaLength: Math.PI
		};
		let SpherePart2 = new THREE.Mesh(
			new THREE.SphereGeometry(Part2.radius,
				Part2.widthSegments,
				Part2.heightSegments,
				Part2.phiStart,
				Part2.phiLength,
				Part2.thetaStart,
				Part2.thetaLength),
			new THREE.MeshBasicMaterial({
				color: "black",
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.6
			})
		);
		this.group.add( SpherePart2 );
	}
}