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
    tile.isFrontier = false;
    visited.add(`${tile.row},${tile.col}`);

    if (tile.isEnd) {
      console.log("End tile found!");
      await showShortestPath(grid, tile, setGrid); // Call path visualization function
      break; // Found the end
    }

    // Update grid state to reflect the visited tile
    setGrid([...grid]);
    await new Promise((resolve) => setTimeout(resolve, 60)); // Add delay (100ms)

    const directions = [
      { row: 0, col: -1 },
      { row: 1, col: 0 },
      { row: 0, col: 1 },
      { row: -1, col: 0 },
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
          
          // If the neighbor is already in the stack, remove it
          const indexInStack = stack.findIndex(
            (stackTile) => stackTile.row === neighbor.row && stackTile.col === neighbor.col
          );

          if (indexInStack !== -1) {
            stack.splice(indexInStack, 1); // Remove it from the stack
          }

          neighbor.isFrontier = true;
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


const showShortestPath = async (
  grid: Tile[][],
  end: Tile,
  setGrid: React.Dispatch<React.SetStateAction<Tile[][]>>
): Promise<void> => {
  let currentTile: Tile | null = end;

  while (currentTile && currentTile.previousTile) {
    currentTile.isPath = true; // Mark this tile as part of the path
    currentTile.isVisited = false;
    currentTile.isFrontier = false;

    // Update grid to reflect the path visually
    setGrid([...grid]);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Add delay for visualization

    currentTile = currentTile.previousTile; // Move to the previous tile
  }
};