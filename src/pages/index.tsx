import React from "react";
import { Link } from "umi";

interface ICardProps {
  description: string;
  address: string;
  img: string;
}

const Card: React.FC<ICardProps> = (props) => {
  return (
    <div>
      <Link to={props.address}>
        <div>{props.description}</div>
      </Link>
    </div>
  );
};

const HomePage: React.FC = () => {
  const demos: ICardProps[] = [
    {
      description: "使用精灵创建一个上下浮动的文字面板",
      address: "floating-text-board",
      img: "",
    },
    {
      description: "UV映射示例，将整个照片贴在多个Mesh上，组建拼接屏",
      address: "splicing-screen",
      img: "",
    },
    {
      description: "UV映射及材质分组示例，根据法相判断不同的材质",
      address: "obj-texture",
      img: "",
    },
  ];

  return (
    <div>
      {demos.map((d) => (
        <Card {...d} />
      ))}
    </div>
  );
};

export default HomePage;
