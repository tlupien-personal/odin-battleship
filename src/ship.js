class Ship {
  constructor(length, isVertical = false) {
    this.length = length;
    this.hits = 0;
    this.isVertical = isVertical;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }

  flip() {
    this.isVertical = !this.isVertical;
  }

  place(row, col) {
    this.row = row;
    this.col = col;
  }

  getCoords() {
    if (this.row == undefined || this.col == undefined) {
      throw new Error("Ship is not yet placed");
    }
    const result = [];
    for (let i = 0; i < this.length; i++) {
      if (this.isVertical) {
        result.push([this.row + i, this.col]);
      } else {
        result.push([this.row, this.col + i]);
      }
    }
    return result;
  }
}

export { Ship };
