import TWEEN from "@tweenjs/tween.js";
import React, { useEffect } from "react";
import * as THREE from "three";
// https://www.pexels.com/zh-cn/photo/a-2662116/
import img from "../../public/pexels-jaime-reimer-2662116.jpg";
import styles from "./index.css";
import init from "./init";

const { scene, camera, renderer, orbitControl } = init();

const SplicingScreenPage: React.FC = () => {
  // 自身div
  const divRef = React.createRef<HTMLDivElement>();

  // 动画ID
  let idAnimateFrame = 0;

  // 逐帧渲染
  const animate = () => {
    idAnimateFrame = requestAnimationFrame(animate);
    orbitControl.update();
    TWEEN.update();
    renderer.render(scene, camera);
  };

  const changeUV = (
    geo: THREE.BufferGeometry,
    xUnit: number,
    yUnit: number,
    xOffset: number,
    yOffset: number,
    scale: number
  ) => {
    // 原始UV
    const oriUvs = geo.getAttribute("uv").array;

    // 加上坐标偏移
    const uvs: number[] = [];
    for (let i = 0; i < oriUvs.length; i += 2) {
      uvs.push((oriUvs[i] * scale + xOffset) * xUnit);
      uvs.push((oriUvs[i + 1] * scale + yOffset) * yUnit);
    }

    // 设置新UV
    const attr = new THREE.Float32BufferAttribute(uvs, 2);
    geo.setAttribute("uv", attr);
  };

  // 创建电视墙
  const createSplicingWall = () => {
    const xCount = 16;
    const yCount = 9;

    const xUnit = 1 / xCount;
    const yUnit = 1 / yCount;

    const xSize = 1920 / xCount;
    const ySize = 1080 / yCount;

    const scale = 0.95;

    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(img),
    });

    for (let i = 0; i < xCount; i += 1) {
      for (let j = 0; j < yCount; j += 1) {
        const geo = new THREE.PlaneGeometry(xSize * scale, ySize * scale);
        changeUV(geo, xUnit, yUnit, i, j, scale);

        const mesh = new THREE.Mesh(geo, material);
        mesh.position.x = (i - xCount / 2) * xSize;
        mesh.position.y = (j - yCount / 2) * ySize;
        mesh.position.z = 0;

        scene.add(mesh);
      }
    }
  };

  useEffect(() => {
    if (!divRef.current) return;

    renderer.setSize(divRef.current.clientWidth, divRef.current.clientHeight);
    animate();
    const canvas = divRef.current.appendChild(renderer.domElement);

    createSplicingWall();

    return () => {
      cancelAnimationFrame(idAnimateFrame);
      divRef.current?.removeChild(canvas);
    };
  }, [divRef]);

  return <div className={styles.root} ref={divRef} />;
};

export default SplicingScreenPage;
