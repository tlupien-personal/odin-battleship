class Player {
  constructor(board, id, isHuman = true) {
    this.board = board;
    this.id = id;
    this.isHuman = isHuman;
  }

  sendAttack(other, row, col) {
    try {
      other.board.receiveAttack(row, col);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export { Player };
