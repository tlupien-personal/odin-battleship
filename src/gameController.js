import { Player } from "./player.js";
import { BoardView } from "./boardView.js";
import { GameBoard } from "./gameBoard.js";
import { Ship } from "./ship.js";
import { ComputerMoveSource } from "./computerMoveSource.js";

class GameController {
  constructor() {
    // default case is human vs computer, others will come later
    // also this is basically testing code at this point...

    this.player1 = new Player(new GameBoard("player-1"), true);
    this.player2 = new Player(new GameBoard("player-2"), false);
    this.computer = new ComputerMoveSource(this.player1.board, "random");
    // probably not right ^
    this.player1.board.placeShip(0, 0, new Ship(3, false));
    this.player2.board.placeShip(0, 0, new Ship(3, false));

    this.view = new BoardView();

    this.view.initializeBoard(this.player1.board, () => {});
    this.view.toggleShips(this.player1.board);
    this.view.initializeBoard(this.player2.board, (e) => this.#doHumanTurn(e));

    this.attacker = this.player1;
    this.defender = this.player2;
    this.gameOver = false;
  }

  #doComputerMove() {
    let computerMoveResult = false;
    let move;
    while (!computerMoveResult) {
      move = this.computer.generateMove();
      computerMoveResult = this.attacker.sendAttack(
        this.defender,
        move[0],
        move[1],
      );
    }
    this.view.updateSquare(this.defender.board, move[0], move[1]);
  }

  #passTurn() {
    const temp = this.defender;
    this.defender = this.attacker;
    this.attacker = temp;
    if (!this.attacker.isHuman) {
      this.#doComputerTurn();
    }
  }

  #updateSunk() {
    for (const c of this.defender.board.getAllShipCoords()) {
      this.view.updateSquare(this.defender.board, c[0], c[1]);
    }
  }

  #isGameOver() {
    const gameOver = this.defender.board.checkSinkage();
    this.#updateSunk();
    return gameOver;
  }

  #doHumanTurn(e) {
    if (this.gameOver) {
      return;
    }
    const square = e.target;
    if (this.attacker.board.id === square.getAttribute("data-board-id")) {
      return;
    }
    const row = square.getAttribute("data-row");
    const col = square.getAttribute("data-col");
    const moveResult = this.attacker.sendAttack(this.defender, row, col);
    if (!moveResult) {
      return;
    }
    this.view.updateSquare(this.defender.board, row, col);
    this.gameOver = this.#isGameOver();
    this.#passTurn();
  }

  #doComputerTurn() {
    if (this.gameOver) {
      return;
    }
    this.#doComputerMove();
    this.gameOver = this.#isGameOver();
    this.#passTurn();
  }
}

export { GameController };
