import { OrbitControls } from "@/lib/controls/OrbitControls";
import { CSS3DRenderer } from "@/lib/renderers/CSS3DRenderer";
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
  const sceneCSS = new THREE.Scene();
  const scene3D = new THREE.Scene();
  scene3D.background = new THREE.Color(0xffffff);

  const renderer3D = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer3D.setSize(window.innerWidth, window.innerHeight);
  renderer3D.setClearColor(0x000000, 0);
  renderer3D.shadowMap.enabled = true;
  renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;

  const rendererCSS = new CSS3DRenderer({});
  rendererCSS.setSize(window.innerWidth, window.innerHeight);
  rendererCSS.domElement.style.position = "absolute";
  rendererCSS.domElement.style.top = "0px";

  const camera = createCamera();
  const orbitControl = new OrbitControls(camera, renderer3D.domElement);
  // orbitControl.enableZoom = false;

  // 光
  const ambientLight = new THREE.AmbientLight(0x000000);
  scene3D.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 0);
  pointLight.castShadow = true;
  pointLight.position.z = 300;
  pointLight.shadow.mapSize.width = 256; // default
  pointLight.shadow.mapSize.height = 256; // default
  pointLight.shadow.camera.near = 1; // default
  pointLight.shadow.camera.far = 2000; // default
  scene3D.add(pointLight);

  return {
    sceneCSS,
    scene3D,
    rendererCSS,
    renderer3D,
    camera,
    orbitControl,
  };
};

export default init;
