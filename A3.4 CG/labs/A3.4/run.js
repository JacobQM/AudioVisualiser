document.addEventListener('DOMContentLoaded', function () {
    setScenes();
    build();
    setupGUI();
    animate();
});

function setupGUI() {
    const guiSphere = new dat.GUI({ name: 'Sphere Controls' });
    const guiSheets = new dat.GUI({ name: 'Sheets Controls' });

    const sceneController = { currentScene: 'sphere' };
    guiSphere.add(sceneController, 'currentScene', ['sphere', 'sheets']).name('Scene').onChange(function (value) {
        currentScene = value;
        updateGUIVisibility();
    });

    guiSheets.add(sceneController, 'currentScene', ['sphere', 'sheets']).name('Scene').onChange(function (value) {
        currentScene = value;
        updateGUIVisibility();
    });

    const audioControls = {
        input: 'microphone',
        startVisualizer: function () {
            startAudioCapture(audioControls.input);
        }
    };

    guiSphere.add(audioControls, 'input', ['microphone', 'speakers']).name('Audio Input');
    guiSphere.add(audioControls, 'startVisualizer').name('Start Visualizer');

    guiSheets.add(audioControls, 'input', ['microphone', 'speakers']).name('Audio Input');
    guiSheets.add(audioControls, 'startVisualizer').name('Start Visualizer');

    const bassFolderSphere = guiSphere.addFolder('Bass');
    bassFolderSphere.add(sphereMaterial.uniforms.mainAmplitude, 'value', 0.1, 5).name('Main Amplitude');
    bassFolderSphere.add(sphereMaterial.uniforms.mainFrequency, 'value', 0.1, 10).name('Main Frequency');
    bassFolderSphere.add(sphereMaterial.uniforms.detailAmplitude, 'value', 0.1, 5).name('Detail Amplitude');
    bassFolderSphere.add(sphereMaterial.uniforms.detailFrequency, 'value', 0.1, 10).name('Detail Frequency');
    bassFolderSphere.addColor({ color: sphereMaterial.uniforms.color.value.getHex() }, 'color').name('Color').onChange(function (value) {
        sphereMaterial.uniforms.color.value.setHex(value);
    });
    bassFolderSphere.open();

    const bassFolderSheets = guiSheets.addFolder('Bass');
    const bassVisibility = { visible: true };
    bassFolderSheets.add(bassVisibility, 'visible').name('Visible').onChange(toggleBassVisibility);
    bassFolderSheets.add({ width: 5 }, 'width', 1, 10).name('Width').onChange(updateBassGeometry);
    bassFolderSheets.add({ height: 5 }, 'height', 1, 10).name('Height').onChange(updateBassGeometry);
    bassFolderSheets.add({ depth: 0.5 }, 'depth', 0.1, 5).name('Depth').onChange(updateBassGeometry);
    bassFolderSheets.add({ widthSegments: 100 }, 'widthSegments', 1, 200).name('Width Segments').onChange(updateBassGeometry);
    bassFolderSheets.add({ heightSegments: 100 }, 'heightSegments', 1, 200).name('Height Segments').onChange(updateBassGeometry);
    bassFolderSheets.add(bassMaterial.uniforms.mainAmplitude, 'value', 0.1, 5).name('Main Amplitude');
    bassFolderSheets.add(bassMaterial.uniforms.mainFrequency, 'value', 0.1, 10).name('Main Frequency');
    bassFolderSheets.add(bassMaterial.uniforms.detailAmplitude, 'value', 0.1, 5).name('Detail Amplitude');
    bassFolderSheets.add(bassMaterial.uniforms.detailFrequency, 'value', 0.1, 10).name('Detail Frequency');
    bassFolderSheets.addColor({ color: bassMaterial.uniforms.color.value.getHex() }, 'color').name('Color').onChange(function (value) {
        bassMaterial.uniforms.color.value.setHex(value);
    });
    bassFolderSheets.open();

    const midFolderSheets = guiSheets.addFolder('Mid');
    const midVisibility = { visible: true };
    midFolderSheets.add(midVisibility, 'visible').name('Visible').onChange(toggleMidVisibility);
    midFolderSheets.add({ radius: 2.5 }, 'radius', 1, 5).name('Radius').onChange(updateMidGeometry);
    midFolderSheets.add({ detail: 1 }, 'detail', 0, 4).name('Detail').onChange(updateMidGeometry);
    midFolderSheets.add(midMaterial.uniforms.mainAmplitude, 'value', 0.1, 5).name('Main Amplitude');
    midFolderSheets.add(midMaterial.uniforms.mainFrequency, 'value', 0.1, 10).name('Main Frequency');
    midFolderSheets.add(midMaterial.uniforms.detailAmplitude, 'value', 0.1, 5).name('Detail Amplitude');
    midFolderSheets.add(midMaterial.uniforms.detailFrequency, 'value', 0.1, 10).name('Detail Frequency');
    midFolderSheets.addColor({ color: midMaterial.uniforms.color.value.getHex() }, 'color').name('Color').onChange(function (value) {
        midMaterial.uniforms.color.value.setHex(value);
    });
    midFolderSheets.open();


    const trebleFolderSheets = guiSheets.addFolder('Treble');
    const trebleVisibility = { visible: true };
    trebleFolderSheets.add(trebleVisibility, 'visible').name('Visible').onChange(toggleTrebleVisibility);
    trebleFolderSheets.add({ radius: 2 }, 'radius', 1, 5).name('Radius').onChange(updateTrebleGeometry);
    trebleFolderSheets.add({ tube: 0.5 }, 'tube', 0.1, 1).name('Tube Radius').onChange(updateTrebleGeometry);
    trebleFolderSheets.add({ radialSegments: 16 }, 'radialSegments', 8, 64).name('Radial Segments').onChange(updateTrebleGeometry);
    trebleFolderSheets.add({ tubularSegments: 100 }, 'tubularSegments', 50, 200).name('Tubular Segments').onChange(updateTrebleGeometry);
    trebleFolderSheets.add(trebleMaterial.uniforms.mainAmplitude, 'value', 0.1, 5).name('Main Amplitude');
    trebleFolderSheets.add(trebleMaterial.uniforms.mainFrequency, 'value', 0.1, 10).name('Main Frequency');
    trebleFolderSheets.add(trebleMaterial.uniforms.detailAmplitude, 'value', 0.1, 5).name('Detail Amplitude');
    trebleFolderSheets.add(trebleMaterial.uniforms.detailFrequency, 'value', 0.1, 10).name('Detail Frequency');
    trebleFolderSheets.addColor({ color: trebleMaterial.uniforms.color.value.getHex() }, 'color').name('Color').onChange(function (value) {
        trebleMaterial.uniforms.color.value.setHex(value);
    });
    trebleFolderSheets.open();

    function toggleBassVisibility(value) {
        bassPlane.visible = value;
    }

    function toggleMidVisibility(value) {
        midShape.visible = value;
    }

    function toggleTrebleVisibility(value) {
        trebleShape.visible = value;
    }

    function updateBassGeometry() {
        const width = bassFolderSheets.__controllers[1].getValue();
        const height = bassFolderSheets.__controllers[2].getValue();
        const depth = bassFolderSheets.__controllers[3].getValue();
        const widthSegments = bassFolderSheets.__controllers[4].getValue();
        const heightSegments = bassFolderSheets.__controllers[5].getValue();
        sheetsScene.remove(bassPlane);
        bassGeometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, 1);
        bassPlane = new THREE.Mesh(bassGeometry, bassMaterial);
        bassPlane.visible = bassVisibility.visible;
        sheetsScene.add(bassPlane);
    }

    function updateMidGeometry() {
        const radiusController = midFolderSheets.__controllers.find(controller => controller.property === 'radius');
        const detailController = midFolderSheets.__controllers.find(controller => controller.property === 'detail');

        const radius = radiusController.getValue();
        let detail = detailController.getValue();

        // Round detail to the nearest integer
        detail = Math.round(detail);

        //console.log('Updating Mid Geometry:', { radius, detail });

        // Ensure the parameters are within acceptable bounds
        if (radius > 0 && radius < 100 && detail >= 0 && detail <= 4) {

                sheetsScene.remove(midShape);
                midGeometry = new THREE.IcosahedronGeometry(radius, detail);
                midShape = new THREE.Mesh(midGeometry, midMaterial);
                midShape.visible = midVisibility.visible;
                sheetsScene.add(midShape);
        }
    }


    function updateTrebleGeometry() {
        const radius = trebleFolderSheets.__controllers[1].getValue();
        const tube = trebleFolderSheets.__controllers[2].getValue();
        const radialSegments = trebleFolderSheets.__controllers[3].getValue();
        const tubularSegments = trebleFolderSheets.__controllers[4].getValue();
        sheetsScene.remove(trebleShape);
        trebleGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        trebleShape = new THREE.Mesh(trebleGeometry, trebleMaterial);
        trebleShape.visible = trebleVisibility.visible;
        sheetsScene.add(trebleShape);
    }

    function updateGUIVisibility() {
        if (currentScene === 'sphere') {
            guiSphere.domElement.style.display = 'block';
            guiSheets.domElement.style.display = 'none';
        } else {
            guiSphere.domElement.style.display = 'none';
            guiSheets.domElement.style.display = 'block';
        }
    }

    updateGUIVisibility();
}
