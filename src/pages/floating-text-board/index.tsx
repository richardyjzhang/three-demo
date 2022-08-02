import TWEEN from "@tweenjs/tween.js";
import React, { useEffect } from "react";
import * as THREE from "three";
import styles from "./index.css";
import init from "./init";

const { scene, camera, renderer, orbitControl } = init();

const FloatingTextBoardPage: React.FC = () => {
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

  // 创造漂浮展板
  const createFloatingTextBoard = () => {
    // canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.canvas.width = 256;
      ctx.canvas.height = 256;
      ctx.fillStyle = "rgba(255, 255, 255, 0)";
      ctx.fillRect(256, 256, 0, 0);
      ctx.fillStyle = "rgba(	70,130,180, 50)";
      ctx.beginPath();
      ctx.moveTo(28, 28);
      ctx.lineTo(228, 28);
      ctx.lineTo(128, 228);
      ctx.lineTo(28, 28);
      ctx.fill();
      ctx.font = "32px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText("FUCK", 128, 28);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
      map: texture,
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(10, 10, 1);
    scene.add(sprite);

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
        sprite.position.y = paras.y;
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

    createFloatingTextBoard();

    return () => {
      cancelAnimationFrame(idAnimateFrame);
      divRef.current?.removeChild(canvas);
    };
  }, [divRef]);

  return <div className={styles.root} ref={divRef} />;
};

export default FloatingTextBoardPage;
