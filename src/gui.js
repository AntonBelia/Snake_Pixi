import * as PIXI from "../pixi/pixi.mjs";
import game from "./game.js";

export default class GUI {
  constructor(app) {
    this.app = app;
    this.bestScore = 0;
    this.bestScoreText = new PIXI.Text({
      text: `Best Score: ${this.bestScore}`,
      style: { fontSize: 24, fill: "#fff" },
    });
    this.bestScoreText.position.set(10, 40);
    this.app.stage.addChild(this.bestScoreText);

    this.menuButton = new PIXI.Text({
      text: "Menu",
      style: { fontSize: 24, fill: "#fff" },
    });
    this.menuButton.position.set(500, 10);
    this.menuButton.interactive = true;
    this.menuButton.buttonMode = true;
    this.menuButton.on("pointerdown", this.showMenu.bind(this));
    this.app.stage.addChild(this.menuButton);

    this.menuContainer = new PIXI.Container();
    this.menuContainer.visible = true; 
    this.app.stage.addChild(this.menuContainer);

    this.playButton = new PIXI.Text({
      text: "Play",
      style: { fontSize: 24, fill: "#fff" },
    });
    this.playButton.position.set(260, 350);
    this.playButton.interactive = true;
    this.playButton.buttonMode = true;
    this.playButton.on("pointerdown", this.startGame.bind(this));
    this.menuContainer.addChild(this.playButton);

    this.exitButton = new PIXI.Text({
      text: "Exit",
      style: { fontSize: 24, fill: "#fff" },
    });
    this.exitButton.position.set(260, 390);
    this.exitButton.interactive = true;
    this.exitButton.buttonMode = true;
    this.exitButton.on("pointerdown", this.exitGame.bind(this));
    this.menuContainer.addChild(this.exitButton);

    this.modeText = new PIXI.Text({
      text: "Game Modes",
      style: { fontSize: 24, fill: "#fff" },
    });
    this.modeText.position.set(230, 100);
    this.menuContainer.addChild(this.modeText);

    this.modes = ["Classic", "Walls", "Portal", "Speed"];
    this.modeButtons = [];
    this.modes.forEach((mode, index) => {
      let modeButton = new PIXI.Text({
        text: mode,
        style: { fontSize: 24, fill: "#fff" },
      });
      modeButton.position.set(250, 140 + index * 30);
      modeButton.interactive = true;
      modeButton.buttonMode = true;
      modeButton.on("pointerdown", () => this.selectMode(mode));
      this.menuContainer.addChild(modeButton);
      this.modeButtons.push(modeButton);
    });

    this.selectedMode = "Classic";
  }

  showMenu() {
    this.menuContainer.visible = true;
		this.menuButton.visible = false;
  }

  hideMenu() {
    this.menuContainer.visible = false;
		this.menuButton.visible = true;
  }

	startGame() {
    this.hideMenu();
    game.startGame();
  }

  exitGame() {
    window.location.reload();
  }

  selectMode(mode) {
    this.selectedMode = mode;
    this.modeButtons.forEach((button) => (button.style.fill = "#fff"));
    this.modeButtons[this.modes.indexOf(mode)].style.fill = "#ff0000";

		game.updateMode(mode);
  }

  updateBestScore(score) {
    if (score > this.bestScore) {
      this.bestScore = score;
      this.bestScoreText.text = `Best Score: ${this.bestScore}`;
    }
  }
}