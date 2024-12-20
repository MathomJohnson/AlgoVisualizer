import { Tile } from "../components/Grid";

export const dfs = (grid: Tile[][], start: Tile, end: Tile): Tile[][] => {
    const stack: Tile[] = [start];
    const visited: Set<string> = new Set();
  
    // Initialize distances and previous tile information
    grid.forEach((row) => row.forEach((tile) => {
      tile.distance = Infinity;
      tile.previousTile = null;
    }));
  
    while (stack.length > 0) {
      const tile = stack.pop()!;
      console.log(`Visiting tile at (${tile.row}, ${tile.col}) with distance: ${tile.distance}`);
      if (tile.isEnd) {
        console.log("End tile found!");
        break; // Found the end
      }
  
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
  
          if (
            !visited.has(`${neighbor.row},${neighbor.col}`) &&
            !neighbor.isWall
          ) {
            console.log(`Adding neighbor at (${neighbor.row}, ${neighbor.col}) to the stack`);
            visited.add(`${neighbor.row},${neighbor.col}`);
            neighbor.previousTile = tile;
            stack.push(neighbor);
          }
        }
      }
    }
  
    // Backtrack to find the path
    let currentTile = end;
    const path: Tile[] = [];
    while (currentTile && currentTile.previousTile) {
      path.unshift(currentTile); // Add current tile to the beginning of the path
      currentTile = currentTile.previousTile;
    }
  
    console.log("Path found:", path.map((tile) => `(${tile.row}, ${tile.col})`));
  
    return grid; // Return updated grid
  };