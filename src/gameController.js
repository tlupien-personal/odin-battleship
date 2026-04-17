import { Player } from "./player.js";
import { BoardView } from "./boardView.js";
import { GameBoard } from "./gameBoard.js";
import { Ship } from "./ship.js";

class GameController {
  constructor() {
    this.board1 = new GameBoard();
    this.board1.placeShip(0, 0, new Ship(3));
    this.player1 = new Player(this.board1);
    this.board1View = new BoardView(this.board1, "board-1");

    this.board2 = new GameBoard();
    this.player2 = new Player(this.board2);
    this.board2View = new BoardView(this.board2, "board-2");

    this.board1View.initializeBoard();
    this.board2View.initializeBoard();

    this.whoseTurn = this.player1;
    this.board1View.toggleShips();
  }
}

export { GameController };
