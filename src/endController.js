import { EndView } from "./endView.js";

class EndController {
  constructor(winner, loser, boardView, rematch, reset) {
    this.winner = winner;
    this.loser = loser;
    this.boardView = boardView;
    this.endView = new EndView(rematch, reset);
  }

  takeOverDisplay() {
    this.boardView.showShips(
      this.winner.board.id,
      this.winner.board.getAllShipCoords(),
    );
    this.boardView.showShips(
      this.loser.board.id,
      this.loser.board.getAllShipCoords(),
    );
    this.boardView.fade();
    this.endView.displayEndMessage(this.winner.board.id, true);
    this.endView.displayEndMessage(this.loser.board.id, false);
  }
}

export { EndController };
