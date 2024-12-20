import React, { useState } from "react";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import Tile from "./Tile";

export interface Tile {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isFrontier: boolean;
  isPath: boolean,
  distance: number;
  previousTile?: Tile | null;
}

const Grid: React.FC = () => {
  const rows = 20;
  const cols = 20;

  const [grid, setGrid] = useState<Tile[][]>(
    Array.from({ length: rows }, (_, row) =>
      Array.from({ length: cols }, (_, col) => ({
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

  const [mode, setMode] = useState<"start" | "end" | null>(null);

  // To store the start and end tiles
  const [startTile, setStartTile] = useState<Tile | null>(null);
  const [endTile, setEndTile] = useState<Tile | null>(null);

  const handleTileClick = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((r) => r.map((tile) => ({ ...tile })));
      const tile = newGrid[row][col];

      // Log the tile state for debugging purposes
      console.log(`Tile clicked at row ${row}, col ${col}`);
      console.log('Tile state:', tile);

      if (mode === "start") {
        if (startTile) newGrid[startTile.row][startTile.col].isStart = false;
        tile.isStart = true;
        setStartTile(tile); // Store the start tile
        setMode(null);
      } else if (mode === "end") {
        if (endTile) newGrid[endTile.row][endTile.col].isEnd = false;
        tile.isEnd = true;
        setEndTile(tile); // Store the end tile
        setMode(null);
      }

      return newGrid;
    });
  };

  // Trigger BFS or DFS
  const handleSearch = async (algorithm: "bfs" | "dfs") => {
    if (!startTile || !endTile) return;
  
    console.log(`Running ${algorithm}...`);
  
    if (algorithm === "bfs") {
      await bfs(grid, startTile, endTile, setGrid);
    } else {
      await dfs(grid, startTile, endTile, setGrid);
    }
  };
  
  

  return (
    <div>
      <div>
        <button onClick={() => setMode("start")}>Set Start</button>
        <button onClick={() => setMode("end")}>Set End</button>
        <button onClick={() => handleSearch("bfs")}>Run BFS</button>
        <button onClick={() => handleSearch("dfs")}>Run DFS</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 20px)` }}>
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
