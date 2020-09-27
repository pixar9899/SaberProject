var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

var camera, scene, renderer;
var container;
var keyboard = new KeyboardState();
var group, sphere;
var dotYellow, dotRed, dotBlack, dotWhite;
var flag = 1;
var points = [];
var Saber;
var posArr = [];
init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // scene

    scene = new THREE.Scene();

    // camera

    camera = new THREE.PerspectiveCamera(30, aspect, 1, 10000);
    camera.position.set(0, 100, 100);

    // renderer

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setClearColor(0xcce0ff);

    container.appendChild(renderer.domElement);

    // controls

    let controls = new THREE.OrbitControls(camera, renderer.domElement);

    // grid

    let gridXZ = new THREE.GridHelper(200, 20, 'red', 'black');
    scene.add(gridXZ)

    // resize

    window.addEventListener('resize', onWindowResize, false);

    var Sgeometry = new THREE.SphereGeometry(5, 32, 32);
    var Smaterial = new THREE.MeshBasicMaterial({
        color: "white",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    });
    sphere = new THREE.Mesh(Sgeometry, Smaterial);
    scene.add(sphere);

    Saber = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 20, 32), new THREE.MeshBasicMaterial({
        color: "white",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
    }));
    Saber.radius = 4;
    group = new THREE.Group();
    group.position.x = -10;
    group.add(Saber);
    group.position.x = -10;
    group.rotation.z = Math.PI / 4;
    group.rotation.y = Math.PI / 4;
    scene.add(group);
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var yellow = new THREE.MeshBasicMaterial({
        color: "yellow"
    });
    var red = new THREE.MeshBasicMaterial({
        color: "red"
    });
    var black = new THREE.MeshBasicMaterial({
        color: "black"
    });
    var white = new THREE.MeshBasicMaterial({
        color: "white"
    });

    dotYellow = new THREE.Mesh(geometry, yellow);
    dotRed = new THREE.Mesh(geometry, red);
    dotBlack = new THREE.Mesh(geometry, black);
    dotWhite = new THREE.Mesh(geometry, white);

    Saber.pointTop = Saber.position.clone();
    Saber.pointTop.y += 10;
    dotYellow.position.copy(Saber.pointTop);

    Saber.pointBottom = Saber.position.clone();
    Saber.pointBottom.y -= 10;
    dotRed.position.copy(Saber.pointBottom);

    group.add(dotYellow);
    group.add(dotRed);
    scene.add(dotBlack);
}

function onWindowResize() {

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

}

