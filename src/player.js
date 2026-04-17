class Player {
  constructor(board) {
    this.board = board;
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
