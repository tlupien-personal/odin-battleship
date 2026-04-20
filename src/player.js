import { ComputerMoveSource } from "./computerMoveSource.js";

class Player {
  constructor(board, isHuman = true, computerStrategy) {
    this.board = board;
    this.isHuman = isHuman;
    if (!this.isHuman) {
      this.computer = new ComputerMoveSource(computerStrategy);
    }
  }

  sendAttack(other, row, col) {
    try {
      other.board.receiveAttack(row, col);
      return true;
    } catch (e) {
      return false;
    }
  }

  computerAttack(other) {
    if (this.isHuman) {
      throw new Error("Tried to do computer move on human player");
    }
    if (!this.computer) {
      throw new Error("Tried to do computer move without computer");
    }
    let computerMoveResult = false;
    let move;
    while (!computerMoveResult) {
      move = this.computer.generateMove(other.board);
      computerMoveResult = this.sendAttack(other, move[0], move[1]);
    }
    return move;
  }
}

export { Player };
