import { ComputerMoveSource } from "./computerMoveSource.js";

class Player {
  constructor(board, isHuman = true, strategy, knowsRestage) {
    this.board = board;
    this.isHuman = isHuman;
    if (!this.isHuman) {
      this.computer = new ComputerMoveSource(strategy, knowsRestage);
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
    const move = this.computer.generateMove(other.board);
    this.sendAttack(other, move[0], move[1]);
    return move;
  }

  reset() {
    if (!this.isHuman) {
      const newComputer = new ComputerMoveSource(
        this.computer.strategy,
        this.computer.knowsRestage,
      );
      this.computer = newComputer;
    }
  }
}

export { Player };
