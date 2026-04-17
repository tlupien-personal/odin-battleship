import { GameBoard } from "./gameBoard.js";
import { Ship } from "./ship.js";

describe("GameBoard", () => {
  describe("canPlaceShip", () => {
    test("false when row too low", () => {
      const T = new GameBoard(0, 9);
      expect(T.canPlaceShip(-1, 4, new Ship(2))).toBe(false);
    });

    test("false when col too low", () => {
      const T = new GameBoard(0, 9);
      expect(T.canPlaceShip(4, -1, new Ship(2))).toBe(false);
    });

    test("false when row too high", () => {
      const T = new GameBoard(0, 9);
      expect(T.canPlaceShip(10, 4, new Ship(2))).toBe(false);
    });

    test("false when col too high", () => {
      const T = new GameBoard(0, 9);
      expect(T.canPlaceShip(4, 10, new Ship(2))).toBe(false);
    });

    test("false when last row of ship too high", () => {
      const T = new GameBoard(0, 9);
      expect(T.canPlaceShip(7, 4, new Ship(5, true))).toBe(false);
    });

    test("false when last col of ship too high", () => {
      const T = new GameBoard(0, 9);
      expect(T.canPlaceShip(4, 7, new Ship(5))).toBe(false);
    });

    test("true when acceptable ship position 1", () => {
      const T = new GameBoard(0, 9);
      T.canPlaceShip(0, 0, new Ship(3));
    });

    test("true when acceptable ship position 2", () => {
      const T = new GameBoard(0, 9);
      T.placeShip(0, 0, new Ship(3));
      T.canPlaceShip(1, 0, new Ship(3));
    });

    test("false when ships overlap", () => {
      const T = new GameBoard(0, 9);
      T.placeShip(1, 0, new Ship(3));
      expect(T.canPlaceShip(0, 0, new Ship(3, true))).toBe(false);
      expect(T.canPlaceShip(0, 1, new Ship(3, true))).toBe(false);
      expect(T.canPlaceShip(0, 2, new Ship(3, true))).toBe(false);
    });
  });

  describe("placeShip", () => {
    test("error when ship cannot be placed", () => {
      const T = new GameBoard(0, 9);
      expect(() => T.placeShip(-1, -1, new Ship(3))).toThrow();
    });

    test("places vertical ship correctly", () => {
      const T = new GameBoard(0, 9);
      const ship = new Ship(3, true);
      T.placeShip(0, 0, ship);
      expect(T.layout[0][0]).toBe(ship);
      expect(T.layout[1][0]).toBe(ship);
      expect(T.layout[2][0]).toBe(ship);
    });

    test("places horizontal ship correctly", () => {
      const T = new GameBoard(0, 9);
      const ship = new Ship(3);
      T.placeShip(0, 0, ship);
      expect(T.layout[0][0]).toBe(ship);
      expect(T.layout[0][1]).toBe(ship);
      expect(T.layout[0][2]).toBe(ship);
    });
  });

  describe("receiveAttack", () => {
    test("error on out of bounds coord", () => {
      const T = new GameBoard(0, 9);
      expect(() => T.receiveAttack(-1, -1)).toThrow();
    });

    test("error on duplicate attack", () => {
      const T = new GameBoard(0, 9);
      T.receiveAttack(0, 0);
      expect(() => T.receiveAttack(0, 0)).toThrow();
    });

    test("marks misses correctly", () => {
      const T = new GameBoard(0, 9);
      T.receiveAttack(0, 0);
      expect(T.tracker[0][0]).toBe("miss");
    });

    test("marks hits correctly", () => {
      const T = new GameBoard(0, 9);
      T.placeShip(0, 0, new Ship(1));
      T.receiveAttack(0, 0);
      expect(T.tracker[0][0]).toBe("hit");
    });
  });

  describe("checkSinkage", () => {
    test("false when none are sunk", () => {
      const T = new GameBoard(0, 9);
      T.placeShip(0, 0, new Ship(2));
      T.placeShip(3, 5, new Ship(4, true));
      expect(T.checkSinkage()).toBe(false);
    });

    test("false when some are sunk", () => {
      const T = new GameBoard(0, 9);
      T.placeShip(0, 0, new Ship(2));
      T.placeShip(3, 5, new Ship(4, true));
      T.receiveAttack(0, 0);
      T.receiveAttack(0, 1);
      expect(T.checkSinkage()).toBe(false);
    });

    test("updates tracker", () => {
      const T = new GameBoard(0, 9);
      T.placeShip(0, 0, new Ship(2));
      T.placeShip(3, 5, new Ship(4, true));
      T.receiveAttack(0, 0);
      T.receiveAttack(0, 1);
      T.receiveAttack(3, 5);
      T.checkSinkage();
      expect(T.tracker[0][0]).toBe("sunk");
      expect(T.tracker[0][1]).toBe("sunk");
      expect(T.tracker[3][5]).toBe("hit");
    });

    test("true when all sunk", () => {
      const T = new GameBoard(0, 9);
      T.placeShip(0, 0, new Ship(2));
      T.placeShip(3, 5, new Ship(4, true));
      T.receiveAttack(0, 0);
      T.receiveAttack(0, 1);
      T.receiveAttack(3, 5);
      T.receiveAttack(4, 5);
      T.receiveAttack(5, 5);
      T.receiveAttack(6, 5);
      expect(T.checkSinkage()).toBe(true);
    });
  });
});
