import * as PIXI from "../pixi/pixi.mjs";
import Config from "./config.js";
import game from "./game.js";
import { getRandomInt } from "./supportFunction.js";

export default class Snake {
  constructor(app) {
    this.app = app;
    this.config = new Config();
    this.x = 160;
    this.y = 160;
    this.dx = this.config.sizeCell;
    this.dy = 0;
    this.tails = [];
		this.walls = [];
    this.maxTails = 3;

    this.graphics = new PIXI.Graphics();
    this.app.stage.addChild(this.graphics);

    this.speedMultiplier = 1;
  }

  update(berry, score, canvas, mode) {
    this.x += this.dx * this.speedMultiplier;
    this.y += this.dy * this.speedMultiplier;

    if (this.x < 0 || this.x >= this.app.screen.width || this.y < 0 || this.y >= this.app.screen.height) {
      this.death();
      score.setToZero();
      berry.randomPosition();
    }

    this.tails.unshift({ x: this.x, y: this.y });

    if (this.tails.length > this.maxTails) {
      this.tails.pop();
    }

    this.tails.forEach((el, index) => {
      if (el.x === berry.x && el.y === berry.y) {
        this.maxTails++;
        score.incScore();
        berry.randomPosition();

        if (mode === "Speed") {
          this.speedMultiplier *= 1.1;
        } else if (mode === "Walls") {
          this.addWall(berry.x, berry.y);
        } else if (mode === "Portal") {
          this.portalTeleport(berry);
        }
      }

      for (let i = index + 1; i < this.tails.length; i++) {
        if (el.x === this.tails[i].x && el.y === this.tails[i].y) {
          this.death();
          score.setToZero();
          berry.randomPosition();
        }
      }

      this.walls.forEach((wall) => {
        if (el.x === wall.x && el.y === wall.y) {
          this.death();
          score.setToZero();
          berry.randomPosition();
        }
      });
    });

    this.draw();
  }

  draw() {
    this.graphics.clear();

    this.tails.forEach((el, index) => {
      this.graphics.rect(
        el.x,
        el.y,
        this.config.sizeCell,
        this.config.sizeCell
      );
      this.graphics.fill(index === 0 ? 0xfa0556 : 0xa00034);
    });

		this.walls.forEach((wall) => {
			this.graphics.rect(wall.x, wall.y, this.config.sizeCell, this.config.sizeCell);
      this.graphics.fill(0x000000);
    });
  }

  death() {
    this.x = 160;
    this.y = 160;
    this.dx = this.config.sizeCell;
    this.dy = 0;
    this.tails = [];
		this.walls = [];
    this.maxTails = 3;
		this.speedMultiplier = 1;
		game.stopGame();
  }

  control(e) {
    if (e.code === "ArrowUp") {
      this.dy = -this.config.sizeCell;
      this.dx = 0;
    } else if (e.code === "ArrowLeft") {
      this.dx = -this.config.sizeCell;
      this.dy = 0;
    } else if (e.code === "ArrowDown") {
      this.dy = this.config.sizeCell;
      this.dx = 0;
    } else if (e.code === "ArrowRight") {
      this.dx = this.config.sizeCell;
      this.dy = 0;
    }
  }

	updateMode(mode) {
    if (mode === "Speed") {
      this.speedMultiplier = 1;
    }
  }

	addWall(x, y) {
    this.walls.push({ x: getRandomInt(0, 600), y: getRandomInt(0, 600) });
  }

  portalTeleport(berry) {
    const newX = berry.x;
    const newY = berry.y;
    berry.randomPosition();
    this.x = newX;
    this.y = newY;
  }
}
