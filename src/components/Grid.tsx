import React, { useState, useEffect } from "react";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";
import { aStar } from "../algorithms/aStar";
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
  const toolbarHeightVh = 18; // Toolbar height in vh

  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(Math.floor(window.innerWidth / 30));
  const [grid, setGrid] = useState<Tile[][]>([]);

  const [mode, setMode] = useState<"start" | "end" | "placingWall" | null>(null);
  const [startTile, setStartTile] = useState<Tile | null>(null);
  const [endTile, setEndTile] = useState<Tile | null>(null);
  const [selectedAlgo, setSelectedAlgo] = useState<"bfs" | "dfs" | "aStar" | "">(""); // State for selected algorithm

  const canRunAlgorithm = startTile !== null && endTile !== null && selectedAlgo !== "";

  const [isVisualized, setIsVisualized] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Initialize the grid
  useEffect(() => {
    const newCols = Math.floor(window.innerWidth / 30);
    const newRows = Math.floor((window.innerHeight - window.innerHeight * (toolbarHeightVh / 100)) / 30);
    setCols(newCols);
    setRows(newRows);
    setGrid(
      Array.from({ length: newRows }, (_, row) =>
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

  // Handle window resize to adjust the number of rows and columns dynamically
  useEffect(() => {
    const handleResize = () => {
      const newCols = Math.floor(window.innerWidth / 30);
      const newRows = Math.floor((window.innerHeight * (100 - toolbarHeightVh) / 100) / 30);
      setCols(newCols);
      setRows(newRows);
      setGrid((prevGrid) =>
        Array.from({ length: newRows }, (_, row) =>
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
      } else if (mode === null) {
        if (!tile.isStart && !tile.isEnd) {
          tile.isWall = !tile.isWall;
        }
      }

      return newGrid;
    });
  };

  const handleSearch = async (algorithm: "bfs" | "dfs" | "aStar") => {
    if (!startTile || !endTile) return;

    setIsRunning(true);
    setIsVisualized(true);

    try {
      if (algorithm === "bfs") {
        await bfs(grid, startTile, endTile, setGrid);
      } else if (algorithm === "dfs") {
        await dfs(grid, startTile, endTile, setGrid);
      } else if (algorithm === "aStar") {
        await aStar(grid, startTile, endTile, setGrid);
      } 
    } finally {
        // ADDED CODE START
        setIsRunning(false);
        // ADDED CODE END
      }
  };

  const handleClear = () => {
    if (isRunning) {
      alert("Cannot clear while algorithm is running!");
      return;
    }
    setGrid((prevGrid) => {
      // Create a new grid array to avoid mutating the original
      return prevGrid.map((row) =>
        row.map((tile) => ({
          ...tile,
          // Reset visualization states while preserving walls, start, and end positions
          isVisited: false,
          isFrontier: false, 
          isPath: false,
          distance: Infinity,
          previousTile: null
        }))
      );
    });
    setIsVisualized(false); // Reset visualization state
  };

  const handleReset = () => {
    if (isRunning) {
      alert("Cannot reset while algorithm is running!");
      return;
    }
    setGrid((prevGrid) => {
      return prevGrid.map((row) =>
        row.map((tile) => ({
          row: tile.row,
          col: tile.col,
          isStart: false,
          isEnd: false,
          isWall: false,
          isVisited: false,
          isFrontier: false, 
          isPath: false,
          distance: Infinity,
          previousTile: null
        }))
      );
    });
    setStartTile(null);
    setEndTile(null);
    setIsVisualized(false);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="toolbar" style={{ height: `${toolbarHeightVh}vh` }}>
        <h1 className="title">Search Algorithm Visualizer</h1>
        <div className="buttons">
          <button className="startButton" onClick={() => setMode("start")}>Set Start</button>
          <button className="endButton" onClick={() => setMode("end")}>Set End</button>
          <select
            value={selectedAlgo}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "bfs" || value === "dfs" || value === "aStar") {
                setSelectedAlgo(value);
              }
            }}
            className="algoSelect"
          >
            <option value="" disabled>Select Algorithm</option>
            <option value="bfs"><b>BFS</b></option>
            <option value="dfs"><b>DFS</b></option>
            <option value="aStar"><b>A*</b></option>
          </select>
          {!isVisualized ? (
            <button
              onClick={() => {
                if (canRunAlgorithm) {
                  handleSearch(selectedAlgo);
                } else {
                  alert("Please place start and end tiles and select an algorithm!");
                }
              }}
              className="runButton"
            >
              Run
            </button>
          ) : (
            <button
              onClick={handleClear}
              className="clearButton"
            >
              Clear
            </button>
          )}
          <button className="resetButton" onClick={handleReset}>Reset</button>
        </div>
      </div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`, // Adjust rows dynamically
        }}
      >
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
