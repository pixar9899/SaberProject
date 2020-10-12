const BombStatus = Object.freeze({
	"未碰撞": 0,
	"碰撞中": 1,
	"碰撞完畢": 2,
	"反應完畢": 3,
	"紀錄完畢": 4
})
class Sphere {
	constructor(time = 0, score = 10) {
		this.score = score;
		this.group = this.makeGroup();
		this.group.position.set(0, 0, time * TIME_SCALE);
		scene.add(this.group);

		this.flag = BombStatus.未碰撞
		this.points = [];

		this.style = MovingStyle.leftright;
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
				//再多加入一個光劍頂點位置轉到球的座標的點
				this.points[2] = this.group.worldToLocal(pointTop.clone());
			}
			if (DistanceToSaber >= 5.0 && this.flag == BombStatus.碰撞中) {
				this.flag = BombStatus.碰撞完畢;
				this.points[1] = this.group.worldToLocal(closestPoint);
			}
			else if (this.flag == BombStatus.碰撞完畢) {
				this.flag = BombStatus.反應完畢;
				this.reaction();
				this.group.remove(this.sphere);
			}
		}
	}

	reaction() {
		//計算要拆分thetaLength
		let angle = this.points[0].angleTo(this.points[1]);
		//第1 part
		let SpherePart1 = new THREE.Mesh(
			// radius, widthSegments, heightSegments, phiStart, phiLength
			// thetaStart, thetaLength
			new THREE.SphereGeometry(5, 32, 32, 0, Math.PI * 2,
				0,
				angle / 2
			),
			new THREE.MeshBasicMaterial({
				color: "red",
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.6
			})
		);

		//第2 part
		let SpherePart2 = new THREE.Mesh(
			// radius, widthSegments, heightSegments, phiStart, phiLength
			// thetaStart, thetaLength
			new THREE.SphereGeometry(5, 32, 32, 0, Math.PI * 2,
				angle / 2,
				(2 * Math.PI - angle) / 2
			),
			new THREE.MeshBasicMaterial({
				color: "blue",
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.6
			})
		);

		//算法線向量
		let v1 = this.points[1].clone().sub(this.points[0]);
		let v2 = this.points[2].clone().sub(this.points[0]);
		let rotVec = new THREE.Vector3().crossVectors(v1, v2).normalize();
		let reverseRot = rotVec.clone().multiplyScalar(-1);
		if (reverseRot.distanceTo(this.points[2]) < rotVec.distanceTo(this.points[2]))
			rotVec = reverseRot;

		let yAxis = new THREE.Vector3(0, 1, 0);
		let newAxis = new THREE.Vector3();
		newAxis.crossVectors(yAxis, rotVec).normalize();
		let rotateAngle = yAxis.angleTo(rotVec);

		SpherePart1.rotateOnWorldAxis(newAxis, rotateAngle);
		SpherePart2.rotateOnWorldAxis(newAxis, rotateAngle);

		this.group.add(SpherePart1);
		this.group.add(SpherePart2);
	}
}