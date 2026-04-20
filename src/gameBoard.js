class GameBoard {
  constructor(id, lb = 0, ub = 9) {
    this.id = id;
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
    for (let i = -1; i < ship.length + 1; i++) {
      if (ship.isVertical) {
        if (
          row + i > this.ub ||
          this.layout[row + i]?.[col] ||
          this.layout[row + i]?.[col - 1] ||
          this.layout[row + i]?.[col + 1]
        ) {
          return false;
        }
      } else {
        if (
          col + i > this.ub ||
          this.layout[row]?.[col + i] ||
          this.layout[row - 1]?.[col + i] ||
          this.layout[row + 1]?.[col + i]
        ) {
          return false;
        }
      }
    }
    return true;
  }

  placeShip(row, col, ship) {
    if (!this.canPlaceShip(row, col, ship)) {
      throw new Error("Illegal ship placement");
    }
    ship.place(row, col);
    this.ships.push(ship);
    for (const c of ship.getCoords()) {
      this.layout[c[0]] ??= {};
      this.layout[c[0]][c[1]] = ship;
    }
  }

  receiveAttack(row, col) {
    if (row < this.lb || col < this.lb || row > this.ub || col > this.ub) {
      throw new Error("Out of bounds");
    }

    if (this.tracker[row]?.[col]) {
      throw new Error("Already played");
    }

    let mark;
    if (this.layout[row]?.[col]) {
      this.layout[row][col].hit();
      mark = "hit";
    } else {
      mark = "miss";
    }

    this.tracker[row] ??= {};
    this.tracker[row][col] = mark;
  }

  checkSinkage() {
    let allSunk = true;
    for (const ship of this.ships) {
      if (ship.isSunk()) {
        for (const c of ship.getCoords()) {
          this.tracker[c[0]][c[1]] = "sunk";
        }
      } else {
        allSunk = false;
      }
    }
    return allSunk;
  }

  getSquareInfo(row, col) {
    return this.tracker[row]?.[col] ?? null;
  }

  getAllShipCoords() {
    const result = [];
    for (const ship of this.ships) {
      for (const c of ship.getCoords()) {
        result.push(c);
      }
    }
    return result;
  }
}

export { GameBoard };
