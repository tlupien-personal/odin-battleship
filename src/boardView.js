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
    display.classList.remove("fade-game");
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

  showShips(board) {
    const boardId = board.id;
    const shipCoords = board.getAllShipCoords();
    for (const c of shipCoords) {
      const square = this.#findSquare(boardId, c[0], c[1]);
      square.classList.add("ship");
    }
  }

  hideShips(board) {
    const boardId = board.id;
    const shipCoords = board.getAllShipCoords();
    for (const c of shipCoords) {
      const square = this.#findSquare(boardId, c[0], c[1]);
      square.classList.remove("ship");
    }
  }

  updateSquare(board, row, col) {
    const boardId = board.id;
    const square = this.#findSquare(boardId, row, col);
    const state = board.getSquareInfo(row, col);
    if (state != null) {
      square.classList.add(state);
    }
  }

  fade(board) {
    const display = document.querySelector("#" + board.id);
    display.classList.add("fade-game");
  }

  indicateTurn(attackerBoard, defenderBoard) {
    const attacker = document.querySelector("#" + attackerBoard.id);
    const defender = document.querySelector("#" + defenderBoard.id);
    this.showShips(attackerBoard);
    this.hideShips(defenderBoard);
    attacker.classList.add("attack-border");
    attacker.classList.remove("defense-border");
    defender.classList.add("defense-border");
    defender.classList.remove("attack-border");
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
      p1.innerText = "Pass the Device";
      block.appendChild(p1);

      const p2 = document.createElement("p");
      p2.innerText = "Then Click to Show";
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
