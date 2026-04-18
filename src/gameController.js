import { Player } from "./player.js";
import { BoardView } from "./boardView.js";
import { GameBoard } from "./gameBoard.js";
import { Ship } from "./ship.js";
import { ComputerMoveSource } from "./computerMoveSource.js";

class GameController {
  constructor() {
    // default case is human vs computer, others will come later
    // also this is basically testing code at this point...

    this.player1 = new Player(new GameBoard(), 1, true);
    this.player2 = new Player(new GameBoard(), 2, false);
    this.computer = new ComputerMoveSource(this.player1.board, "random");
    this.player2.board.placeShip(0, 0, new Ship(3, false));

    this.views = {
      1: new BoardView(this.player1.board, `board-1`, () => {}),
      2: new BoardView(
        this.player2.board,
        `board-2`,
        this.#makeTurnFunction(this.player1, this.player2),
      ),
    };

    this.views[1].initializeBoard();
    this.views[2].initializeBoard();

    this.whoseTurn = this.player1;
  }

  #makeTurnFunction(player, opp) {
    return (e) => {
      if (this.whoseTurn !== player) {
        return;
      } else {
        const row = e.target.getAttribute("data-row");
        const col = e.target.getAttribute("data-col");
        const moveResult = player.sendAttack(opp, row, col);
        if (moveResult) {
          this.views[opp.id].updateSquare(row, col);
          this.whoseTurn = opp;
          if (!opp.isHuman) {
            let computerMoveResult = false;
            let move;
            while (!computerMoveResult) {
              move = this.computer.generateMove();
              computerMoveResult = opp.sendAttack(player, move[0], move[1]);
            }
            this.views[player.id].updateSquare(move[0], move[1]);
            this.whoseTurn = player;
          }
        }
      }
    };
  }
}

export { GameController };
