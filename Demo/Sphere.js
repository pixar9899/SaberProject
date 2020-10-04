const BombStatus = Object.freeze({
	"未碰撞": 0,
	"碰撞中": 1,
	"碰撞完畢": 2,
	"反應完畢": 3,
	"紀錄完畢": 4
})
class Sphere {
	constructor(time, score = 10) {
		this.score = score;
		this.group = this.makeGroup();
		this.group.position.set(0, 0, time * TIME_SCALE);
		scene.add(this.group);

		this.flag = BombStatus.未碰撞
		this.points = [];

		this.style = MovingStyle.leftright;

		this.calcPos = [];
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

	moving(elapsed) {
		switch (this.style) {
			case MovingStyle.updown:
				this.group.position.y = Math.sin(elapsed * 2) * 15;
			case MovingStyle.leftright:
				this.group.position.x = Math.sin(elapsed * 2) * 15;
		}
	}

	update(delta, elapsed) {
		this.moving(elapsed);
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
			if (DistanceToSaber <= 5.0 && this.flag == BombStatus.未碰撞) {
				this.flag = BombStatus.碰撞中;
				this.points[0] = this.group.worldToLocal(closestPoint);
			}
			if (DistanceToSaber >= 5.0 && this.flag == BombStatus.碰撞中) {
				this.flag = BombStatus.碰撞完畢;
				this.points[1] = this.group.worldToLocal(closestPoint);
				console.log(this.points[1]);
				console.log(this.group.worldToLocal(closestPoint));
			}
			if (this.flag == BombStatus.碰撞完畢) {
				this.flag = BombStatus.反應完畢;
				this.reaction();
				this.historyPos = this.sphere.position.clone();
				this.group.remove(this.sphere);
			}
		}
	}

	reaction() {
		let angle = this.points[0].angleTo(this.points[1]);
		let SpherePart1 = new THREE.Mesh(
			// radius, widthSegments, heightSegments, phiStart, phiLength
			// thetaStart, thetaLength
			new THREE.SphereGeometry(5, 32, 32, 0, Math.PI * 2,
				0,
				angle / 2
			),
			new THREE.MeshBasicMaterial({
				color: "white",
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.6
			})
		);
		this.group.add(SpherePart1);
		let SpherePart2 = new THREE.Mesh(
			// radius, widthSegments, heightSegments, phiStart, phiLength
			// thetaStart, thetaLength
			new THREE.SphereGeometry(5, 32, 32, 0, Math.PI * 2,
				angle / 2,
				(2 * Math.PI - angle) / 2
			),
			new THREE.MeshBasicMaterial({
				color: "black",
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.6
			})
		);
		this.group.add(SpherePart2);
	}
}