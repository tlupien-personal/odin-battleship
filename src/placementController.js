import { Ship } from "./ship.js";

class PlacementController {
  constructor(boardView, left, right, advance) {
    this.left = left;
    this.right = right;
    this.advance = advance;
    this.shipLengths = [5, 4, 3, 3, 2]; // magic numbers? o_O
    this.view = boardView;
    // probably gonna need like a PlacementView that has-a BoardView instead
    // to implement randomize button and future drag and drop
    // just want to get it working for now tho tbh
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
  }

  takeOverDisplay() {
    this.#doRandomPlacement(this.left.board);
    this.#doRandomPlacement(this.right.board);
    this.view.initializeBoard(this.left.board, () => {});
    this.view.initializeBoard(this.right.board, () => {});
    this.view.indicateTurn(this.left.board, this.right.board);
    // immediate advance until button is there
    this.advance();
  }
}

export { PlacementController };
