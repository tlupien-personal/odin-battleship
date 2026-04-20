import { Player } from "./player.js";
import { GameBoard } from "./gameBoard.js";
import { SetupView } from "./setupView.js";

class SetupController {
  constructor(advance) {
    this.view = new SetupView({
      left: (e) => this.#handleForm(e, "left"),
      right: (e) => this.#handleForm(e, "right"),
    });
    this.advance = advance;
    this.players = {};
  }

  #handleForm(e, id) {
    e.preventDefault();
    const form = document.querySelector("#" + id + "-form");
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const board = new GameBoard(id + "-board");
    let isHuman;
    if (data.isHuman) {
      isHuman = true;
    } else {
      isHuman = false;
    }
    const player = new Player(board, isHuman, data.computerStrategy);
    this.players[id] = player;
    this.view.hideForm(id);
    if (Object.entries(this.players).length == 2) {
      this.advance();
    }
  }

  takeOverDisplay() {
    this.view.showForm("left");
    this.view.showForm("right");
  }
}

export { SetupController };
