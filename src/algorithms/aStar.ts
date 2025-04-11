// import { Tile } from "../components/Grid";

// export async function aStar(grid: Tile[][], start: Tile, end: Tile, setGrid: Function) {
//     const heuristic = (tile: Tile) =>
//       Math.abs(tile.row - end.row) + Math.abs(tile.col - end.col); // Manhattan Distance
  
//     const openSet = [start];
//     const closedSet = new Set<Tile>();
//     start.distance = 0;
  
//     while (openSet.length > 0) {
//       openSet.sort((a, b) => a.distance + heuristic(a) - (b.distance + heuristic(b))); // Sort by f(n) = g(n) + h(n)
//       const current = openSet.shift()!;
//       current.isVisited = true;
//       current.isFrontier = false;
  
//       if (current === end) break; // Found the final path!
  
//       closedSet.add(current);
  
//       const neighbors = [
//         [0, 1], [1, 0], [0, -1], [-1, 0] // 4-directional movement
//       ]
//         .map(([dr, dc]) => grid[current.row + dr]?.[current.col + dc])
//         .filter((neighbor) => neighbor && !neighbor.isWall && !closedSet.has(neighbor));
  
//       for (const neighbor of neighbors) {
//         const newDist = current.distance + neighbor.weight;
//         if (newDist < neighbor.distance) {
//           neighbor.distance = newDist;
//           neighbor.previousTile = current;
//           openSet.push(neighbor);
//           neighbor.isFrontier = true;
//         }
//       }
  
//       setGrid([...grid]); // Update grid visually
//       await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for animation
//     }
  
//     let path = end;
//     while (path.previousTile) {
//         path.isPath = true; // Mark as part of the path
//         path.isVisited = false; // Remove visited state for the final path
        
//         setGrid([...grid]); // Update the grid visually
//         await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for animation
        
//         path = path.previousTile; // Move to the previous tile
//       }
      
  
//     setGrid([...grid]);
//   }
  
import { Tile } from "../components/Grid";

export async function aStar(
  grid: Tile[][],
  start: Tile,
  end: Tile,
  setGrid: Function
) {
  const heuristic = (tile: Tile) =>
    Math.abs(tile.row - end.row) + Math.abs(tile.col - end.col); // Manhattan Distance

  const openSet = [start];
  const closedSet = new Set<Tile>();
  start.distance = 0; // g(n) for the start tile
  start.previousTile = null; // Start tile has no previous tile

  while (openSet.length > 0) {
    // Sort openSet by f(n) = g(n) + h(n)
    openSet.sort(
      (a, b) =>
        a.distance + heuristic(a) - (b.distance + heuristic(b))
    );
    const current = openSet.shift()!; // Get the tile with the lowest f(n)
    current.isVisited = true; // Mark the current tile as visited
    current.isFrontier = false;

    // If we've reached the end tile, stop searching
    if (current.row === end.row && current.col === end.col) {
      console.log("End tile found!");
      end = current;
      break;
    }

    closedSet.add(current);

    // Get valid neighbors
    const neighbors = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0], // 4-directional movement
    ]
      .map(([dr, dc]) => grid[current.row + dr]?.[current.col + dc])
      .filter(
        (neighbor) =>
          neighbor && // Neighbor exists
          !neighbor.isWall && // Not a wall
          !closedSet.has(neighbor) // Not already visited
          //!openSet.includes(neighbor) // Not already in the openSet
      );

    for (const neighbor of neighbors) {
      const newDist = current.distance + 1; // Increment g(n) by 1 for uniform-cost grid

      // If a shorter path to the neighbor is found, update it
      if (newDist < neighbor.distance) {
        neighbor.distance = newDist;
        neighbor.previousTile = current; // Set the previous tile to current
        openSet.push(neighbor);
        neighbor.isFrontier = true; // Mark as part of the frontier
      }
    }

    // Update grid visually
    setGrid([...grid]);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for animation
  }

  // Trace the final path from the end tile back to the start
  let path = end;
  if (path.previousTile === null) {
    console.log("No path found!");
    return; // If there is no path, exit
  }

  while (path.previousTile) {
    path.isPath = true; // Mark as part of the final path
    path.isVisited = false; // Remove visited state for the path

    setGrid([...grid]); // Update the grid visually
    await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for animation

    path = path.previousTile; // Move to the previous tile
  }

  setGrid([...grid]); // Final update to reflect the path
}

