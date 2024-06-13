import * as PIXI from "../pixi/pixi.mjs";

export default class Score {
  constructor(app) {
    this.app = app;
    this.score = 0;
    this.text = new PIXI.Text({
      text: "Score: 0",
      style: { fontSize: 24, fill: "#fff" },
    });
    this.text.position.set(10, 10);
  }

  incScore() {
    this.score++;
    this.draw();
  }

  setToZero() {
    this.score = 0;
    this.draw();
  }

  draw() {
    this.text.text = `Score: ${this.score}`;
  }
}
