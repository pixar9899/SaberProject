function createComposer() {
    // 後期處理的通常步驟：
    //   1. 建立一個 EffectComposer，假設命名為composer
    //   2. 給composer加入(addPass)各種通道
    // 通常第一個加入的通道是RenderPass，後續可以看需求選擇加入的通道型別和順序，例如這裡後續就用到了BloomPass
    const bloomComposer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    const bloomPass = createUnrealBloomPass(); // 我們封裝好的 createUnrealBloomPass 函式，用來建立BloomPass（輝光效果）
    bloomComposer.addPass(renderPass);
    bloomComposer.addPass(bloomPass);
    return bloomComposer;
  }
  
  // UnrealBloomPass，輝光效果
  function createUnrealBloomPass() {
    const bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    const params = {
      exposure: 1,
      bloomThreshold: 0.2,
      bloomStrength: 0.5, // 輝光強度
      bloomRadius: 0,
    };
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;
    return bloomPass;
}