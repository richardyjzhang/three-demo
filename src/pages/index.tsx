import React from "react";
import { history } from "umi";
import img1 from "../public/screenshots/floating-text-board.png";
import img2 from "../public/screenshots/splicing-screen.png";
import img3 from "../public/screenshots/obj-texture.png";
import img4 from "../public/screenshots/three-amap.png";
import img5 from "../public/screenshots/obj-upload.png";
import img6 from "../public/screenshots/alpha-hash.png";
import styles from "./index.css";

interface ICardProps {
  description: string;
  address: string;
  img: string;
}

const Card: React.FC<ICardProps> = (props) => {
  return (
    <div
      className={styles.card}
      onClick={() => {
        history.push(props.address);
      }}
    >
      <div className={styles.imgWrapper}>
        <img className={styles.img} src={props.img} alt="" />
      </div>
      <div className={styles.description}>{props.description}</div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const demos: ICardProps[] = [
    {
      description: "使用精灵创建一个上下浮动的文字面板",
      address: "/floating-text-board",
      img: img1,
    },
    {
      description: "UV映射示例，将整个照片贴在多个Mesh上，组建拼接屏",
      address: "/splicing-screen",
      img: img2,
    },
    {
      description: "UV映射及材质分组示例，根据法相判断不同的材质",
      address: "/obj-texture",
      img: img3,
    },
    {
      description: "三维集成高德地图",
      address: "/three-amap",
      img: img4,
    },
    {
      description: "上传OBJ模型并加载渲染",
      address: "/obj-upload",
      img: img5,
    },
    {
      description: "使用AlphaHash模仿点云",
      address: "/alpha-hash",
      img: img6,
    },
  ];

  return (
    <div>
      <h2 className={styles.title}>Three.js Demo </h2>
      <div className={styles.row}>
        {demos.map((d) => (
          <Card {...d} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
