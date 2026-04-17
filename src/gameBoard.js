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
    for (let i = 0; i < ship.length; i++) {
      if (ship.isVertical) {
        if (row + i > this.ub || this.layout[row + i]?.[col]) {
          return false;
        }
      } else {
        if (col + i > this.ub || this.layout[row]?.[col + i]) {
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
  }
}

export { GameBoard };
