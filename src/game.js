import * as PIXI from "../pixi/pixi.mjs";

import GameLoop from "./gameLoop.js";
import Snake from "./snake.js";
import Score from "./score.js";
import Berry from "./berry.js";
import GUI from "./gui.js";

class Game {
  constructor() {
    this.initialize();
  }

  async initialize() {
		this.app = new PIXI.Application();
		await this.app.init({
      width: 600,
      height: 600,
      backgroundColor: 0x1099bb,
    })
    document.querySelector("#game-container").appendChild(this.app.canvas);

    this.gui = new GUI(this.app);
    this.snake = new Snake(this.app);
    this.berry = new Berry(this.app);
    this.score = new Score(this.app);
    this.app.stage.addChild(this.score.text);
    new GameLoop(this.update.bind(this), this.draw.bind(this));

    document.addEventListener("keydown", (e) => this.snake.control(e));

		this.isGameActive = false;
		this.showMenu();
  }
  
	showMenu() {
    this.isGameActive = false;
    this.gui.showMenu();
		this.berry.hide();
  }

	startGame() {
    this.isGameActive = true;
    this.gui.hideMenu();
		this.berry.show();
  }

	stopGame() {
    this.isGameActive = false;
    this.gui.showMenu();
		this.berry.hide();
  }

  update() {
    if (this.isGameActive) {
      this.snake.update(this.berry, this.score, this.app, this.gui.selectedMode);
      this.gui.updateBestScore(this.score.score);
    }
  }

  draw() {
    if (this.isGameActive) {
      this.snake.draw(this.app.stage);
    }
  }

	updateMode(mode) {
    this.snake.updateMode(mode);
  }
}

const game = new Game();
export default game;
