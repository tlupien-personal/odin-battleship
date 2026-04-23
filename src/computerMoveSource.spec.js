import { ComputerMoveSource } from "./computerMoveSource.js";

const mockBoard = {
  lb: 0,
  ub: 9,
  getSquareInfo: jest.fn(),
};

const applyMockBoard = (values, fallback, allValid) => {
  values.forEach((r) => {
    if (allValid) {
      mockBoard.getSquareInfo.mockReturnValueOnce(null);
    }
    mockBoard.getSquareInfo.mockReturnValueOnce(r);
  });
  mockBoard.getSquareInfo.mockReturnValue(fallback);
};

const applyMockRandom = (values, fallback) => {
  values.flat().forEach((r) => {
    mockRandom.mockReturnValueOnce(r);
  });
  mockRandom.mockReturnValue(fallback);
};

const mockRandom = jest.fn();

describe("ComputerMoveSource", () => {
  describe("generateMove - pure random", () => {
    test("Works immediately against empty square", () => {
      const T = new ComputerMoveSource("random", false, mockRandom);
      mockRandom.mockReturnValue(0.99);
      mockBoard.getSquareInfo.mockReturnValue(null);
      const M = T.generateMove(mockBoard);
      expect(M[0]).toBe(9);
      expect(M[1]).toBe(9);
    });

    test("Retries after non-empty square", () => {
      const T = new ComputerMoveSource("random", false, mockRandom);
      applyMockRandom([0.99, 0.99], 0.01);
      applyMockBoard(["miss", null], null, false);
      mockBoard.getSquareInfo.mockReturnValueOnce("miss").mockReturnValue(null);
      const M = T.generateMove(mockBoard);
      expect(mockBoard.getSquareInfo).toHaveBeenCalledTimes(2);
      expect(M[0]).toBe(0);
      expect(M[1]).toBe(0);
    });
  });

  describe("generateMove - random + restage", () => {
    test("Follows random strategy by default", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      mockRandom.mockReturnValue(0);
      mockBoard.getSquareInfo.mockReturnValue(null);
      T.generateMove(mockBoard);
      expect(T.moveType).toBe("random");
    });

    test("Enters restage mode after a hit", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      mockRandom.mockReturnValue(0.55);
      mockBoard.getSquareInfo
        // addition to result history skipped b/c no previous move
        .mockReturnValueOnce(null) // validity loop break
        .mockReturnValueOnce("hit") // addition to result history
        .mockReturnValueOnce(null); // validity loop break
      // this is the pattern for these tests, keep this in mind
      mockBoard.getSquareInfo.mockReturnValue(null);
      T.generateMove(mockBoard);
      T.generateMove(mockBoard);
      expect(T.moveType).toBe("restage");
    });

    test("Leaves restage mode after a ship is sunk", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      mockRandom.mockReturnValue(0.5);
      applyMockBoard(["hit", "sunk"], null, true);
      T.generateMove(mockBoard);
      T.generateMove(mockBoard);
      expect(T.moveType).toBe("restage");
      T.generateMove(mockBoard);
      expect(T.moveType).toBe("random");
    });

    test("Blocks row-wise out of bounds move in restage", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      // random ([0, 0]), top ([-1, 0]), right ([0, 1])
      applyMockRandom([[0, 0], 0, 0.33], 0);
      applyMockBoard(["hit"], null, true);
      T.generateMove(mockBoard);
      const R = T.generateMove(mockBoard);
      expect(R[0]).toBe(0);
      expect(R[1]).toBe(1);
    });

    test("Blocks column-wise out of bounds move in restage", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      // random ([0, 0]) , left ([0, -1]), bottom ([1, 0])
      applyMockRandom([[0, 0], 0.99, 0.66], 0);
      applyMockBoard(["hit"], null, true);
      T.generateMove(mockBoard);
      const R = T.generateMove(mockBoard);
      expect(R[0]).toBe(1);
      expect(R[1]).toBe(0);
    });

    test("Blocks non-empty squares", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      // random ([0, 0]), random ([0, 1]), left ([0, 0]), right ([0, 2])
      applyMockRandom([[0, 0], [0, 0.11], 0.99, 0.33], 0);
      applyMockBoard(["miss", "hit"], null, true);
      T.generateMove(mockBoard);
      T.generateMove(mockBoard);
      const R = T.generateMove(mockBoard);
      expect(R[0]).toBe(0);
      expect(R[1]).toBe(2);
    });

    test("Picks random direction after first hit and until second hit - worst case", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      applyMockRandom([[0.55, 0.55], 0, 0.33, 0.66, 0.99], 0);
      applyMockBoard(["hit", "miss", "miss", "miss", "hit"], null, true);
      let R = T.generateMove(mockBoard); // hit
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(4);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(6);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(6);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(4);
      T.generateMove(mockBoard);
      // the point being that in the last move, it was NOT random
      expect(mockRandom).toHaveBeenCalledTimes(6);
    });

    test("Picks random direction after first hit and until second hit - best case", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      applyMockRandom([[0.55, 0.55], 0, 0.33, 0.66, 0.99], 0);
      applyMockBoard(["hit", "hit"], null, true);
      let R = T.generateMove(mockBoard);
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(4);
      expect(R[1]).toBe(5);
      T.generateMove(mockBoard);
      expect(mockRandom).toHaveBeenCalledTimes(3);
    });

    test("Picks random direction after first hit and until second hit - avg case", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      applyMockRandom([[0.55, 0.55], 0, 0.33, 0.66, 0.99], 0);
      applyMockBoard(["hit", "miss", "hit"], null, true);
      let R = T.generateMove(mockBoard);
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(4);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(6);
      T.generateMove(mockBoard);
      expect(mockRandom).toHaveBeenCalledTimes(4);
    });

    test("Keeps going after 2nd hit - immediate", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      applyMockRandom([[0.55, 0.55], 0, 0.33, 0.66, 0.99], 0);
      applyMockBoard(["hit", "hit", "hit"], null, true);
      let R = T.generateMove(mockBoard);
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(4);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(3);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(2);
      expect(R[1]).toBe(5);
      expect(mockRandom).toHaveBeenCalledTimes(3);
    });

    test("Keeps going after 2nd hit - gap", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      applyMockRandom([[0.55, 0.55], 0, 0.33, 0.66, 0.99], 0);
      applyMockBoard(["hit", "miss", "miss", "hit", "hit"], null, true);
      let R = T.generateMove(mockBoard);
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(4);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(6);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(6);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(7);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(8);
      expect(R[1]).toBe(5);
      expect(mockRandom).toHaveBeenCalledTimes(5);
    });

    test("Turns around relative to the original hit after a miss but no sunk", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      applyMockRandom([[0.55, 0.55], 0, 0.33, 0.66, 0.99], 0);
      applyMockBoard(["hit", "hit", "miss", "hit"], null, true);
      let R = T.generateMove(mockBoard);
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(4);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(3);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(6);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(7);
      expect(R[1]).toBe(5);
      expect(mockRandom).toHaveBeenCalledTimes(3);
    });
    test("Turns around upon encountering a filled square", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      applyMockRandom([[0.55, 0.55], 0, 0.33, 0.66, 0.99], 0);
      applyMockBoard(
        [null, "hit", null, "hit", "miss", null, "hit"],
        null,
        false,
      );
      let R = T.generateMove(mockBoard);
      expect(R[0]).toBe(5);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(4);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(6);
      expect(R[1]).toBe(5);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(7);
      expect(R[1]).toBe(5);
      expect(mockRandom).toHaveBeenCalledTimes(3);
    });

    test("Turns around upon going out of bounds", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      applyMockRandom([[0, 0.11], 0.99], 0);
      applyMockBoard(["hit", "hit", "hit"], null, true);
      let R = T.generateMove(mockBoard);
      expect(R[0]).toBe(0);
      expect(R[1]).toBe(1);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(0);
      expect(R[1]).toBe(0);
      R = T.generateMove(mockBoard);
      expect(R[0]).toBe(0);
      expect(R[1]).toBe(2);
      expect(mockRandom).toHaveBeenCalledTimes(3);
    });
  });
});
