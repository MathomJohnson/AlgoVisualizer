import { Tile } from "../components/Grid";

export const dfs = async (
  grid: Tile[][],
  start: Tile,
  end: Tile,
  setGrid: React.Dispatch<React.SetStateAction<Tile[][]>>
): Promise<void> => {
  const stack: Tile[] = [start];
  const visited: Set<string> = new Set();

  // Initialize distances and previous tile information
  grid.forEach((row) =>
    row.forEach((tile) => {
      tile.distance = Infinity;
      tile.previousTile = null;
      tile.isVisited = false;
      tile.isFrontier = false;
    })
  );

  while (stack.length > 0) {
    const tile = stack.pop()!;
    tile.isVisited = true;

    if (tile.isEnd) {
      console.log("End tile found!");
      break; // Found the end
    }

    // Update grid state to reflect the visited tile
    setGrid([...grid]);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Add delay (100ms)

    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
    ];

    for (const { row, col } of directions) {
      const neighborRow = tile.row + row;
      const neighborCol = tile.col + col;

      if (
        neighborRow >= 0 &&
        neighborRow < grid.length &&
        neighborCol >= 0 &&
        neighborCol < grid[0].length
      ) {
        const neighbor = grid[neighborRow][neighborCol];

        if (!visited.has(`${neighbor.row},${neighbor.col}`) && !neighbor.isWall) {
          neighbor.isFrontier = true;
          visited.add(`${neighbor.row},${neighbor.col}`);
          neighbor.previousTile = tile;
          stack.push(neighbor);

          // Update grid state to reflect the frontier tiles
          setGrid([...grid]);
          await new Promise((resolve) => setTimeout(resolve, 100)); // Add delay (100ms)
        }
      }
    }
  }

  console.log("Pathfinding complete!");
};
