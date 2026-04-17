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
}

export { Ship };
