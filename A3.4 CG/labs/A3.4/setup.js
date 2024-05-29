let currentScene = 'sphere';
let sphereScene, sheetsScene, camera, renderer, controls;
let audioContext, analyser, dataArray, bufferLength;
let sphereMaterial, bassMaterial, midMaterial, trebleMaterial;

function setScenes() {
    sphereScene = new THREE.Scene();
    sheetsScene = new THREE.Scene();
    const ratio = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, ratio, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    window.addEventListener('resize', function () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

function startAudioCapture(selectedInput) {
    // Set up the audio
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    //system audio or microphone based on user selection
    if (selectedInput === 'microphone') {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
        }).catch(function (err) {
            console.error('Error capturing audio:', err);
        });
    } else if (selectedInput === 'speakers') {
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
            let virtualDeviceId = null;
            devices.forEach(function (device) {
                if (device.kind === 'audioinput' && device.label.includes("Virtual")) { // Adjust the condition based on your virtual audio cable's label
                    virtualDeviceId = device.deviceId;
                }
            });

            if (virtualDeviceId) {
                navigator.mediaDevices.getUserMedia({ audio: { deviceId: virtualDeviceId } }).then(function (stream) {
                    const source = audioContext.createMediaStreamSource(stream);
                    source.connect(analyser);
                }).catch(function (err) {
                    console.error('Error capturing audio:', err);
                });
            } else {
                console.error('Virtual audio cable not found. Please ensure it is installed and properly configured.');
            }
        }).catch(function (err) {
            console.error('Error enumerating devices:', err);
        });
    }
}