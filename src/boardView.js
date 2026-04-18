class BoardView {
  constructor(board, id, turn) {
    this.board = board;
    this.id = id;
    this.display = document.querySelector(`#${id}`);
    this.turn = turn;
  }

  #findSquare(row, col) {
    const square = document.querySelector(
      `#${this.id} .square[data-row="${row}"][data-col="${col}"]`,
    );
    return square;
  }

  initializeBoard() {
    this.display.style.gridTemplateColumns = `repeat(${this.board.ub + 1}, 1fr)`;
    this.display.style.gridTemplateRows = `repeat(${this.board.ub + 1}, 1fr)`;
    for (let i = this.board.lb; i <= this.board.ub; i++) {
      for (let j = this.board.lb; j <= this.board.ub; j++) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.setAttribute("data-row", i);
        square.setAttribute("data-col", j);
        square.addEventListener("click", this.turn);
        this.display.appendChild(square);
      }
    }
  }

  toggleShips() {
    const shipCoords = this.board.getAllShipCoords();
    for (const c of shipCoords) {
      const square = this.#findSquare(c[0], c[1]);
      square.classList.toggle("ship");
    }
  }

  updateSquare(row, col) {
    const square = this.#findSquare(row, col);
    const state = this.board.getSquareInfo(row, col);
    square.classList.add(state);
  }
}

export { BoardView };
