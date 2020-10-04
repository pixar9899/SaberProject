class Tail {
    static MAXVERTICES = 40;
    constructor() {
        this.vertices = [];
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([]), 3));
        this.material = new THREE.MeshBasicMaterial({
            color: "red",
            transparent: true,
            opacity: 0.6
        });
        this.object = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.object);
    }
    pushNewPos(verArr) {
        // 把新的點的位置push進來
        verArr.forEach((v) => {
            this.vertices.push(v);
        })
        // 當頂點數超過MAX就remove陣列最前面的光劍位置，也就是前三個點
        if (this.vertices.length > Tail.MAXVERTICES)
            this.vertices = this.vertices.slice(3);
    }
    setVertices() {
        let v = [];

        //每六個點做一個面，要做雙面，
        for (let i = 0; i < this.vertices.length - 3; i += 3) {
            [
                //一面
                this.vertices[i],
                this.vertices[i + 1],
                this.vertices[i + 3],
                this.vertices[i + 1],
                this.vertices[i + 4],
                this.vertices[i + 3],
                this.vertices[i + 2],
                this.vertices[i + 4],
                this.vertices[i + 1],
                this.vertices[i + 2],
                this.vertices[i + 5],
                this.vertices[i + 4],
                //另一面
                this.vertices[i],
                this.vertices[i + 3],
                this.vertices[i + 1],
                this.vertices[i + 1],
                this.vertices[i + 3],
                this.vertices[i + 4],
                this.vertices[i + 2],
                this.vertices[i + 1],
                this.vertices[i + 4],
                this.vertices[i + 2],
                this.vertices[i + 4],
                this.vertices[i + 5]
            ].forEach((point) => {
                v.push(point[0], point[1], point[2]);
            })
        }
        let floatArr = new Float32Array(v);
        this.geometry.setAttribute('position', new THREE.BufferAttribute(floatArr, 3));
        this.geometry.attributes.position.needUpdate = true;
    }
    //光影的update
    update(verArr) {
        this.pushNewPos(verArr);
        this.setVertices();
    }
}