import React from "react";

const Grid = ({ grid, selectedCell, setSelectedCell }) => {
  const handleCellClick = (row, col) => {
    setSelectedCell([row, col]);
  };

  return (
    <div className="grid">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="grid-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`grid-cell ${
                selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
