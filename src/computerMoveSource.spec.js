import { ComputerMoveSource } from "./computerMoveSource.js";

const mockBoard = {
  lb: 0,
  ub: 9,
  getSquareInfo: jest.fn(),
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
      mockRandom.mockReturnValueOnce(0.99).mockReturnValueOnce(0.99);
      // called once for each coordinate each time (so 2x)
      mockRandom.mockReturnValue(0.01);
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
      mockRandom.mockReturnValue(0.5);
      mockBoard.getSquareInfo
        // addition to result history skipped b/c no previous move
        .mockReturnValueOnce(null) // validity loop break
        .mockReturnValueOnce("hit") // addition to result history
        .mockReturnValueOnce(null); // validity loop break
      // this is the pattern for these tests, keep this in mind
      T.generateMove(mockBoard);
      T.generateMove(mockBoard);
      expect(T.moveType).toBe("restage");
    });

    test("Leaves restage mode after a ship is sunk", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      mockRandom.mockReturnValue(0.5);
      mockBoard.getSquareInfo
        .mockReturnValueOnce(null)
        .mockReturnValueOnce("hit")
        .mockReturnValueOnce(null)
        .mockReturnValueOnce("sunk")
        .mockReturnValueOnce(null);
      T.generateMove(mockBoard);
      T.generateMove(mockBoard);
      expect(T.moveType).toBe("restage");
      T.generateMove(mockBoard);
      expect(T.moveType).toBe("random");
    });

    test("Blocks row-wise out of bounds move in restage", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      mockRandom.mockReturnValueOnce(0).mockReturnValueOnce(0); // random shot
      mockRandom.mockReturnValueOnce(0); // pick top ([-1, 0]) and fail
      mockRandom.mockReturnValueOnce(0.33); // pick right ([0, 1])
      mockBoard.getSquareInfo
        .mockReturnValueOnce(null)
        .mockReturnValueOnce("hit")
        .mockReturnValueOnce(null)
        .mockReturnValue(null);
      T.generateMove(mockBoard);
      const R = T.generateMove(mockBoard);
      expect(R[0]).toBe(0);
      expect(R[1]).toBe(1);
    });

    test("Blocks column-wise out of bounds move in restage", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      mockRandom.mockReturnValueOnce(0).mockReturnValueOnce(0); // random shot
      mockRandom.mockReturnValueOnce(0.99); // pick left ([0, -1]) and fail
      mockRandom.mockReturnValueOnce(0.66); // pick bottom ([1, 0])
      mockBoard.getSquareInfo
        .mockReturnValueOnce(null)
        .mockReturnValueOnce("hit")
        .mockReturnValueOnce(null)
        .mockReturnValue(null);
      T.generateMove(mockBoard);
      const R = T.generateMove(mockBoard);
      expect(R[0]).toBe(1);
      expect(R[1]).toBe(0);
    });

    test("Blocks non-empty squares", () => {
      const T = new ComputerMoveSource("random", true, mockRandom);
      mockRandom.mockReturnValueOnce(0).mockReturnValueOnce(0); // [0, 0]
      mockRandom.mockReturnValueOnce(0).mockReturnValueOnce(0.11); // [0, 1]
      mockRandom.mockReturnValueOnce(0.99); // [0, 0]
      mockRandom.mockReturnValueOnce(0.33); // [0, 2]
      mockBoard.getSquareInfo
        .mockReturnValueOnce(null)
        .mockReturnValueOnce("miss")
        .mockReturnValueOnce(null)
        .mockReturnValueOnce("hit")
        .mockReturnValue(null);
      T.generateMove(mockBoard);
      T.generateMove(mockBoard);
      const R = T.generateMove(mockBoard);
      expect(R[0]).toBe(0);
      expect(R[1]).toBe(2);
    });
  });
});
