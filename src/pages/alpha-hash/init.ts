import { OrbitControls } from "@/lib/controls/OrbitControls";
import * as THREE from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

// 相机
const createCamera: () => THREE.PerspectiveCamera = () => {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100000
  );
  camera.position.set(-20, 100, 80);
  camera.up.set(0, 1, 0);
  return camera;
};

// OrbitControl
const createOrbitControls: (
  camera: THREE.Camera,
  renderer: THREE.Renderer
) => OrbitControls = (camera, renderer) => {
  const orbitControl = new OrbitControls(camera, renderer.domElement);
  orbitControl.enableZoom = true;
  orbitControl.enableDamping = true;
  orbitControl.enablePan = true;
  orbitControl.rotateSpeed = 0.5;
  orbitControl.dampingFactor = 0.1;
  orbitControl.maxDistance = 8000;
  orbitControl.minDistance = 10;
  return orbitControl;
};

export const init = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xbbbbbb);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  const camera = createCamera();
  const orbitControl = createOrbitControls(camera, renderer);

  // 坐标轴
  const axesHelper = new THREE.AxesHelper(10);
  scene.add(axesHelper);

  // 灯光
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  const directionalLight1 = new THREE.DirectionalLight(0xc0c0c0, 0.25);
  const directionalLight2 = new THREE.DirectionalLight(0xc0c0c0, 0.25);
  const directionalLight3 = new THREE.DirectionalLight(0xc0c0c0, 0.4);
  const directionalLight4 = new THREE.DirectionalLight(0xc0c0c0, 0.4);
  directionalLight1.position.set(-1000, 1000, 1000);
  directionalLight2.position.set(1000, 1000, -1000);
  directionalLight3.position.set(0, -200, 100);
  directionalLight4.position.set(0, -200, -100);
  directionalLight1.castShadow = true;
  directionalLight2.castShadow = true;
  directionalLight3.castShadow = true;
  directionalLight4.castShadow = true;
  scene.add(directionalLight1);
  scene.add(directionalLight2);
  scene.add(directionalLight3);
  scene.add(directionalLight4);
  scene.add(ambientLight);

  const sunlight = new THREE.DirectionalLight(0xffffff, 0.8);
  sunlight.castShadow = true;
  scene.add(sunlight);

  // 后处理
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  return { scene, renderer, composer, camera, orbitControl };
};

export default init;
