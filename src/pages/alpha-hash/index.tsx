import React, { useEffect } from "react";
import * as THREE from "three";
import init from "./init";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import model from "../../public/model.obj";
import styles from "./index.css";

const { scene, renderer, composer, orbitControl } = init();

const AlphaHashPage: React.FC = () => {
  // 自身div
  const divRef = React.createRef<HTMLDivElement>();

  // 动画ID
  let idAnimateFrame = 0;

  // 逐帧渲染
  const animate = () => {
    idAnimateFrame = requestAnimationFrame(animate);
    orbitControl.update();
    // renderer.render(scene, camera);
    composer.render();
  };

  const createModel = () => {
    const loader = new OBJLoader();
    loader.load(model, (obj) => {
      const mat = new THREE.MeshStandardMaterial({
        color: "#00FF00",
        transparent: false,
        opacity: 0.8,
      });
      mat.depthWrite = true;
      mat.alphaHash = true;

      obj.children.forEach((c) => {
        if (!(c instanceof THREE.Mesh)) return;

        const geo = c.geometry;
        const mesh = new THREE.Mesh(geo, mat);
        scene.add(mesh);
      });
    });
  };

  useEffect(() => {
    if (!divRef.current) return;

    renderer.setSize(divRef.current.clientWidth, divRef.current.clientHeight);
    animate();
    const canvas = divRef.current.appendChild(renderer.domElement);

    createModel();

    return () => {
      cancelAnimationFrame(idAnimateFrame);
      divRef.current?.removeChild(canvas);
    };
  }, [divRef]);

  return <div className={styles.root} ref={divRef} />;
};

export default AlphaHashPage;
