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

  // 地图
  let map;
  let bounds = [];
  let domObject: THREE.Object3D | undefined;

  // 逐帧渲染
  const animate = () => {
    idAnimateFrame = requestAnimationFrame(animate);
    orbitControl.update();
    rendererCSS.render(sceneCSS, camera);
    renderer3D.render(scene3D, camera);
  };

  // 添加掩模
  const addMaskObject = () => {
    if (domObject === undefined) return;

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
      meshMask.name = "MESHMASK";
      const meshBody = new THREE.Mesh(geoBody, bodyMaterial);
      meshBody.position.copy(domObject.position);
      meshBody.position.z -= 50;
      meshBody.rotation.copy(domObject.rotation);

      const last = scene3D.children.find((c) => c.name === "MESHMASK");
      if (last !== undefined) scene3D.remove(last);
      scene3D.add(meshMask);
      scene3D.add(meshBody);
    }
  };

  const addMapObject = () => {
    AMapLoader.load({
      key: "FUCKYOU",
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
          bounds = result.districtList[0].boundaries;
          const mask = [];
          for (let i = 0; i < bounds.length; i += 1) {
            mask.push([bounds[i]]);
          }

          const container = document.createElement("div");
          container.style.width = "1080px";
          container.style.height = "1080px";
          map = new AMap.Map(container, {
            //设置地图容器id
            // viewMode: "3D", //是否为3D地图模式
            zoom: 7, //初始化地图级别
            center: [118.848792, 31.927729], //初始化地图中心点位置
            mask: mask,
            dragEnable: false,
            // zoomEnable: false,
            layers: [
              new AMap.TileLayer.Satellite(),
              new AMap.TileLayer.RoadNet(),
            ],
          });

          domObject = new CSS3DObject(container);
          sceneCSS.add(domObject);

          addMaskObject();
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const add3DObject = () => {
    const geometry = new THREE.SphereGeometry(25, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0x336699,
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

  const onZoom = (ev: WheelEvent) => {
    if (ev.wheelDelta && map) {
      const zoom = map.getZoom();
      if (ev.wheelDelta > 0) {
        // 向上滚动，拉进
        map.setZoom(zoom + 1, true);
      } else {
        // 向下滚动，拉远
        map.setZoom(zoom - 1, true);
      }
      // addMaskObject();
    }
  };

  useEffect(() => {
    if (!divContainer.current || !divCSS.current || !div3D.current) return;

    addMapObject();
    add3DObject();

    divCSS.current.appendChild(rendererCSS.domElement);
    div3D.current.appendChild(renderer3D.domElement);

    animate();

    window.addEventListener("wheel", onZoom);

    return () => {
      window.cancelAnimationFrame(idAnimateFrame);
      window.removeEventListener("wheel", onZoom);
    };
  }, [divContainer]);

  return (
    <div className={styles.root} ref={divContainer}>
      <div className={styles.css} ref={divCSS} />
      <div className={styles.three} ref={div3D} />
    </div>
  );
};

export default ThreeAMapPage;
