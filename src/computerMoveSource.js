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
    this.isRetry = false;
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
    let success = false;
    let safety = 0;
    while (!success) {
      safety++;
      const temp = Math.floor(this.random() * 4);
      if (!this.badDirections.has(temp)) {
        this.restageDirection = temp;
        success = true;
      }
      if (safety > 50) {
        this.#dump();
        throw new Error("This should never happen™");
      }
    }
  }

  #flipRestageDirection() {
    if (this.restageDirection === 0) {
      this.restageDirection = 2;
      this.badDirections.delete(2);
    } else if (this.restageDirection === 1) {
      this.restageDirection = 3;
      this.badDirections.delete(3);
    } else if (this.restageDirection === 2) {
      this.restageDirection = 0;
      this.badDirections.delete(0);
    } else if (this.restageDirection === 3) {
      this.restageDirection = 1;
      this.badDirections.delete(1);
    } else {
      throw new Error(`Improper restage direction (${this.restageDirection})`);
    }
  }

  #turnAroundAndRedoMoves(board) {
    const firstHitIdx = this.resultHistory.findIndex((r) => r === "hit");
    const move = this.moveHistory.at(firstHitIdx);
    const adjacentMoves = this.#generateAdjacentMoves(move, board.lb, board.ub);
    this.#flipRestageDirection();
    return adjacentMoves;
  }

  #restageMove(board) {
    let adjacentMoves;
    const previousHits = this.resultHistory.reduce(
      (p, c) => (c === "hit" ? ++p : p),
      0,
    );
    if (
      previousHits > 1 &&
      (this.resultHistory.at(-1) === "miss" || this.isRetry)
    ) {
      adjacentMoves = this.#turnAroundAndRedoMoves(board);
    } else if (previousHits > 1) {
      const move = this.moveHistory.at(-1);
      adjacentMoves = this.#generateAdjacentMoves(move, board.lb, board.ub);
      if (this.badDirections.has(this.restageDirection)) {
        adjacentMoves = this.#turnAroundAndRedoMoves(board);
      }
    } else {
      const lastHitIdx = this.resultHistory.findLastIndex((r) => r === "hit");
      const move = this.moveHistory.at(lastHitIdx);
      adjacentMoves = this.#generateAdjacentMoves(move, board.lb, board.ub);
      this.#pickRestageDirection();
    }
    return adjacentMoves[this.restageDirection];
  }

  #randomCheckerboardMove(board) {
    let success = false;
    let move;
    while (!success) {
      move = [
        Math.floor(this.random() * (board.ub + 1)),
        Math.floor(this.random() * (board.ub + 1)),
      ];
      if (
        (move[0] % 2 === 0 && move[1] % 2 === 0) ||
        (move[0] % 2 !== 0 && move[1] % 2 !== 0)
      ) {
        success = true;
      }
    }
    return move;
  }

  generateMove(board) {
    this.isRetry = false;
    if (this.moveHistory.length > 0) {
      this.resultHistory.push(board.getSquareInfo(...this.moveHistory.at(-1)));
      this.#restageMeta();
    }
    let success = false;
    let move;
    let safety = 0;
    while (!success) {
      safety++;
      switch (this.moveType) {
        case "random":
          move = this.#randomMove(board);
          break;
        case "randomCheckerboard":
          move = this.#randomCheckerboardMove(board);
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
      } else {
        this.isRetry = true;
      }
      if (safety > 200) {
        this.#dump();
        throw new Error("This should never happen™");
      }
    }
    this.moveHistory.push(move);
    return move;
  }
}

export { ComputerMoveSource };
