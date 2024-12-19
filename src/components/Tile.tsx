import React from 'react';

interface TileProps {
  tile: {
    row: number;
    col: number;
    state: string;
  };
  setGrid: React.Dispatch<React.SetStateAction<any[][]>>;
  grid: any[][];
}

function Tile({ tile, setGrid, grid }: TileProps) {
  const { row, col, state } = tile;

  const handleClick = () => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      const newTile = { ...newGrid[row][col] };

      // Toggle between regular and blocked state
      newTile.state = newTile.state === 'regular' ? 'blocked' : 'regular';
      newGrid[row][col] = newTile;

      return newGrid;
    });
  };

  const getTileClass = () => {
    switch (state) {
      case 'blocked':
        return 'tile blocked';
      case 'start':
        return 'tile start';
      case 'end':
        return 'tile end';
      default:
        return 'tile regular';
    }
  };

  return <div className={getTileClass()} onClick={handleClick}></div>;
}

export default Tile;
