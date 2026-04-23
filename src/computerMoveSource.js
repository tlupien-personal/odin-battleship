class ComputerMoveSource {
  constructor(strategy, knowsRestage, random = Math.random) {
    this.strategy = strategy;
    this.knowsRestage = knowsRestage;
    this.random = random;
    this.moveType = this.strategy;
    this.moveHistory = [];
    this.resultHistory = [];
    // 0 = up, 1 = right, 2 = down, 3 = left
    this.restageDirection = 0;
    this.badDirections = new Set();
  }

  #dump() {
    console.log(this.moveType);
    console.log(this.moveHistory);
    console.log(this.resultHistory);
    console.log(this.restageDirection);
    console.log(this.badDirections);
  }

  #randomMove(board) {
    return [
      Math.floor(this.random() * (board.ub + 1)),
      Math.floor(this.random() * (board.ub + 1)),
    ];
  }

  #restageMeta() {
    const previousResult = this.resultHistory.at(-1);
    if (previousResult === "hit") {
      this.moveType = "restage";
    } else if (previousResult === "sunk") {
      this.badDirections.clear();
      this.resultHistory = this.resultHistory.map((r) =>
        r === "hit" ? (r = "sunk") : (r = r),
      );
      this.moveType = this.strategy;
    }
  }

  #generateAdjacentMoves(move, lb, ub) {
    const adjacentMoves = [
      [move[0] - 1, move[1]],
      [move[0], move[1] + 1],
      [move[0] + 1, move[1]],
      [move[0], move[1] - 1],
    ];
    for (let i = 0; i < adjacentMoves.length; i++) {
      if (
        this.moveHistory.map((m) => m + "").includes(adjacentMoves[i] + "") ||
        adjacentMoves[i].some((c) => c < lb || c > ub)
      ) {
        this.badDirections.add(i);
      }
    }
    return adjacentMoves;
  }

  #pickRestageDirection() {
    if (this.badDirections.size >= 4) {
      this.#dump();
      throw new Error("All strategic moves blocked");
    }
    while (true) {
      c++;
      const temp = Math.floor(this.random() * 4);
      if (!this.badDirections.has(temp)) {
        this.restageDirection = temp;
        break;
      }
    }
    this.badDirections.has(this.restageDirection);
  }

  #flipRestageDirection() {
    if (this.restageDirection === 0) {
      this.restageDirection = 2;
    } else if (this.restageDirection === 1) {
      this.restageDirection = 3;
    } else if (this.restageDirection === 2) {
      this.restageDirection = 0;
    } else if (this.restageDirection === 3) {
      this.restageDirection = 1;
    } else {
      throw new Error(`Improper restage direction (${this.restageDirection})`);
    }
  }

  #restageMove(board) {
    let adjacentMoves;
    const previousHits = this.resultHistory.reduce(
      (p, c) => (c === "hit" ? ++p : p),
      0,
    );
    if (previousHits > 1 && this.resultHistory.at(-1) === "miss") {
      const firstHitIdx =
        -1 *
        (this.resultHistory.length -
          this.resultHistory.findIndex((r) => r === "hit"));
      const move = this.moveHistory.at(firstHitIdx);
      adjacentMoves = this.#generateAdjacentMoves(move, board.lb, board.ub);
      this.#flipRestageDirection();
    } else if (previousHits > 1) {
      const move = this.moveHistory.at(-1);
      adjacentMoves = this.#generateAdjacentMoves(move, board.lb, board.ub);
    } else {
      const lastHitIdx =
        -1 *
        (this.resultHistory.length -
          this.resultHistory.findLastIndex((r) => r === "hit"));
      const move = this.moveHistory.at(lastHitIdx);
      adjacentMoves = this.#generateAdjacentMoves(move, board.lb, board.ub);
      this.#pickRestageDirection();
    }
    return adjacentMoves[this.restageDirection];
  }

  generateMove(board) {
    if (this.moveHistory.length > 0) {
      this.resultHistory.push(board.getSquareInfo(...this.moveHistory.at(-1)));
      this.#restageMeta();
    }
    let success = false;
    let move;
    while (!success) {
      switch (this.moveType) {
        case "random":
          move = this.#randomMove(board);
          break;
        case "restage":
          move = this.#restageMove(board);
          break;
        default:
          move = this.#randomMove(board);
          break;
      }
      const squareInfo = board.getSquareInfo(move[0], move[1]);
      if (squareInfo == null) {
        success = true;
      }
    }
    this.moveHistory.push(move);
    return move;
  }
}

export { ComputerMoveSource };
