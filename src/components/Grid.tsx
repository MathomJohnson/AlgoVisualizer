// import React, { useState } from "react";
// import { bfs } from "../algorithms/bfs";
// import { dfs } from "../algorithms/dfs";
// import Tile from "./Tile";

// export interface Tile {
//   row: number;
//   col: number;
//   isStart: boolean;
//   isEnd: boolean;
//   isWall: boolean;
//   isVisited: boolean;
//   isFrontier: boolean;
//   isPath: boolean,
//   distance: number;
//   previousTile?: Tile | null;
// }

// const Grid: React.FC = () => {
//   const rows = 20;
//   const cols = 20;

//   const [grid, setGrid] = useState<Tile[][]>(
//     Array.from({ length: rows }, (_, row) =>
//       Array.from({ length: cols }, (_, col) => ({
//         row,
//         col,
//         isStart: false,
//         isEnd: false,
//         isWall: false,
//         isVisited: false,
//         isFrontier: false,
//         isPath: false,
//         distance: Infinity,
//         previousTile: null,
//       }))
//     )
//   );

//   const [mode, setMode] = useState<"start" | "end" | "placingWall" | null>(null);

//   // To store the start and end tiles
//   const [startTile, setStartTile] = useState<Tile | null>(null);
//   const [endTile, setEndTile] = useState<Tile | null>(null);

//   // Wall Placing
//   //const [placingWall, setPlacingWall] = useState<true | false>(false);


//   const handleTileClick = (row: number, col: number) => {
//     setGrid((prevGrid) => {
//       const newGrid = prevGrid.map((r) => r.map((tile) => ({ ...tile })));
//       const tile = newGrid[row][col];

//       // Log the tile state for debugging purposes
//       console.log(`Tile clicked at row ${row}, col ${col}`);
//       console.log('Tile state:', tile);

//       if (mode === "start") {
//         if (startTile) newGrid[startTile.row][startTile.col].isStart = false;
//         tile.isStart = true;
//         setStartTile(tile); // Store the start tile
//         setMode(null);
//       } else if (mode === "end") {
//         if (endTile) newGrid[endTile.row][endTile.col].isEnd = false;
//         tile.isEnd = true;
//         setEndTile(tile); // Store the end tile
//         setMode(null);
//       } else if (mode === "placingWall") {
//         tile.isWall = !tile.isWall;
//       }

//       return newGrid;
//     });
//   };

//   // Trigger BFS or DFS
//   const handleSearch = async (algorithm: "bfs" | "dfs") => {
//     if (!startTile || !endTile) return;
  
//     console.log(`Running ${algorithm}...`);
  
//     if (algorithm === "bfs") {
//       await bfs(grid, startTile, endTile, setGrid);
//     } else {
//       await dfs(grid, startTile, endTile, setGrid);
//     }
//   };
  
  

//   return (
//     <div>
//       <div>
//         <button onClick={() => setMode("start")}>Set Start</button>
//         <button onClick={() => setMode("end")}>Set End</button>
//         <button onClick={() => setMode("placingWall")}>Enter Wall Placing</button>
//         <button onClick={() => setMode(null)}>Exit Wall Placing</button>
//         <button onClick={() => handleSearch("bfs")}>Run BFS</button>
//         <button onClick={() => handleSearch("dfs")}>Run DFS</button>
//       </div>
//       <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 20px)` }}>
//         {grid.map((row) =>
//           row.map((tile) => (
//             <Tile
//               key={`${tile.row}-${tile.col}`}
//               tile={tile}
//               onClick={() => handleTileClick(tile.row, tile.col)}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Grid;

import React, { useState, useEffect } from "react";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import Tile from "./Tile";
import "./Grid.css"; // Import CSS file

export interface Tile {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isFrontier: boolean;
  isPath: boolean;
  distance: number;
  previousTile?: Tile | null;
}

const Grid: React.FC = () => {
  const rows = 20;
  const [cols, setCols] = useState<number>(Math.floor(window.innerWidth / 30));
  const [grid, setGrid] = useState<Tile[][]>([]);

  const [mode, setMode] = useState<"start" | "end" | "placingWall" | null>(null);
  const [startTile, setStartTile] = useState<Tile | null>(null);
  const [endTile, setEndTile] = useState<Tile | null>(null);

  // Initialize the grid
  useEffect(() => {
    const newCols = Math.floor(window.innerWidth / 30);
    setCols(newCols);
    setGrid(
      Array.from({ length: rows }, (_, row) =>
        Array.from({ length: newCols }, (_, col) => ({
          row,
          col,
          isStart: false,
          isEnd: false,
          isWall: false,
          isVisited: false,
          isFrontier: false,
          isPath: false,
          distance: Infinity,
          previousTile: null,
        }))
      )
    );
  }, []);

  // Handle window resize to adjust the number of columns dynamically
  useEffect(() => {
    const handleResize = () => {
      const newCols = Math.floor(window.innerWidth / 30);
      setCols(newCols);
      setGrid((prevGrid) =>
        Array.from({ length: rows }, (_, row) =>
          Array.from({ length: newCols }, (_, col) =>
            prevGrid[row]?.[col] ?? {
              row,
              col,
              isStart: false,
              isEnd: false,
              isWall: false,
              isVisited: false,
              isFrontier: false,
              isPath: false,
              distance: Infinity,
              previousTile: null,
            }
          )
        )
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTileClick = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((tile) => ({ ...tile })));
      const tile = newGrid[row][col];

      if (mode === "start") {
        if (startTile) newGrid[startTile.row][startTile.col].isStart = false;
        tile.isStart = true;
        setStartTile(tile);
        setMode(null);
      } else if (mode === "end") {
        if (endTile) newGrid[endTile.row][endTile.col].isEnd = false;
        tile.isEnd = true;
        setEndTile(tile);
        setMode(null);
      } else if (mode === "placingWall") {
        tile.isWall = !tile.isWall;
      }

      return newGrid;
    });
  };

  const handleSearch = async (algorithm: "bfs" | "dfs") => {
    if (!startTile || !endTile) return;

    if (algorithm === "bfs") {
      await bfs(grid, startTile, endTile, setGrid);
    } else {
      await dfs(grid, startTile, endTile, setGrid);
    }
  };

  return (
    <div style = {{ height: "100%", width: "100%" }}>
      <div className="toolbar">
        <h1>Search Algorithm Visualizer</h1>
        <div className="buttons">
          <button onClick={() => setMode("start")}>Set Start</button>
          <button onClick={() => setMode("end")}>Set End</button>
          <button onClick={() => setMode("placingWall")}>Walls</button>
          <button onClick={() => handleSearch("bfs")}>Run BFS</button>
          <button onClick={() => handleSearch("dfs")}>Run DFS</button>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {grid.map((row) =>
          row.map((tile) => (
            <Tile
              key={`${tile.row}-${tile.col}`}
              tile={tile}
              onClick={() => handleTileClick(tile.row, tile.col)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
