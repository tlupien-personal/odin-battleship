import { EndView } from "./endView.js";

class EndController {
  constructor(winner, loser, boardView, rematch, reset) {
    this.winner = winner;
    this.loser = loser;
    this.view = new EndView(boardView, rematch, reset);
  }

  takeOverDisplay() {
    this.view.displayEndMessage(this.winner, true);
    this.view.displayEndMessage(this.loser, false);
  }
}

export { EndController };
