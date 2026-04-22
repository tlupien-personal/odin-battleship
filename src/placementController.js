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
  }

  #doRandomPlacement(board, ready) {
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
    this.boardView.initializeBoard(board.id, board.lb, board.ub, () => {});
    this.boardView.showShips(board.id, board.getAllShipCoords());
    this.placementView.addButtons(
      board.id,
      () => this.#doRandomPlacement(board, ready),
      () => ready(),
    );
  }

  #switchPlacementTurn() {
    if (this.left.isHuman && this.right.isHuman) {
      this.boardView.block(0);
    }
    this.placementView.removeButtons(this.left.board.id);
    this.boardView.indicateTurn(
      this.right.board.id,
      this.right.board.getAllShipCoords(),
      this.left.board.id,
      this.left.board.getAllShipCoords(),
    );
    this.#doRandomPlacement(this.right.board, () => this.advance());
    if (!this.right.isHuman) {
      this.advance();
    }
  }

  takeOverDisplay() {
    if (this.left.isHuman && this.right.isHuman) {
      this.boardView.block(0);
    }
    this.boardView.initializeBoard(
      this.right.board.id,
      this.right.board.lb,
      this.right.board.ub,
      () => {},
    );
    this.#doRandomPlacement(this.left.board, () => this.#switchPlacementTurn());
    this.boardView.indicateTurn(
      this.left.board.id,
      this.left.board.getAllShipCoords(),
      this.right.board.id,
      this.right.board.getAllShipCoords(),
    );
    if (!this.left.isHuman) {
      this.#switchPlacementTurn();
    }
  }
}

export { PlacementController };
