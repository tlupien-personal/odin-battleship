class BoardView {
  #getBoard(boardId) {
    return document.querySelector("#" + boardId);
  }

  #findSquare(boardId, row, col) {
    const square = document.querySelector(
      `#${boardId} .square[data-row="${row}"][data-col="${col}"]`,
    );
    return square;
  }

  setSquareCallback(boardId, event, callback) {
    const board = this.#getBoard(boardId);
    board.addEventListener(event, (e) => {
      const square = e.target;
      square.focus();
      const squareBoardId = square.getAttribute("data-board-id");
      const row = square.getAttribute("data-row");
      const col = square.getAttribute("data-col");
      if (squareBoardId == null || row == null || col == null) {
        return;
      }
      callback(squareBoardId, +row, +col);
    });
  }

  initializeBoard(boardId, lb, ub) {
    const oldBoard = this.#getBoard(boardId);
    const board = oldBoard.cloneNode();
    oldBoard.replaceWith(board);
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
        square.setAttribute("tabindex", "-1");
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

  hideShips(boardId) {
    const shipSquares = document.querySelectorAll(
      `#${boardId} .ship, #${boardId} .current-ship`,
    );
    shipSquares.forEach((square) => {
      square.classList.remove("ship");
    });
  }

  resetShips(boardId, coords) {
    this.hideShips(boardId);
    this.showShips(boardId, coords);
  }

  updateSquare(boardId, row, col, state) {
    const square = this.#findSquare(boardId, row, col);
    if (state != null && square != null) {
      square.classList.add(state);
    }
  }

  fade() {
    const boards = document.querySelectorAll(".board");
    boards.forEach((board) => board.classList.add("fade-game"));
  }

  unfade() {
    const boards = document.querySelectorAll(".board");
    boards.forEach((board) => board.classList.remove("fade-game"));
  }

  indicateTurn(attackerBoardId, attackerShipCoords, defenderBoardId) {
    const attackerBoard = this.#getBoard(attackerBoardId);
    const defenderBoard = this.#getBoard(defenderBoardId);
    this.showShips(attackerBoardId, attackerShipCoords);
    this.hideShips(defenderBoardId);
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

      if (
        board.classList.contains(
          this.flipTextLocation ? "defense-border" : "attack-border",
        )
      ) {
        const p1 = document.createElement("p");
        const p2 = document.createElement("p");
        p1.innerText = "Only Green May Look";
        p2.innerText = "Click to Show";
        block.appendChild(p1);
        block.appendChild(p2);
      }

      board.appendChild(block);
    });
  }

  unblock() {
    const blocks = document.querySelectorAll(".block");
    blocks.forEach((block) => block.remove());
  }

  turnOnDragCursor(boardId) {
    const board = this.#getBoard(boardId);
    board.style.cursor = "grabbing";
  }

  turnOffDragCursor(boardId) {
    const board = this.#getBoard(boardId);
    board.style.cursor = "auto";
  }

  showTraceShip(boardId, coords, isValid) {
    for (const displayClass of ["hit", "sunk"]) {
      const squares = document.querySelectorAll("." + displayClass);
      squares.forEach((square) => square.classList.remove(displayClass));
    }
    for (const c of coords) {
      if (isValid) {
        this.updateSquare(boardId, c[0], c[1], "sunk");
      } else {
        this.updateSquare(boardId, c[0], c[1], "hit");
      }
    }
  }

  showGhostShip(boardId, coords) {
    for (const c of coords) {
      this.updateSquare(boardId, c[0], c[1], "current-ship");
    }
  }

  hideHelperShips() {
    for (const displayClass of ["hit", "sunk", "current-ship"]) {
      const squares = document.querySelectorAll("." + displayClass);
      squares.forEach((square) => square.classList.remove(displayClass));
    }
  }
}

export { BoardView };
