import { OrbitControls } from "@/lib/controls/OrbitControls";
import * as THREE from "three";

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
  scene.background = new THREE.Color(0xdddddd);
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
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  const directionalLight1 = new THREE.DirectionalLight(0xc0c0c0, 0.5);
  const directionalLight2 = new THREE.DirectionalLight(0xc0c0c0, 0.5);
  directionalLight1.position.set(1000, 1000, 1000);
  directionalLight2.position.set(-1000, -1000, -1000);
  directionalLight1.castShadow = true;
  directionalLight2.castShadow = true;
  const topLight = new THREE.DirectionalLight(0xffffff, 0.6);
  topLight.position.set(0, 10000000, 0);
  topLight.castShadow = true;
  const bottomLight = new THREE.DirectionalLight(0xffffff, 0.3);
  bottomLight.position.set(0, -5000000, 0);
  bottomLight.castShadow = true;

  scene.add(topLight);
  scene.add(bottomLight);
  scene.add(directionalLight1);
  scene.add(directionalLight2);
  scene.add(ambientLight);

  return { scene, renderer, camera, orbitControl };
};

export default init;
