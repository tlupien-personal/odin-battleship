import { PlacementView } from "./placementView.js";
import { Ship } from "./ship.js";

class PlacementController {
  constructor(boardView, left, right, advance) {
    this.left = left;
    this.right = right;
    this.advance = advance;
    this.shipLengths = [5, 4, 3, 3, 2]; // magic numbers? o_O
    this.boardView = boardView;
    this.placementView = new PlacementView();
    this.isDragging = false;
  }

  #doRandomPlacement(board) {
    board.reset();
    for (const l of this.shipLengths) {
      let placed = false;
      while (!placed) {
        const ship = new Ship(l);
        if (Math.random() >= 0.5) {
          ship.flip();
        }
        const row = Math.floor(Math.random() * board.ub);
        const col = Math.floor(Math.random() * board.ub);
        if (board.canPlaceShip(row, col, ship)) {
          board.placeShip(row, col, ship);
          placed = true;
        }
      }
    }
    this.boardView.resetShips(board.id, board.getAllShipCoords());
  }

  #applyPlacementCallbacks(board) {
    this.boardView.setSquareCallback(board.id, "mousedown", (id, row, col) =>
      this.#pickUpShip(id, row, col),
    );
    this.boardView.setSquareCallback(board.id, "mouseover", (id, row, col) =>
      this.#checkShip(id, row, col),
    );
    this.boardView.setSquareCallback(board.id, "mouseup", (id, row, col) =>
      this.#putDownShip(id, row, col),
    );
  }

  #pickUpShip(boardId, row, col) {
    if (this.isDragging || this.activePlayer.board.id !== boardId) {
      return;
    }
    this.currentShip = this.activePlayer.board.popShipByCoord(row, col);
    if (!this.currentShip) {
      return;
    }
    const shipHead = this.currentShip.getCoords()[0];
    const shipVertical = this.currentShip.isVertical;
    this.boardView.showGhostShip(boardId, this.currentShip.getCoords());
    if (shipVertical) {
      this.shipOffset = row - shipHead[0];
    } else {
      this.shipOffset = col - shipHead[1];
    }
    this.isDragging = true;
    this.boardView.turnOnDragCursor(boardId);
  }

  #shipHeadFromOffset(row, col) {
    if (this.shipOffset == null || this.currentShip == null) {
      return;
    }
    if (this.currentShip.isVertical) {
      return [row - this.shipOffset, col];
    } else {
      return [row, col - this.shipOffset];
    }
  }

  #checkShip(boardId, row, col) {
    if (!this.isDragging || this.activePlayer.board.id !== boardId) {
      return;
    }
    const coord = this.#shipHeadFromOffset(row, col);
    const isValid = this.activePlayer.board.canPlaceShip(
      ...coord,
      this.currentShip,
    );
    const fakeShip = new Ship(
      this.currentShip.length,
      this.currentShip.isVertical,
    );
    fakeShip.place(...coord);
    this.boardView.showTraceShip(boardId, fakeShip.getCoords(), isValid);
  }

  #putDownShip(boardId, row, col) {
    if (!this.isDragging || this.activePlayer.board.id !== boardId) {
      return;
    }
    const coord = this.#shipHeadFromOffset(row, col);
    const isValid = this.activePlayer.board.canPlaceShip(
      ...coord,
      this.currentShip,
    );
    if (isValid) {
      this.activePlayer.board.placeShip(...coord, this.currentShip);
    } else {
      this.activePlayer.board.placeShip(
        this.currentShip.row,
        this.currentShip.col,
        this.currentShip,
      );
    }
    this.isDragging = false;
    this.boardView.turnOffDragCursor(boardId);
    this.boardView.hideHelperShips();
    this.boardView.resetShips(
      boardId,
      this.activePlayer.board.getAllShipCoords(),
    );
  }

  #activateBoard(board, other, ready) {
    this.placementView.removeButtons(other.id);
    this.boardView.initializeBoard(board.id, board.lb, board.ub);
    this.boardView.initializeBoard(other.id, other.lb, other.ub);
    this.#doRandomPlacement(board);
    this.#applyPlacementCallbacks(board);
    this.placementView.addButtons(
      board.id,
      () => this.#doRandomPlacement(board),
      () => ready(),
    );
    this.boardView.indicateTurn(board.id, board.getAllShipCoords(), other.id);
  }

  #switchPlacementTurn() {
    if (this.left.isHuman && this.right.isHuman) {
      this.boardView.block(0);
    }
    this.#activateBoard(this.right.board, this.left.board, () =>
      this.advance(),
    );
    this.activePlayer = this.right;
    if (!this.right.isHuman) {
      this.advance();
    }
  }

  takeOverDisplay() {
    this.left.reset();
    this.right.reset();

    this.boardView.unfade();
    this.boardView.flipTextLocation = false;

    if (this.left.isHuman && this.right.isHuman) {
      this.boardView.block(0);
    }

    this.#activateBoard(this.left.board, this.right.board, () =>
      this.#switchPlacementTurn(),
    );
    this.activePlayer = this.left;

    if (!this.left.isHuman) {
      this.#switchPlacementTurn();
    }
  }
}

export { PlacementController };
