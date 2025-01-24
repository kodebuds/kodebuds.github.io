let scene, camera, renderer, particles;
let mouseX = 0;
let mouseY = 0;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('bg'),
        alpha: true 
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Create main particles
    particles = createParticleSystem(2000, 0.005, '#4169E1', 5);
    scene.add(particles);
    
    // Add secondary particle system
    const secondaryParticles = createParticleSystem(1000, 0.003, '#8A2BE2', 3);
    scene.add(secondaryParticles);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    camera.position.z = 2;

    // Mouse move event listener
    document.addEventListener('mousemove', onMouseMove);
}

function createParticleSystem(count, size, color, spread) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color(color);
    
    for(let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * spread;
        positions[i + 1] = (Math.random() - 0.5) * spread;
        positions[i + 2] = (Math.random() - 0.5) * spread;
        
        color1.toArray(colors, i);
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: size,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,    // Increased from 0.8
    });
    
    return new THREE.Points(geometry, material);
}

function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate based on mouse position
    particles.rotation.y += 0.0005 + mouseX * 0.0001;
    particles.rotation.x += 0.0002 + mouseY * 0.0001;
    
    // Wave effect
    const time = Date.now() * 0.0005;
    particles.geometry.attributes.position.array.forEach((value, i) => {
        if (i % 3 === 1) { // Y coordinate
            particles.geometry.attributes.position.array[i] += Math.sin(time + i) * 0.0015;
        }
    });
    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

init();
animate();
