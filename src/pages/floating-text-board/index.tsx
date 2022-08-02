import TWEEN from "@tweenjs/tween.js";
import React, { useEffect } from "react";
import * as THREE from "three";
import styles from "./index.css";
import init from "./init";

const { scene, camera, renderer, orbitControl } = init();

const FloatingBallPage: React.FC = () => {
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

  // 创造漂浮球
  const createFloatingBall = () => {
    const geo = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      color: "#ff0000",
    });
    const ball = new THREE.Mesh(geo, material);
    scene.add(ball);

    // 动画参数
    const paras = {
      y: 0,
    };
    const tween = new TWEEN.Tween(paras)
      .to(
        {
          y: 15,
        },
        2000
      )
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        ball.position.y = paras.y;
      })
      .yoyo(true)
      .repeat(Infinity);
    tween.start();
  };

  useEffect(() => {
    if (!divRef.current) return;

    renderer.setSize(divRef.current.clientWidth, divRef.current.clientHeight);
    animate();
    const canvas = divRef.current.appendChild(renderer.domElement);

    createFloatingBall();

    return () => {
      cancelAnimationFrame(idAnimateFrame);
      divRef.current?.removeChild(canvas);
    };
  }, [divRef]);

  return <div className={styles.root} ref={divRef} />;
};

export default FloatingBallPage;
