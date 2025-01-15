import React, { useState, useEffect } from "react";
import Keyboard from "./Keyboard";
import "./App.css";

const App = () => {
  const [availableLetters, setAvailableLetters] = useState([
    { letter: "E", used: 0 },
    { letter: "E", used: 0 },
    { letter: "E", used: 0 },
    { letter: "G", used: 0 },
    { letter: "I", used: 0 },
    { letter: "N", used: 0 },
    { letter: "N", used: 0 },
    { letter: "O", used: 0 },
    { letter: "O", used: 0 },
    { letter: "R", used: 0 },
    { letter: "R", used: 0 },
    { letter: "T", used: 0 },
    { letter: "T", used: 0 },
    { letter: "U", used: 0 },
    { letter: "U", used: 0 },
    { letter: "A", used: 0 },
  ]);
  const [grid, setGrid] = useState(
    Array(5)
      .fill(null)
      .map(() => Array(5).fill(""))
  );
  const [selectedCell, setSelectedCell] = useState([0, 0]);

  const blackCells = [
    [1, 1],
    [1, 3],
    [3, 1],
    [3, 3],
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedCell) return;
      const [row, col] = selectedCell;

      const isLetter = /^[A-Z]$/i.test(event.key);
      const isDelete = event.key === "Backspace" || event.key === "Delete";

      if (isLetter) {
        handlePlaceLetter(event.key.toUpperCase());
      } else if (isDelete) {
        handleClearCell(row, col);
      } else {
        switch (event.key) {
          case "ArrowUp":
            navigateGrid(-1, 0);
            break;
          case "ArrowDown":
            navigateGrid(1, 0);
            break;
          case "ArrowLeft":
            navigateGrid(0, -1);
            break;
          case "ArrowRight":
            navigateGrid(0, 1);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell]);

  const navigateGrid = (rowDelta, colDelta) => {
    let [row, col] = selectedCell;
    do {
      row = Math.max(0, Math.min(4, row + rowDelta));
      col = Math.max(0, Math.min(4, col + colDelta));
    } while (blackCells.some(([r, c]) => r === row && c === col));
    setSelectedCell([row, col]);
  };

  const handlePlaceLetter = (letter) => {
    const [row, col] = selectedCell;
    if (blackCells.some(([r, c]) => r === row && c === col)) return;

    // Update the grid with the new letter
    const newGrid = grid.map((gridRow, rowIndex) =>
      rowIndex === row
        ? gridRow.map((cell, colIndex) => (colIndex === col ? letter : cell))
        : gridRow
    );
    setGrid(newGrid);

    // Mark one instance of the letter as used
    const newAvailableLetters = [...availableLetters];
    const letterIndex = newAvailableLetters.findIndex(
      (l) => l.letter === letter && l.used === 0
    );
    if (letterIndex !== -1) {
      newAvailableLetters[letterIndex].used = 1;
    }
    setAvailableLetters(newAvailableLetters);

    // Move to the next cell automatically
    navigateGrid(0, 1);
  };

  const handleClearCell = (row, col) => {
    const letterToClear = grid[row][col];
    if (!letterToClear) return;

    // Clear the cell
    const newGrid = grid.map((gridRow, rowIndex) =>
      rowIndex === row
        ? gridRow.map((cell, colIndex) => (colIndex === col ? "" : cell))
        : gridRow
    );
    setGrid(newGrid);

    // Mark one instance of the cleared letter as available
    const newAvailableLetters = [...availableLetters];
    const letterIndex = newAvailableLetters.findIndex(
      (l) => l.letter === letterToClear && l.used === 1
    );
    if (letterIndex !== -1) {
      newAvailableLetters[letterIndex].used = 0;
    }
    setAvailableLetters(newAvailableLetters);
  };

  return (
    <div className="App">
      <h1>GRID</h1>
      <div className="letter-pool">
        {availableLetters.map((letterObj, index) => (
          <span
            key={index}
            className={`letter ${letterObj.used === 1 ? "used" : ""}`}
          >
            {letterObj.letter}
          </span>
        ))}
      </div>
      <div className="grid">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isBlackCell = blackCells.some(
              ([r, c]) => r === rowIndex && c === colIndex
            );
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`grid-cell ${
                  isBlackCell
                    ? "black-cell"
                    : selectedCell[0] === rowIndex &&
                      selectedCell[1] === colIndex
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  if (!isBlackCell) setSelectedCell([rowIndex, colIndex]);
                }}
              >
                {!isBlackCell && cell}
              </div>
            );
          })
        )}
      </div>
      <Keyboard
        handlePlaceLetter={handlePlaceLetter}
        handleClear={() => handleClearCell(...selectedCell)}
      />
    </div>
  );
};

export default App;
