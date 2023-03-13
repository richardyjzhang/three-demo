import React, { useEffect } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import styles from "./index.css";
import init from "./init";

const { scene, camera, renderer, orbitControl } = init();

const ObjUpload: React.FC = () => {
  // 自身div
  const divRef = React.createRef<HTMLDivElement>();

  // 动画ID
  let idAnimateFrame = 0;

  // 逐帧渲染
  const animate = () => {
    idAnimateFrame = requestAnimationFrame(animate);
    orbitControl.update();
    renderer.render(scene, camera);
  };

  // 清理已有模型
  const clearModel = () => {
    const group = scene.children.find((c) => c.name === "FUCK");
    if (group !== undefined) {
      scene.remove(group);
    }
  };

  const createModel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const matNormal = new THREE.MeshLambertMaterial({
        color: new THREE.Color("#98FB98"),
        opacity: 0.1,
        transparent: true,
      });
      const matError = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#FF0000"),
      });

      const result = evt.target?.result;
      if (typeof result === "string") {
        clearModel();

        const loader = new OBJLoader();
        const group = loader.parse(result);
        const newGroup = new THREE.Group();
        newGroup.name = "FUCK";
        scene.add(newGroup);
        group.children.forEach((c) => {
          if (c.name.endsWith("_")) {
            const mesh = new THREE.Mesh((c as THREE.Mesh).geometry, matError);
            newGroup.add(mesh);
          } else {
            const mesh = new THREE.Mesh((c as THREE.Mesh).geometry, matNormal);
            newGroup.add(mesh);
          }
        });
      }
    };
    reader.readAsText(file, "utf-8");
  };

  useEffect(() => {
    if (!divRef.current) return;

    renderer.setSize(divRef.current.clientWidth, divRef.current.clientHeight);
    animate();
    const canvas = divRef.current.appendChild(renderer.domElement);

    return () => {
      cancelAnimationFrame(idAnimateFrame);
      divRef.current?.removeChild(canvas);
    };
  }, [divRef]);

  const onFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    createModel(file);
  };

  return (
    <div>
      <div className={styles.root} ref={divRef} />
      <input
        type="file"
        className={styles.uploadButton}
        onChange={(ev) => {
          onFileChange(ev.target.files);
        }}
      />
    </div>
  );
};

export default ObjUpload;
