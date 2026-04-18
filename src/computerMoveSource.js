class ComputerMoveSource {
  constructor(board, strategy) {
    this.board = board;
    this.strategy = strategy;
  }

  #randomMove() {
    return [
      Math.floor(Math.random() * this.board.ub),
      Math.floor(Math.random() * this.board.ub),
    ];
  }

  generateMove() {
    switch (this.strategy) {
      case "random":
        return this.#randomMove();
      default:
        return this.#randomMove();
    }
  }
}

export { ComputerMoveSource };
