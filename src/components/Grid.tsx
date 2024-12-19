import React from 'react';
import Tile from './Tile';

interface GridProps {
  rows: number;
  cols: number;
}

function Grid({ rows, cols }: GridProps) {
  const initialGrid = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      state: 'regular', // Default state
    }))
  );

  const [grid, setGrid] = React.useState(initialGrid);

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div className="grid-row" key={rowIndex}>
          {row.map(tile => (
            <Tile
              key={`${tile.row}-${tile.col}`}
              tile={tile}
              setGrid={setGrid}
              grid={grid}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;

