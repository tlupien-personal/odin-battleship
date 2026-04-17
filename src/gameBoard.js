class GameBoard {
  constructor(lb = 0, ub = 9) {
    this.lb = lb;
    this.ub = ub;
    this.ships = [];
    this.tracker = {};
    this.layout = {};
  }

  canPlaceShip(row, col, ship) {
    if (row < this.lb || col < this.lb || row > this.ub || col > this.ub) {
      return false;
    }
    if (ship.isVertical) {
      const endRow = row + ship.length - 1;
      if (endRow > this.ub) {
        return false;
      }
      for (let i = row; i <= endRow; i++) {
        if (this.layout[i]?.[col]) {
          return false;
        }
      }
    } else {
      const endCol = col + ship.length - 1;
      if (endCol > this.ub) {
        return false;
      }
      for (let i = col; i <= endCol; i++) {
        if (this.layout[row]?.[i]) {
          return false;
        }
      }
    }
    return true;
  }

  placeShip(row, col, ship) {
    if (!this.canPlaceShip(row, col, ship)) {
      throw new Error("Illegal ship placement.");
    }
    this.ships.push(ship);
    if (ship.isVertical) {
      const endRow = row + ship.length - 1;
      for (let i = row; i <= endRow; i++) {
        this.layout[i] ??= {};
        this.layout[i][col] = ship;
      }
    } else {
      const endCol = col + ship.length - 1;
      this.layout[row] ??= {};
      for (let i = col; i <= endCol; i++) {
        this.layout[row][i] = ship;
      }
    }
  }
}

export { GameBoard };
