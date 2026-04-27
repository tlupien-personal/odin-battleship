class GameController {
  constructor(boardView, left, right, advance) {
    this.attacker = left;
    this.defender = right;
    this.advance = advance;
    this.gameOver = false;
    this.boardView = boardView;
  }

  #doComputerMove() {
    const move = this.attacker.computerAttack(this.defender);
    this.boardView.updateSquare(
      this.defender.board.id,
      move[0],
      move[1],
      this.defender.board.getSquareInfo(move[0], move[1]),
    );
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
      await this.boardView.block(1500); // temp
    }
    this.defender = newDefender;
    this.attacker = newAttacker;
    this.boardView.indicateTurn(
      this.attacker.board.id,
      this.attacker.board.getAllShipCoords(),
      this.defender.board.id,
      this.defender.board.getAllShipCoords(),
    );
    if (!this.attacker.isHuman) {
      this.doComputerTurn();
    }
  }

  #updateSunk() {
    for (const c of this.defender.board.getAllShipCoords()) {
      this.boardView.updateSquare(
        this.defender.board.id,
        c[0],
        c[1],
        this.defender.board.getSquareInfo(c[0], c[1]),
      );
    }
  }

  #isGameOver() {
    this.gameOver = this.defender.board.checkSinkage();
    this.#updateSunk();
    if (this.gameOver) {
      this.advance();
    }
  }

  async doHumanTurn(boardId, row, col) {
    if (this.gameOver || this.attacker == null) {
      return;
    }
    if (this.attacker.board.id === boardId) {
      return;
    }
    const moveResult = this.attacker.sendAttack(this.defender, row, col);
    if (!moveResult) {
      return;
    }
    this.boardView.updateSquare(
      this.defender.board.id,
      row,
      col,
      this.defender.board.getSquareInfo(row, col),
    );
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

  async takeOverDisplay() {
    this.boardView.initializeBoard(
      this.attacker.board.id,
      this.attacker.board.lb,
      this.attacker.board.ub,
    );
    this.boardView.setSquareCallback(
      this.attacker.board.id,
      "click",
      (id, row, col) => this.doHumanTurn(id, row, col),
    );
    this.boardView.initializeBoard(
      this.defender.board.id,
      this.defender.board.lb,
      this.defender.board.ub,
    );
    this.boardView.setSquareCallback(
      this.defender.board.id,
      "click",
      (id, row, col) => this.doHumanTurn(id, row, col),
    );
    this.boardView.indicateTurn(
      this.attacker.board.id,
      this.attacker.board.getAllShipCoords(),
      this.defender.board.id,
      this.defender.board.getAllShipCoords(),
    );
    if (this.attacker.isHuman && this.defender.isHuman) {
      await this.boardView.block(0);
    }
    this.boardView.flipTextLocation = true;
    if (!this.attacker.isHuman) {
      this.doComputerTurn();
    }
  }
}

export { GameController };
