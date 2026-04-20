class BoardView {
  #findSquare(boardId, row, col) {
    const square = document.querySelector(
      `#${boardId} .square[data-row="${row}"][data-col="${col}"]`,
    );
    return square;
  }

  initializeBoard(board, turnFunction) {
    const boardId = board.id;
    const display = document.querySelector("#" + boardId);
    display.innerText = "";
    display.style.gridTemplateColumns = `repeat(${board.ub + 1}, 1fr)`;
    display.style.gridTemplateRows = `repeat(${board.ub + 1}, 1fr)`;
    for (let i = board.lb; i <= board.ub; i++) {
      for (let j = board.lb; j <= board.ub; j++) {
        const square = document.createElement("div");
        square.classList.add("square");
        if (i === board.ub) {
          square.classList.add("last-row");
        }
        if (j === board.lb) {
          square.classList.add("first-col");
        }
        square.setAttribute("data-row", i);
        square.setAttribute("data-col", j);
        square.setAttribute("data-board-id", boardId);
        square.addEventListener("click", turnFunction);
        display.appendChild(square);
      }
    }
  }

  toggleShips(board) {
    const boardId = board.id;
    const shipCoords = board.getAllShipCoords();
    for (const c of shipCoords) {
      const square = this.#findSquare(boardId, c[0], c[1]);
      square.classList.toggle("ship");
    }
  }

  updateSquare(board, row, col) {
    const boardId = board.id;
    const square = this.#findSquare(boardId, row, col);
    const state = board.getSquareInfo(row, col);
    square.classList.add(state);
  }
}

export { BoardView };
