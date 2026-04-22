class BoardView {
  #findSquare(boardId, row, col) {
    const square = document.querySelector(
      `#${boardId} .square[data-row="${row}"][data-col="${col}"]`,
    );
    return square;
  }

  initializeBoard(boardId, lb, ub, turnFunction) {
    const board = document.querySelector("#" + boardId);
    board.innerText = "";
    board.classList.remove("fade-game");
    board.style.gridTemplateColumns = `repeat(${ub + 1}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${ub + 1}, 1fr)`;
    for (let i = lb; i <= ub; i++) {
      for (let j = lb; j <= ub; j++) {
        const square = document.createElement("div");
        square.classList.add("square");
        if (i === ub) {
          square.classList.add("last-row");
        }
        if (j === lb) {
          square.classList.add("first-col");
        }
        square.setAttribute("data-row", i);
        square.setAttribute("data-col", j);
        square.setAttribute("data-board-id", boardId);
        square.addEventListener("click", turnFunction);
        board.appendChild(square);
      }
    }
  }

  showShips(boardId, coords) {
    for (const c of coords) {
      const square = this.#findSquare(boardId, c[0], c[1]);
      square.classList.add("ship");
    }
  }

  hideShips(boardId, coords) {
    for (const c of coords) {
      const square = this.#findSquare(boardId, c[0], c[1]);
      square.classList.remove("ship");
    }
  }

  updateSquare(boardId, row, col, state) {
    const square = this.#findSquare(boardId, row, col);
    if (state != null) {
      square.classList.add(state);
    }
  }

  fade() {
    const boards = document.querySelectorAll(".board");
    boards.forEach((board) => board.classList.add("fade-game"));
  }

  indicateTurn(
    attackerBoardId,
    attackerShipCoords,
    defenderBoardId,
    defenderShipCoords,
  ) {
    const attackerBoard = document.querySelector("#" + attackerBoardId);
    const defenderBoard = document.querySelector("#" + defenderBoardId);
    this.showShips(attackerBoardId, attackerShipCoords);
    this.hideShips(defenderBoardId, defenderShipCoords);
    attackerBoard.classList.add("attack-border");
    attackerBoard.classList.remove("defense-border");
    defenderBoard.classList.add("defense-border");
    defenderBoard.classList.remove("attack-border");
  }

  async block(timeout) {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(timeout);
    const boards = document.querySelectorAll(".board");
    boards.forEach((board) => {
      const block = document.createElement("div");
      block.classList.add("board-overlay");
      block.classList.add("block");
      block.addEventListener("click", () => this.unblock());

      const p1 = document.createElement("p");
      p1.innerText = "Click to Show";
      block.appendChild(p1);

      const p2 = document.createElement("p");
      p2.innerText = "Only Green May Look";
      block.appendChild(p2);

      board.appendChild(block);
    });
  }

  unblock() {
    const blocks = document.querySelectorAll(".block");
    blocks.forEach((block) => block.remove());
  }
}

export { BoardView };
