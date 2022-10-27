import { Object3D, Scene, Camera } from "three";

export class CSS3DObject extends Object3D {
  constructor(element: HTMLDivElement);
}

export class CSS3DRenderer {
  constructor(parameters: {});

  domElement: HTMLCanvasElement;

  setSize(width: number, height: number): void;

  render(scene: Scene, camera: Camera): void;
}
