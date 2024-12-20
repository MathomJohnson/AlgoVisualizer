import React from "react";
import { Tile as TileType } from "./Grid";  // Import the Tile interface from Grid

// Define the props expected by the Tile component
interface TileProps {
  tile: TileType;    // Pass the tile object as a prop
  onClick: () => void;  // Function to handle click
}

const Tile: React.FC<TileProps> = ({ tile, onClick }) => {
  // Function to get the background color based on tile state
  const getBackgroundColor = (): string => {
    if (tile.isStart) return "green"; // Start tile
    if (tile.isEnd) return "red";     // End tile
    if (tile.isFrontier) return "#a9a9a9"; // Frontier tiles are blue
    if (tile.isVisited) return "#5a5a5a"; // Visited tiles are light gray
    if (tile.isWall) return "black";  // Wall tile
    if (tile.isPath) return "yellow"; // Highlight the shortest path
    return "white";                   // Default tile
  };

  return (
    <div
      onClick={onClick}  // Handle click event
      style={{
        width: 20,
        height: 20,
        backgroundColor: getBackgroundColor(),  // Set background color
        border: "1px solid black",  // Border for each tile
      }}
    ></div>
  );
};

export default Tile;
