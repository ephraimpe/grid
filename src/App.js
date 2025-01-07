import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import "./App.css";

const App = () => {
  const [availableLetters, setAvailableLetters] = useState([
    "E", "E", "E", "G", "I", "N", "N", "O",
    "O", "R", "R", "T", "T", "U", "U", "A",
  ]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [grid, setGrid] = useState(Array(5).fill(Array(5).fill("")));
  const [selectedCell, setSelectedCell] = useState([0, 0]);

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
            setSelectedCell([Math.max(row - 1, 0), col]);
            break;
          case "ArrowDown":
            setSelectedCell([Math.min(row + 1, 4), col]);
            break;
          case "ArrowLeft":
            setSelectedCell([row, Math.max(col - 1, 0)]);
            break;
          case "ArrowRight":
            setSelectedCell([row, Math.min(col + 1, 4)]);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCell]);

  const handlePlaceLetter = (letter) => {
    const [row, col] = selectedCell;

    // Update the grid with the new letter
    const newGrid = grid.map((gridRow, rowIndex) =>
      rowIndex === row
        ? gridRow.map((cell, colIndex) => (colIndex === col ? letter : cell))
        : gridRow
    );
    setGrid(newGrid);

    // Mark the letter as used
    if (!usedLetters.includes(letter)) {
      setUsedLetters([...usedLetters, letter]);
    }

    // Move to the next cell automatically
    if (col < 4) {
      setSelectedCell([row, col + 1]);
    } else if (row < 4) {
      setSelectedCell([row + 1, 0]);
    }
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

    // Remove the letter from the used list if no other cells are using it
    const isStillUsed = newGrid.some((gridRow) =>
      gridRow.includes(letterToClear)
    );
    if (!isStillUsed) {
      setUsedLetters(usedLetters.filter((letter) => letter !== letterToClear));
    }
  };

  const isLetterUsed = (letter) => usedLetters.includes(letter);

  return (
    <div className="App">
      <h1>GRID</h1>
      <div className="letter-pool">
        {availableLetters.map((letter, index) => (
          <span
            key={index}
            className={`letter ${isLetterUsed(letter) ? "used" : ""}`}
          >
            {letter}
          </span>
        ))}
      </div>
      <Grid
        grid={grid}
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
      />
      <button className="check-button">Check</button>
      <Keyboard
        handlePlaceLetter={handlePlaceLetter}
        handleClear={() => handleClearCell(...selectedCell)}
      />
    </div>
  );
};

export default App;
