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

  describe("flip", () => {
    test("toggles the isVertical flag", () => {
      const T = new Ship(3);
      expect(T.isVertical).toBe(false);
      T.flip();
      expect(T.isVertical).toBe(true);
      T.flip();
      expect(T.isVertical).toBe(false);
    });
  });

  describe("place", () => {
    test("stores 'head' coordinates", () => {
      const T = new Ship(3);
      T.place(6, 7);
      expect(T.row).toBe(6);
      expect(T.col).toBe(7);
    });
  });

  describe("getCoords", () => {
    test("correct coords vertical", () => {
      const T = new Ship(3, true);
      T.place(0, 0);
      const coords = T.getCoords();
      expect(coords[0][0]).toBe(0);
      expect(coords[0][1]).toBe(0);
      expect(coords[1][0]).toBe(1);
      expect(coords[1][1]).toBe(0);
      expect(coords[2][0]).toBe(2);
      expect(coords[2][1]).toBe(0);
    });
    test("correct coords horizontal", () => {
      const T = new Ship(3);
      T.place(0, 0);
      const coords = T.getCoords();
      expect(coords[0][0]).toBe(0);
      expect(coords[0][1]).toBe(0);
      expect(coords[1][0]).toBe(0);
      expect(coords[1][1]).toBe(1);
      expect(coords[2][0]).toBe(0);
      expect(coords[2][1]).toBe(2);
    });

    test("error when unplaced ship is asked for coords", () => {
      const T = new Ship(3);
      expect(() => T.getCoords()).toThrow();
    });
  });
});
