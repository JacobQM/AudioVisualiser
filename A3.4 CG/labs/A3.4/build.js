let bassGeometry, midGeometry, trebleGeometry;
let bassPlane, midShape, trebleShape;

function build() {
    createRippleSphere(sphereScene);
    createRippleShapes(sheetsScene);
}

function createRippleSphere(scene) {
    const geometry = new THREE.SphereGeometry(2, 100, 100);

    // Sphere shader
    sphereMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertexShaderBass').textContent,
        fragmentShader: document.getElementById('fragmentShaderBass').textContent,
        uniforms: {
            time: { value: 1.0 },
            mainAmplitude: { value: 1.0 },
            mainFrequency: { value: 2.0 },
            detailAmplitude: { value: 0.5 },
            detailFrequency: { value: 4.0 },
            audioData: { value: 0.0 },
            color: { value: new THREE.Color(1.0, 0.0, 0.0) }
        },
        wireframe: true
    });
    const sphere = new THREE.Mesh(geometry, sphereMaterial);
    scene.add(sphere);
}

function createRippleShapes(scene) {
    // Initial geometry creation
    bassGeometry = new THREE.BoxGeometry(5, 5, 0.5, 100, 100, 1);
    midGeometry = new THREE.IcosahedronGeometry(2.5, 1);
    trebleGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);

    // Bass shader
    bassMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertexShaderBass').textContent,
        fragmentShader: document.getElementById('fragmentShaderBass').textContent,
        uniforms: {
            time: { value: 1.0 },
            mainAmplitude: { value: 1.0 },
            mainFrequency: { value: 2.0 },
            detailAmplitude: { value: 0.5 },
            detailFrequency: { value: 4.0 },
            audioData: { value: 0.0 },
            color: { value: new THREE.Color(1.0, 0.0, 0.0) }
        },
        wireframe: true
    });
    bassPlane = new THREE.Mesh(bassGeometry, bassMaterial);
    scene.add(bassPlane);

    // Mid shader
    midMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertexShaderMid').textContent,
        fragmentShader: document.getElementById('fragmentShaderMid').textContent,
        uniforms: {
            time: { value: 1.0 },
            mainAmplitude: { value: 1.0 },
            mainFrequency: { value: 5.0 },
            detailAmplitude: { value: 0.5 },
            detailFrequency: { value: 7.5 },
            audioData: { value: 0.0 },
            color: { value: new THREE.Color(0.0, 1.0, 0.0) }
        },
        wireframe: true
    });
    midShape = new THREE.Mesh(midGeometry, midMaterial);
    scene.add(midShape);

    // Treble shader
    trebleMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('vertexShaderTreble').textContent,
        fragmentShader: document.getElementById('fragmentShaderTreble').textContent,
        uniforms: {
            time: { value: 1.0 },
            mainAmplitude: { value: 1.0 },
            mainFrequency: { value: 10.0 },
            detailAmplitude: { value: 0.5 },
            detailFrequency: { value: 15.0 },
            audioData: { value: 0.0 },
            color: { value: new THREE.Color(0.0, 0.0, 1.0) }
        },
        wireframe: true
    });
    trebleShape = new THREE.Mesh(trebleGeometry, trebleMaterial);
    scene.add(trebleShape);
}