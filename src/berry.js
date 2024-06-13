import * as PIXI from "../pixi/pixi.mjs";
import Config from "./config.js";
import { getRandomInt } from "./supportFunction.js";

export default class Berry {
  constructor(app) {
    this.app = app;
    this.config = new Config();
    this.graphic = new PIXI.Graphics();
    this.app.stage.addChild(this.graphic);
    this.randomPosition();
  }

  draw() {
    this.graphic.clear();
    this.graphic.circle(
      this.x + this.config.sizeCell / 2,
      this.y + this.config.sizeCell / 2,
      this.config.sizeBerry
    );
    this.graphic.fill(0xa00034);
  }

  randomPosition() {
    this.x =
      getRandomInt(0, this.app.screen.width / this.config.sizeCell) *
      this.config.sizeCell;
    this.y =
      getRandomInt(0, this.app.screen.height / this.config.sizeCell) *
      this.config.sizeCell;
    	// this.draw();
  }

	hide() {
    this.graphic.visible = false;
  }

  show() {
    this.graphic.visible = true;
  }
}
