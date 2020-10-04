class UI {
    constructor() {
        this.score = 0;
        this.combo = 0;
        this.init();
        this.group = new THREE.Group();
        this.group.add(this.scoreLabel, this.scoreText, this.comboLabel, this.comboText);
        this.group.position.set(-30, 15, 20);
        this.group.scale.set(0.5, 0.5, 0.5);
        this.group.rotation.y = Math.PI;
        scene.add(this.group);
    }

    update() {
        this.scoreText.text = this.score;
        this.comboText.text = this.combo;
    }

    init() {
        let size = 160;
        let scale = 10 / size;
        let font = size + 'px Arial';
        let scoreColor = '#00ffff';
        let comboColor = '#ff00ff';
        var textAlign = THREE_Text.textAlign;
        //分數
        this.scoreLabel = new THREE_Text.MeshText2D("Score :", {
            align: textAlign.left,
            font: font,
            fillStyle: scoreColor,
            antialias: true
        });
        this.scoreLabel.position.set(0, 15, 0);
        this.scoreLabel.scale.set(scale, scale, scale);
        this.scoreText = new THREE_Text.MeshText2D(this.score, {
            align: textAlign.left,
            font: font,
            fillStyle: scoreColor,
            antialias: true
        });
        this.scoreText.position.set(40, 15, 0);
        this.scoreText.scale.set(scale, scale, scale);
        //連擊
        this.comboLabel = new THREE_Text.MeshText2D("Combo :", {
            align: textAlign.left,
            font: font,
            fillStyle: comboColor,
            antialias: true
        });
        this.comboLabel.position.set(0, 0, 0);
        this.comboLabel.scale.set(scale, scale, scale);
        this.comboText = new THREE_Text.MeshText2D(this.combo, {
            align: textAlign.left,
            font: font,
            fillStyle: comboColor,
            antialias: true
        });
        this.comboText.position.set(40, 0, 0);
        this.comboText.scale.set(scale, scale, scale);
    }
}