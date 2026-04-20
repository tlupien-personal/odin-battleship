class GameController {
  constructor(boardView, left, right, advance) {
    this.attacker = left;
    this.defender = right;
    this.advance = advance;
    this.gameOver = false;
    this.view = boardView;
  }

  #doComputerMove() {
    const move = this.attacker.computerAttack(this.defender);
    this.view.updateSquare(this.defender.board, move[0], move[1]);
  }

  #passTurn() {
    if (this.gameOver) {
      return;
    }
    const temp = this.defender;
    this.defender = this.attacker;
    this.attacker = temp;
    this.view.hideShips(this.defender.board);
    this.view.showShips(this.attacker.board);
    if (!this.attacker.isHuman) {
      this.doComputerTurn();
    }
  }

  #updateSunk() {
    for (const c of this.defender.board.getAllShipCoords()) {
      this.view.updateSquare(this.defender.board, c[0], c[1]);
    }
  }

  #isGameOver() {
    this.gameOver = this.defender.board.checkSinkage();
    this.#updateSunk();
    if (this.gameOver) {
      this.advance();
    }
  }

  doHumanTurn(e) {
    if (this.gameOver) {
      // ideally, this should just no longer be called at all
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
    this.#isGameOver();
    this.#passTurn();
  }

  doComputerTurn() {
    if (this.gameOver) {
      return;
    }
    this.#doComputerMove();
    this.#isGameOver();
    this.#passTurn();
  }

  takeOverDisplay() {
    this.view.initializeBoard(this.attacker.board, (e) => this.doHumanTurn(e));
    this.view.initializeBoard(this.defender.board, (e) => this.doHumanTurn(e));
    this.view.showShips(this.attacker.board);
    if (!this.attacker.isHuman) {
      this.doComputerTurn();
    }
  }
}

export { GameController };
