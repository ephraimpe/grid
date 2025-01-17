import React, { useState, useEffect } from "react";
import Keyboard from "./Keyboard";
import "./App.css";

const App = () => {
  const [availableLetters, setAvailableLetters] = useState([
    { id: 1, letter: "E", used: 0 },
    { id: 2, letter: "E", used: 0 },
    { id: 3, letter: "E", used: 0 },
    { id: 4, letter: "G", used: 0 },
    { id: 5, letter: "I", used: 0 },
    { id: 6, letter: "N", used: 0 },
    { id: 7, letter: "N", used: 0 },
    { id: 8, letter: "O", used: 0 },
    { id: 9, letter: "O", used: 0 },
    { id: 10, letter: "R", used: 0 },
    { id: 11, letter: "R", used: 0 },
    { id: 12, letter: "T", used: 0 },
    { id: 13, letter: "T", used: 0 },
    { id: 14, letter: "U", used: 0 },
    { id: 15, letter: "U", used: 0 },
    { id: 16, letter: "A", used: 0 },
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
  
    if (blackCells.some(([r, c]) => r === row && c === col) || grid[row][col]) return;
  
    // Find the first unused instance of the letter
    const letterIndex = availableLetters.findIndex(
      (l) => l.letter === letter && l.used === 0
    );
  
    if (letterIndex === -1) return; // If no unused instance is found, do nothing
  
    const letterToPlace = availableLetters[letterIndex];
  
    // Place the letter with its ID into the grid
    const newGrid = grid.map((gridRow, rowIndex) =>
      rowIndex === row
        ? gridRow.map((cell, colIndex) =>
            colIndex === col ? { letter: letterToPlace.letter, id: letterToPlace.id } : cell
          )
        : gridRow
    );
    setGrid(newGrid);
  
    // Mark the letter as used
    const newAvailableLetters = [...availableLetters];
    newAvailableLetters[letterIndex].used = 1;
    setAvailableLetters(newAvailableLetters);
  
    // Move to the next cell
    navigateGrid(0, 1);
  };  

  const handleClearCell = (row, col) => {
    const cell = grid[row][col];
    if (!cell) return; // If the cell is empty, do nothing
  
    const { letter, id } = cell;
  
    // Clear the cell
    const newGrid = grid.map((gridRow, rowIndex) =>
      rowIndex === row
        ? gridRow.map((cell, colIndex) => (colIndex === col ? "" : cell))
        : gridRow
    );
    setGrid(newGrid);
  
    // Mark the specific instance of the letter as available
    const newAvailableLetters = [...availableLetters];
    const letterIndex = newAvailableLetters.findIndex((l) => l.id === id);
  
    if (letterIndex !== -1) {
      newAvailableLetters[letterIndex].used = 0;
    }
    setAvailableLetters(newAvailableLetters);

      // Move to the next cell
      navigateGrid(0, -1);
  };
  
  return (
    <div className="App">
      <h1>GRID</h1>
  
      {/* Render Available Letters */}
      <div className="letter-pool">
        {availableLetters.map((letterObj) => (
          <span
            key={letterObj.id} // Use `id` as the unique key
            className={`letter ${letterObj.used === 1 ? "used" : ""}`}
          >
            {letterObj.letter}
          </span>
        ))}
      </div>
  
      {/* Render Grid */}
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
                {/* If the cell contains an object, display the `letter` property */}
                {!isBlackCell && cell ? cell.letter : ""}
              </div>
            );
          })
        )}
      </div>
  
      {/* Keyboard Component */}
      <Keyboard
        handlePlaceLetter={handlePlaceLetter}
        handleClear={() => handleClearCell(...selectedCell)}
      />
    </div>
  );  
};

export default App;
