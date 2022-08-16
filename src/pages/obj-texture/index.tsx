import TWEEN from "@tweenjs/tween.js";
import React, { useEffect } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
// thanks qianjia for modeling TTT
import model from "../../public/model.obj";
// https://www.pexels.com/zh-cn/photo/457881/
import img1 from "../../public/pexels-asad-photo-maldives-457881.jpg";
// https://www.pexels.com/zh-cn/photo/a-2662116/
import img2 from "../../public/pexels-jaime-reimer-2662116.jpg";

import styles from "./index.css";
import init from "./init";

const { scene, camera, renderer, orbitControl } = init();

const ObjTexture: React.FC = () => {
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

  const calcGeometry = (
    geo: THREE.BufferGeometry,
    minX: number,
    minZ: number,
    xDelta: number,
    zDelta: number
  ) => {
    // 原始点坐标
    const positions = geo.getAttribute("position").array;

    // 加上坐标偏移
    const uvs: number[] = [];

    const vecPY = new THREE.Vector3(0, 1, 0);
    const vecNY = new THREE.Vector3(0, -1, 0);

    // 计算法向用
    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();

    // 每3点计算UV及分组
    for (let i = 0; i < positions.length; i += 9) {
      const pos1 = new THREE.Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]
      );
      const pos2 = new THREE.Vector3(
        positions[i + 3],
        positions[i + 4],
        positions[i + 5]
      );
      const pos3 = new THREE.Vector3(
        positions[i + 6],
        positions[i + 7],
        positions[i + 8]
      );

      cb.subVectors(pos3, pos2);
      ab.subVectors(pos1, pos2);
      cb.cross(ab);
      cb.normalize();

      // UV映射计算
      if (cb.equals(vecPY)) {
        // +Y方向
        uvs.push((pos1.z - minZ) / zDelta);
        uvs.push((pos1.x - minX) / xDelta);
        uvs.push((pos2.z - minZ) / zDelta);
        uvs.push((pos2.x - minX) / xDelta);
        uvs.push((pos3.z - minZ) / zDelta);
        uvs.push((pos3.x - minX) / xDelta);

        geo.addGroup(i / 3, 3, 1);
      } else if (cb.equals(vecNY)) {
        // -Y方向
        uvs.push((pos1.z - minZ) / zDelta);
        uvs.push((pos1.x - minX) / xDelta);
        uvs.push((pos2.z - minZ) / zDelta);
        uvs.push((pos2.x - minX) / xDelta);
        uvs.push((pos3.z - minZ) / zDelta);
        uvs.push((pos3.x - minX) / xDelta);

        geo.addGroup(i / 3, 3, 2);
      } else {
        // OTHERS
        uvs.push(0);
        uvs.push(0);
        uvs.push(0);
        uvs.push(0);
        uvs.push(0);
        uvs.push(0);

        geo.addGroup(i / 3, 3, 0);
      }
    }

    // 设置新UV
    const attrUV = new THREE.Float32BufferAttribute(uvs, 2);
    geo.setAttribute("uv", attrUV);
  };

  const createModel = () => {
    const material0 = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FF0000"),
      side: THREE.DoubleSide,
    });
    const material1 = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(img1),
    });
    const material2 = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(img2),
    });
    0;
    const materials = [material0, material1, material2];

    const loader = new OBJLoader();
    loader.load(model, (obj) => {
      // 计算包围盒
      const box = new THREE.Box3();
      box.expandByObject(obj);
      const xDelta = box.max.x - box.min.x;
      const zDelta = box.max.z - box.min.z;

      // 对OBJ中的Mesh依次进行处理，计算UV并进行材质分组
      obj.children.forEach((c) => {
        if (!(c instanceof THREE.Mesh)) return;
        const geo = c.geometry as THREE.BufferGeometry;

        calcGeometry(geo, box.min.x, box.min.z, xDelta, zDelta);

        const mesh = new THREE.Mesh(geo, materials);
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

export default ObjTexture;
