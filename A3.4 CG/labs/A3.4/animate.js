function animate() {
    requestAnimationFrame(animate);

    if (analyser) {
        analyser.getByteFrequencyData(dataArray);

        // Calculate the average audio data value
        let bassSum = 0;
        let midSum = 0;
        let trebleSum = 0;
        for (let i = 0; i < bufferLength; i++) {
            if (i < bufferLength / 3) {
                bassSum += dataArray[i];
            } else if (i < 2 * bufferLength / 3) {
                midSum += dataArray[i];
            } else {
                trebleSum += dataArray[i];
            }
        }
        const bassAverage = bassSum / (bufferLength / 3);
        const midAverage = midSum / (bufferLength / 3);
        const trebleAverage = trebleSum / (bufferLength / 3);

        // Normalise the average values and pass them to the shaders
        sphereMaterial.uniforms.audioData.value = bassAverage / 128.0;
        bassMaterial.uniforms.audioData.value = bassAverage / 128.0;
        midMaterial.uniforms.audioData.value = midAverage / 128.0;
        trebleMaterial.uniforms.audioData.value = trebleAverage / 128.0;
    }

    const currentTime = performance.now() * 0.001;
    sphereMaterial.uniforms.time.value = currentTime;
    bassMaterial.uniforms.time.value = currentTime;
    midMaterial.uniforms.time.value = currentTime;
    trebleMaterial.uniforms.time.value = currentTime;

    controls.update();
    renderer.render(currentScene === 'sphere' ? sphereScene : sheetsScene, camera);
}