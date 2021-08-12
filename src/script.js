import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";
import imageSource from './img.png'
//debug

const gui = new dat.GUI();
const debugObject = {
  color: "#6B5B95",
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 });
  },
};
gui.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
});

gui.add(debugObject, "spin").name("rotate in y");
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
//

const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 3, 3, 3);

const material = new THREE.MeshBasicMaterial({
  color: debugObject.color,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//debug
gui.add(mesh.position, "x").min(-3).max(3).step(0.01).name("left/right");
gui.add(mesh.position, "y", -3, 3, 0.01).name("elevation");
gui.add(mesh.position, "z", -3, 3, 0.01).name("profundity");

gui.add(mesh, "visible").name("cube displayed");
gui.add(material, "wireframe");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //update renderer

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  //we pu it on resize in case user use a different monitor if user has many screens
  //setting a limit on the pixel ratio to avoid using excesive gpu power
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */

//axes helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