function animate() {
    if (keyboard.pressed("W")) {
        group.position.y += 0.5
    }
    if (keyboard.pressed("S")) {
        group.position.y -= 0.5
    }
    if (keyboard.pressed("A")) {
        group.position.x -= 0.5
    }
    if (keyboard.pressed("D")) {
        group.position.x += 0.5
    }

    if (keyboard.pressed("I")) {
        sphere1.rotation.y += 0.1
        sphere2.rotation.y += 0.1
    }
    if (keyboard.pressed("K")) {
        sphere1.rotation.y -= 0.1
        sphere2.rotation.y -= 0.1
    }
    if (keyboard.pressed("J")) {
        sphere1.rotation.x -= 0.1
        sphere2.rotation.x -= 0.1
    }
    if (keyboard.pressed("L")) {
        sphere1.rotation.x += 0.1
        sphere2.rotation.x += 0.1
    }
    if (keyboard.pressed("U")) {
        sphere1.rotation.z -= 0.1
        sphere2.rotation.z -= 0.1
    }
    if (keyboard.pressed("O")) {
        sphere1.rotation.z += 0.1
        sphere2.rotation.z += 0.1
    }
    var point = new THREE.Vector3();
    point = sphere.position.clone();

    var pointTop = new THREE.Vector3();
    dotYellow.getWorldPosition(pointTop);
    var pointBottom = new THREE.Vector3();
    dotRed.getWorldPosition(pointBottom);

    var line = pointTop.clone().sub(pointBottom.clone());
    var line2 = point.clone().sub(pointTop.clone());
    var projectOnLine = line2.projectOnVector(line);
    var closestPoint = pointTop.clone().add(projectOnLine.clone());
    dotBlack.position.copy(closestPoint);

    var judge = closestPoint.distanceTo(sphere.position);

    if (judge <= 5.0 && judge != 0 && flag == 1) {
        flag = 2;
        console.log("1");

        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var blue = new THREE.MeshBasicMaterial({
            color: "blue"
        });
        dotblue = new THREE.Mesh(geometry, blue);
        dotblue.position.copy(closestPoint);
        posArr.push(group.children[1].getWorldPosition());
        posArr.push(closestPoint);
        let yBall = group.children[1].clone();
        yBall.position.copy(group.children[1].getWorldPosition());
        scene.add(yBall);
        points[0] = closestPoint;
        console.log(points[0]);
        scene.add(dotblue);
    } else if (judge >= 5.0 && flag == 2) {
        flag = 3;
        console.log("2");

        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var blue = new THREE.MeshBasicMaterial({
            color: "blue"
        });
        dotblue = new THREE.Mesh(geometry, blue);
        dotblue.position.copy(closestPoint);
        posArr.push(closestPoint);
        points[1] = closestPoint;
        console.log(points[1]);
        scene.add(dotblue);
    } else if (flag == 3) {
        flag = 4;
        console.log("3");

        var vec1 = points[0].sub(sphere.position.clone());
        var vec2 = points[1].sub(sphere.position.clone());
        var angle = vec1.angleTo(vec2)

        console.log(angle);

        scene.remove(sphere);

        var data = {
            radius: 5,
            widthSegments: 32,
            heightSegments: 64,
            phiStart: 0,
            phiLength: Math.PI * 2,
            thetaStart: 0,
            thetaLength: angle / 2
        };

        var geometry = new THREE.SphereGeometry(data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
        var material = new THREE.MeshBasicMaterial({
            color: "blue",
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        sphere1 = new THREE.Mesh(geometry, material);
        scene.add(sphere1);

        var data = {
            radius: 5,
            widthSegments: 32,
            heightSegments: 64,
            phiStart: 0,
            phiLength: Math.PI * 2,
            thetaStart: angle / 2,
            thetaLength: (2 * Math.PI - angle) / 2
        };

        var geometry = new THREE.SphereGeometry(data.radius, data.widthSegments, data.heightSegments, data.phiStart, data.phiLength, data.thetaStart, data.thetaLength);
        var material = new THREE.MeshBasicMaterial({
            color: "red",
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        sphere2 = new THREE.Mesh(geometry, material);
        scene.add(sphere2);

        //計算法線向量
        a = posArr[1].clone().sub(posArr[0]);
        b = posArr[2].clone().sub(posArr[0]);
        let rotVec = new THREE.Vector3().crossVectors(a, b).normalize();
        sphere1.lookAt(rotVec);
        sphere2.lookAt(rotVec);
        sphere1.rotation.x -= Math.PI / 2;
        sphere2.rotation.x -= Math.PI / 2;
        //畫三條線
        let c = posArr.slice();
        c.push(posArr[0]);
        var geo = new THREE.BufferGeometry().setFromPoints(c);
        var checkLine = new THREE.Line(geo, new THREE.LineBasicMaterial({
            color: 0x000000,
            linewidth: 1,
            linecap: 'round', //ignored by WebGLRenderer
            linejoin: 'round' //ignored by WebGLRenderer
        }));
        scene.add(checkLine);

        //法線圓柱
        normalGroup = new THREE.Group();
        normalGroup.lookAt(rotVec);
        normalcylinder = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 8, 32), new THREE.MeshBasicMaterial({ color: 'purple' }));
        normalcylinder.position.y = 4;
        normalGroup.add(normalcylinder);
        scene.add(normalGroup);
        //法線線條
        var geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), rotVec]);
        var normalLine = new THREE.Line(geo, new THREE.LineBasicMaterial({
            color: "red",
            linewidth: 1,
            linecap: 'round', //ignored by WebGLRenderer
            linejoin: 'round' //ignored by WebGLRenderer
        }));
        scene.add(normalLine);

        // var material = new THREE.MeshBasicMaterial({ color: "pink", side: THREE.DoubleSide });
        // plane = new THREE.Mesh(new THREE.PlaneGeometry(50, 50, 32), material);
        /* sphere1.rotation.set(rotVec.x,rotVec.y,rotVec.z);
        sphere2.rotation.set(rotVec.x,rotVec.y,rotVec.z); */
        // plane.rotation.set(rotVec.x, rotVec.y, rotVec.z);

        // scene.add(plane);
        window.rotVec = rotVec;
    }

    keyboard.update();
    requestAnimationFrame(animate);
    render();

}

function render() {

    renderer.render(scene, camera);

}
