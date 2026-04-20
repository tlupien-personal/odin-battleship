class ComputerMoveSource {
  constructor(strategy) {
    this.strategy = strategy;
    this.tracker = [];
  }

  #randomMove(board) {
    return [
      Math.floor(Math.random() * (board.ub + 1)),
      Math.floor(Math.random() * (board.ub + 1)),
    ];
  }

  generateMove(board) {
    switch (this.strategy) {
      case "random":
        return this.#randomMove(board);
      default:
        return this.#randomMove(board);
    }
  }
}

export { ComputerMoveSource };
