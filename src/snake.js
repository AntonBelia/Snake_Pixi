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

  update(berry1, berry2, score, canvas, mode) {
		let steps = Math.ceil(this.speedMultiplier);
		for (let step = 0; step < steps; step++) {
			this.x += this.dx;
			this.y += this.dy;
	
			if (mode === "No die") {
				if (this.x < 0) {
					this.x = this.app.screen.width - this.config.sizeCell;
				} else if (this.x >= this.app.screen.width) {
					this.x = 0;
				}
				if (this.y < 0) {
					this.y = this.app.screen.height - this.config.sizeCell;
				} else if (this.y >= this.app.screen.height) {
					this.y = 0;
				}
			} else if (mode !== "Portal") {
				if (this.x < 0 || this.x >= this.app.screen.width || this.y < 0 || this.y >= this.app.screen.height) {
					this.death();
					score.setToZero();
					berry1.randomPosition();
					berry2.randomPosition();
					return;
				}
			}
	
			this.tails.unshift({ x: this.x, y: this.y });
	
			if (this.tails.length > this.maxTails) {
				this.tails.pop();
			}
	
			let ateBerry = false;
			this.tails.forEach((el, index) => {
				if ((el.x === berry1.x && el.y === berry1.y) || (el.x === berry2.x && el.y === berry2.y)) {
					ateBerry = true;
					this.maxTails++;
					score.incScore();
	
					if (mode === "Speed") {
						this.speedMultiplier *= 1.1;
					} else if (mode === "Walls") {
						this.addWall(el.x, el.y);
					}
				}

				if (mode === "Portal" && ((el.x === berry1.x && el.y === berry1.y) || (el.x === berry2.x && el.y === berry2.y))) {
					ateBerry = true;
					this.maxTails++;
					score.incScore();
					this.portalTeleport(berry1, berry2);
				} else {
					if (el.x === berry1.x && el.y === berry1.y) {
						ateBerry = true;
						this.maxTails++;
						score.incScore();
						berry1.randomPosition();
					} else if (el.x === berry2.x && el.y === berry2.y) {
						ateBerry = true;
						this.maxTails++;
						score.incScore();
						berry2.randomPosition();
					}
				}
	
				for (let i = index + 1; i < this.tails.length; i++) {
					if (el.x === this.tails[i].x && el.y === this.tails[i].y) {
						if (mode !== "No die") {
							this.death();
							score.setToZero();
							berry1.randomPosition();
							berry2.randomPosition();
							return;
						}
					}
				}
	
				this.walls.forEach((wall) => {
					if (el.x === wall.x && el.y === wall.y) {
						this.death();
						score.setToZero();
						berry1.randomPosition();
						berry2.randomPosition();
						return;
					}
				});
			});
	
			if (!ateBerry) {
				berry1.draw();
				berry2.draw();
			}
		}
	
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
      this.graphics.rect(
        wall.x,
        wall.y,
        this.config.sizeCell,
        this.config.sizeCell
      );
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
		let newX, newY;
		do {
			newX = getRandomInt(0, this.app.screen.width / this.config.sizeCell) * this.config.sizeCell;
			newY = getRandomInt(0, this.app.screen.height / this.config.sizeCell) * this.config.sizeCell;
		} while (this.tails.some(tail => tail.x === newX && tail.y === newY) || (this.x === newX && this.y === newY));
	
		this.walls.push({ x: newX, y: newY });
	}

  portalTeleport(berry1, berry2) {
		if (this.x === berry1.x && this.y === berry1.y) {
			this.x = berry2.x;
			this.y = berry2.y;
		} else if (this.x === berry2.x && this.y === berry2.y) {
			this.x = berry1.x;
			this.y = berry1.y;
		}
	
		berry1.randomPosition();
		berry2.randomPosition();
	}
}
