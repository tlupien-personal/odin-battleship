import { GameBoard } from "./gameBoard.js";
import { Player } from "./player.js";

describe("Player", () => {
  describe("sendAttack", () => {
    test("true when attack goes through", () => {
      const T = new Player(new GameBoard());
      const O = new Player(new GameBoard());
      expect(T.sendAttack(O, 2, 2)).toBe(true);
    });
    test("false when attack has error", () => {
      const T = new Player(new GameBoard());
      const O = new Player(new GameBoard());
      T.sendAttack(O, 2, 2);
      expect(T.sendAttack(O, 2, 2)).toBe(false);
    });
  });
});
