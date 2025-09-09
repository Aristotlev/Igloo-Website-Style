// main.js
// Import Three.js and GSAP from CDN for demo purposes
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';

// --- Three.js Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Igloo/Ice Geometry (simple sphere for demo) ---
const geometry = new THREE.SphereGeometry(2, 32, 32);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x99dfff,
  roughness: 0.2,
  transmission: 0.8,
  thickness: 1.2,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  metalness: 0.1,
  reflectivity: 0.5
});
const igloo = new THREE.Mesh(geometry, material);
scene.add(igloo);

camera.position.set(0, 0, 7);

// --- Particles ---
const particles = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 })
);
const particleCount = 500;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 8;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
}
particles.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
scene.add(particles);

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);
  igloo.rotation.y += 0.003;
  particles.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();

// --- Responsive ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- GSAP Scroll Animations ---
function sectionIn(id) {
  gsap.to('.section', { opacity: 0.2, duration: 0.5 });
  gsap.to(`#${id}`, { opacity: 1, duration: 0.7 });
}

function onScroll() {
  const y = window.scrollY;
  const h = window.innerHeight;
  if (y < h * 0.5) {
    sectionIn('hero');
    gsap.to(igloo.position, { z: 0, duration: 1 });
    gsap.to(particles.material, { opacity: 0, duration: 1 });
  } else if (y < h * 1.5) {
    sectionIn('mid');
    gsap.to(igloo.position, { z: -5, duration: 1 });
    gsap.to(particles.material, { opacity: 0, duration: 1 });
  } else {
    sectionIn('particles');
    gsap.to(igloo.position, { z: -10, duration: 1 });
    gsap.to(particles.material, { opacity: 1, duration: 1 });
  }
}
window.addEventListener('scroll', onScroll);

// --- Interactive Particles ---
renderer.domElement.addEventListener('pointermove', (e) => {
  if (window.scrollY < window.innerHeight * 2) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = -(e.clientY / window.innerHeight - 0.5) * 2;
  particles.rotation.x = y * 0.5;
  particles.rotation.y = x * 0.5;
});

// --- Initial State ---
sectionIn('hero');
gsap.set(particles.material, { opacity: 0 });
