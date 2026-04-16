import { Ship } from "./ship.js";

describe("Ship", () => {
  describe("hit", () => {
    test("increments hit counter", () => {
      const T = new Ship(5);
      T.hit();
      expect(T.hits).toBe(1);
      T.hit();
      expect(T.hits).toBe(2);
    });
  });

  describe("isSunk", () => {
    test("false when not sunk", () => {
      const T = new Ship(5);
      T.hit();
      T.hit();
      expect(T.isSunk()).toBe(false);
    });

    test("true when sunk", () => {
      const T = new Ship(2);
      T.hit();
      T.hit();
      expect(T.isSunk()).toBe(true);
    });
  });
});
