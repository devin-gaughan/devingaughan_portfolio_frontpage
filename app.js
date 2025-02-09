<<<<<<< Updated upstream
const translate = document.querySelectorAll(".translate");
const big_title = document.querySelector(".big-title");
const header = document.querySelector("header");
const shadow = document.querySelector(".shadow");
const shadow_down = document.querySelector(".shadow_down");
const content = document.querySelector(".content");
const section = document.querySelector("section");
const image_container = document.querySelector(".imgContainer");
const opacity = document.querySelectorAll(".opacity");
const logo = document.querySelector(".logo");
const bignavlist = document.querySelector(".bignavlist");
const border = document.querySelector(".border");

let header_height = header.offsetHeight;
let section_height = section.offsetHeight;

//Paralax Effect
window.addEventListener('scroll', () => {
    let scroll = window.pageYOffset;
    let sectionY = section.getBoundingClientRect();

    translate.forEach(element => {
        let speed = element.dataset.speed;
        element.style.transform = `translateY(${scroll * speed}px)`;
    });

    /*     opacity.forEach(element => {
        element.style.opacity = scroll / (sectionY.top + section_height);
        }) */

    big_title.style.opacity = - scroll / (header_height / 2) + 1;
    shadow.style.height = `${scroll * 0.5 + 300}px`;
    shadow_down.style.height = `${scroll * 0.1 + 10}px`;

    logo.style.opacity = - scroll / (header_height / 1.5) + 1;
    bignavlist.style.opacity = - scroll / (header_height / 1.5) + 1;

    /*  content.style.transform = `translateY(${scroll / (section_height + sectionY.top) * 50 - 50}px)`; */    
    /*  image_container.style.transform = `translateY(${scroll / (section_height + sectionY.top) * -50 + 50}px)`; */

    border.style.width = `${scroll / (sectionY.top + section_height) * 30}%`;
});



//Navigation Hamburger Menu
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.navlinks');
    const navLinks = document.querySelectorAll('.navlinks li');

//Toggles Nav
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

//Animates Links Slide In
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 5 + .50}s`;
            }
        });

//Burger Animation
        burger.classList.toggle('toggle');
    });
}



navSlide();
=======
// Import Three.js core and examples modules from the CDN
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.173.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/controls/OrbitControls.js';
import { Lensflare, LensflareElement } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/objects/Lensflare.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/loaders/DRACOLoader.js';
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/libs/dat.gui.module.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RGBShiftShader } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/shaders/RGBShiftShader.js';
import { GammaCorrectionShader } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/shaders/GammaCorrectionShader.js';
import { FilmPass } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/postprocessing/FilmPass.js';
import { FXAAShader } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/shaders/FXAAShader.js';
import { CopyShader } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/shaders/CopyShader.js';
import { AfterimagePass } from 'https://cdn.jsdelivr.net/npm/three@0.173.0/examples/jsm/postprocessing/AfterimagePass.js';

// -------------------------
// Scene Setup
// -------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 20, 50);
scene.add(camera);

// -------------------------
// Renderer Setup
// -------------------------
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('space-background'),
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// -------------------------
// Postprocessing Setup
// -------------------------
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
const filmPass = new FilmPass(0.35, 0.5, 2048, false);
const afterimagePass = new AfterimagePass();
const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
const copyShader = new ShaderPass(CopyShader);
copyShader.renderToScreen = true; // Final pass renders to screen

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(filmPass);
composer.addPass(afterimagePass);
composer.addPass(fxaaPass);
composer.addPass(copyShader);

// -------------------------
// Orbit Controls
// -------------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// -------------------------
// Resize Handler
// -------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
});

// -------------------------
// Starfield
// -------------------------
function createStarfield() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 10000;
  const starVertices = [];
  for (let i = 0; i < starsCount; i++) {
    const x = THREE.MathUtils.randFloatSpread(2000);
    const y = THREE.MathUtils.randFloatSpread(2000);
    const z = THREE.MathUtils.randFloatSpread(2000);
    starVertices.push(x, y, z);
  }
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
}
createStarfield();

// -------------------------
// Sun and Light Source
// -------------------------
const sunGeometry = new THREE.SphereGeometry(5, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: 0xffdd33,
  emissive: 0xffaa00,
  emissiveIntensity: 2
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.position.set(0, 0, 0);
sun.castShadow = true;
sun.receiveShadow = true;
scene.add(sun);

const light = new THREE.PointLight(0xffffff, 2, 500);
light.position.set(0, 0, 0);
scene.add(light);

// -------------------------
// Lensflare Effect
// -------------------------
const loader = new THREE.TextureLoader();
const lensflareTexture = loader.load('https://threejs.org/examples/textures/lensflare/lensflare0.png');
const lensflare = new Lensflare();
lensflare.addElement(new LensflareElement(lensflareTexture, 700, 0, new THREE.Color(0xffffff)));
sun.add(lensflare);

// -------------------------
// Planets
// -------------------------
const planetData = [
  { name: "Mercury", distance: 10, size: 0.5, color: 0xaaaaaa, speed: 0.02 },
  { name: "Venus",   distance: 15, size: 0.9, color: 0xffcc66, speed: 0.015 },
  { name: "Earth",   distance: 20, size: 1.0, color: 0x3399ff, speed: 0.01 },
  { name: "Mars",    distance: 25, size: 0.8, color: 0xff6633, speed: 0.008 },
  { name: "Jupiter", distance: 35, size: 1.5, color: 0xffaa33, speed: 0.005 },
  { name: "Saturn",  distance: 40, size: 1.2, color: 0xdddddd, speed: 0.003 },
  { name: "Uranus",  distance: 45, size: 0.9, color: 0x00ccff, speed: 0.002 },
  { name: "Neptune", distance: 50, size: 0.8, color: 0x0033ff, speed: 0.001 },
  { name: "Pluto",   distance: 55, size: 0.3, color: 0x999999, speed: 0.0005 }
];

const planetPivots = [];
planetData.forEach(({ distance, size, color, speed }) => {
  const pivot = new THREE.Object3D();
  scene.add(pivot);

  const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
  const planetMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  planet.castShadow = true;
  planet.receiveShadow = true;
  planet.position.x = distance;
  pivot.add(planet);

  pivot.rotationSpeed = speed;
  planetPivots.push(pivot);
});

// -------------------------
// Animation Toggle
// -------------------------
let isAnimating = true;
const toggleButton = document.getElementById('toggle-animation');
toggleButton.textContent = 'Pause Animation';
toggleButton.addEventListener('click', () => {
  isAnimating = !isAnimating;
  toggleButton.textContent = isAnimating ? 'Pause Animation' : 'Start Animation';
});

// -------------------------
// Animation Loop
// -------------------------
function animate() {
  if (isAnimating) {
    planetPivots.forEach(pivot => {
      pivot.rotation.y += pivot.rotationSpeed;
    });
  }
  controls.update();
  composer.render();
  requestAnimationFrame(animate);
}
animate();
>>>>>>> Stashed changes
