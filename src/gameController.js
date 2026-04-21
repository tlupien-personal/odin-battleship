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

  async #passTurn() {
    if (this.gameOver) {
      return;
    }
    const newAttacker = this.defender;
    const newDefender = this.attacker;
    if (this.attacker.isHuman && this.defender.isHuman) {
      this.defender = null;
      this.attacker = null;
      await this.view.block(2000); // temp
    }
    this.defender = newDefender;
    this.attacker = newAttacker;
    this.view.indicateTurn(this.attacker.board, this.defender.board);
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

  async doHumanTurn(e) {
    if (this.gameOver || this.attacker == null) {
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
    await this.#passTurn();
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
    if (this.attacker.isHuman && this.defender.isHuman) {
      this.view.block(0);
    }
    this.view.indicateTurn(this.attacker.board, this.defender.board);
    if (!this.attacker.isHuman) {
      this.doComputerTurn();
    }
  }
}

export { GameController };
