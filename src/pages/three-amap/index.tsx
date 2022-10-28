import React, { useEffect } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import * as THREE from "three";
import { CSS3DObject } from "@/lib/renderers/CSS3DRenderer";
import init from "./init";
import styles from "./index.less";

const { sceneCSS, scene3D, rendererCSS, renderer3D, camera, orbitControl } =
  init();

const ThreeAMapPage: React.FC = () => {
  // 自身div
  const divContainer = React.createRef<HTMLDivElement>();
  const divCSS = React.createRef<HTMLDivElement>();
  const div3D = React.createRef<HTMLDivElement>();

  // 动画ID
  let idAnimateFrame = 0;

  // 逐帧渲染
  const animate = () => {
    idAnimateFrame = requestAnimationFrame(animate);
    orbitControl.update();
    rendererCSS.render(sceneCSS, camera);
    renderer3D.render(scene3D, camera);
  };

  const addMapObject = () => {
    AMapLoader.load({
      key: "FUCK",
      version: "2.0",
      plugins: ["AMap.DistrictSearch"],
    })
      .then((AMap) => {
        const district = new AMap.DistrictSearch({
          subdistrict: 0,
          extensions: "all",
          level: "city",
        });
        district.search("江苏省", (_, result) => {
          console.log(result);
          const bounds = result.districtList[0].boundaries;
          const mask = [];
          for (let i = 0; i < bounds.length; i += 1) {
            mask.push([bounds[i]]);
          }

          const container = document.createElement("div");
          container.style.width = "1080px";
          container.style.height = "1080px";
          const map = new AMap.Map(container, {
            //设置地图容器id
            // viewMode: "3D", //是否为3D地图模式
            zoom: 7, //初始化地图级别
            center: [118.848792, 31.927729], //初始化地图中心点位置
            mask: mask,
            dragEnable: false,
            // zoomEnable: false,
            // mapStyle: "amap://styles/63b8025ee7ad92d28a357d15333e776c",
            layers: [
              new AMap.TileLayer.Satellite(),
              new AMap.TileLayer.RoadNet(),
            ],
          });

          const domObject = new CSS3DObject(container);
          sceneCSS.add(domObject);

          const maskMaterial = new THREE.MeshLambertMaterial({
            transparent: true,
            opacity: 0.1,
            color: "#000000",
            blending: THREE.NoBlending,
            side: THREE.DoubleSide,
          });
          const bodyMaterial = new THREE.MeshLambertMaterial({
            transparent: true,
            opacity: 0.5,
            color: "#000080",
          });
          for (let i = 0; i < bounds.length; i += 1) {
            const points = [];
            for (let j = 0; j < bounds[i].length; ++j) {
              const pixel = map.lngLatToContainer(bounds[i][j]);
              const pt = new THREE.Vector2(pixel.x, -pixel.y);
              points.push(pt);
            }
            const shape = new THREE.Shape(points);
            const geoMask = new THREE.ExtrudeGeometry(shape, {
              steps: 2,
              depth: 1,
              bevelEnabled: false,
            });
            const geoBody = new THREE.ExtrudeGeometry(shape, {
              steps: 2,
              depth: 50,
              bevelEnabled: false,
            });
            const meshMask = new THREE.Mesh(geoMask, maskMaterial);
            meshMask.position.copy(domObject.position);
            meshMask.rotation.copy(domObject.rotation);
            const meshBody = new THREE.Mesh(geoBody, bodyMaterial);
            meshBody.position.copy(domObject.position);
            meshBody.position.z -= 50;
            meshBody.rotation.copy(domObject.rotation);

            scene3D.add(meshMask);
            scene3D.add(meshBody);
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const add3DObject = () => {
    const geometry = new THREE.SphereGeometry(50, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0xeeee55,
      emissive: 0x000000,
      specular: 0x111111,
      side: THREE.DoubleSide,
      flatShading: false,
      shininess: 30,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.z = 0;
    sphere.castShadow = true;
    sphere.receiveShadow = false;
    sphere.position.set(0, 0, 100);
    scene3D.add(sphere);
  };

  useEffect(() => {
    if (!divContainer.current || !divCSS.current || !div3D.current) return;

    addMapObject();
    add3DObject();

    divCSS.current.appendChild(rendererCSS.domElement);
    div3D.current.appendChild(renderer3D.domElement);

    animate();
  }, [divContainer]);

  return (
    <div className={styles.root} ref={divContainer}>
      <div className={styles.css} ref={divCSS} />
      <div className={styles.three} ref={div3D} />
    </div>
  );
};

export default ThreeAMapPage;
