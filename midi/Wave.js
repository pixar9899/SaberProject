class Wave {
    static noteName = ["A0", "Bb0", "B0", "C1", "Db1", "D1", "Eb1", "E1", "F1", "Gb1", "G1", "Ab1", "A1", "Bb1", "B1", "C2", "Db2", "D2", "Eb2", "E2", "F2", "Gb2", "G2", "Ab2", "A2", "Bb2", "B2", "C3", "Db3", "D3", "Eb3", "E3", "F3", "Gb3", "G3", "Ab3", "A3", "Bb3", "B3", "C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4", "C5", "Db5", "D5", "Eb5", "E5", "F5", "Gb5", "G5", "Ab5", "A5", "Bb5", "B5", "C6", "Db6", "D6", "Eb6", "E6", "F6", "Gb6", "G6", "Ab6", "A6", "Bb6", "B6", "C7", "Db7", "D7", "Eb7", "E7", "F7", "Gb7", "G7", "Ab7", "A7", "Bb7", "B7", "C8"];
    constructor(layer = null) {
        this.waveGroup = {}
        this.meshGroup = new THREE.Group();
        Wave.noteName.forEach((name, i) => {
            let nb = new NoteBar(layer);
            nb.mesh.position.set((i - 44) * 2, 0, 0);
            this.meshGroup.add(nb.mesh);
            this.waveGroup[name] = nb;
        });
        scene.add(this.meshGroup);
    }

    update() {
        Object.keys(this.waveGroup).forEach((key) => { this.waveGroup[key].update() });
    }
}

class NoteBar {
    constructor(layer = null) {
        this.isUpdate = false;
        this.geometry = new THREE.BufferGeometry();
        // create a simple square shape. We duplicate the top left and bottom right
        // vertices because each vertex needs to appear once per triangle.
        this.velocity = 0;
        var vertices = new Float32Array([
            /* 底部往上 */
            -1.0, 0, 0,
            1.0, 0, 0,
            1.0, this.velocity, 0,
            /* 上半塊 */
            -1.0, 0, 0,
            1.0, this.velocity, 0,
            -1.0, this.velocity, 0,
        ]);

        // 三個值一個點
        this.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        // 隨機顏色
        let color = NoteBar.randomHSL();
        // 設定顏色
        var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(color.h, color.s, color.l)
        });
        this.mesh = new THREE.Mesh(this.geometry, material);
        if (layer != null) {
            this.mesh.layers.toggle(layer);
        }
    }

    fallDown() {
        if (this.velocity >= 0)
            this.velocity -= this.velocity / 10;
    }

    update(velocity = -1) {
        if (velocity != -1)
            this.velocity = velocity;
        Math.max(this.velocity, 50);
        this.fallDown();
        let prevArray = this.geometry.attributes.position.array;
        // 三個值一個點
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
            /* 底部往上 */
            -1.0, 0, 0,
            1.0, 0, 0,
            1.0, this.velocity, 0,
            /* 上半塊 */
            -1.0, 0, 0,
            1.0, this.velocity, 0,
            -1.0, this.velocity, 0,
        ]), 3));
        this.geometry.attributes.position.needUpdate = true;
        prevArray = null;
    }

    static randomHSL() {
        return {
            "h": Math.random(),
            "s": Math.random() / 2 + 0.5,
            "l": Math.random() / 2 + 0.25
        }
    }
}