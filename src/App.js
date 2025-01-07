import React, { useState, useEffect } from "react";
import Grid from "./Grid";
import Keyboard from "./Keyboard";
import "./App.css";

const App = () => {
  const [availableLetters, setAvailableLetters] = useState([
    "E", "E", "E", "G", "I", "N", "N", "O", "O", "R", "R", "T", "T", "U", "U",
  ]);
  const [grid, setGrid] = useState(Array(5).fill(Array(5).fill("")));
  const [selectedCell, setSelectedCell] = useState([0, 0]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!selectedCell) return;
      const [row, col] = selectedCell;

      const isLetter = /^[A-Z]$/i.test(event.key); // Check if the key is a letter
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

    // Remove the previous letter from the grid and make it available again
    const previousLetter = grid[row][col];
    if (previousLetter) {
      updateAvailableLetters(previousLetter, true);
    }

    // Check if the letter is in the available pool
    const letterIndex = availableLetters.indexOf(letter);
    if (letterIndex === -1) return;

    // Update the grid
    const newGrid = grid.map((gridRow, rowIndex) =>
      rowIndex === row
        ? gridRow.map((cell, colIndex) => (colIndex === col ? letter : cell))
        : gridRow
    );
    setGrid(newGrid);

    // Update available letters by blanking out the used letter
    updateAvailableLetters(letter, false);
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

    // Add the cleared letter back to available letters
    updateAvailableLetters(letterToClear, true);
  };

  const updateAvailableLetters = (letter, add) => {
    const newAvailableLetters = [...availableLetters];
    if (add) {
      const emptyIndex = newAvailableLetters.indexOf("");
      if (emptyIndex !== -1) {
        newAvailableLetters[emptyIndex] = letter;
      } else {
        newAvailableLetters.push(letter);
      }
    } else {
      const letterIndex = newAvailableLetters.indexOf(letter);
      if (letterIndex !== -1) {
        newAvailableLetters[letterIndex] = "";
      }
    }
    setAvailableLetters(newAvailableLetters);
  };

  return (
    <div className="App">
      <h1>GRID</h1>
      <div className="letter-pool">
        {availableLetters.map((letter, index) => (
          <span key={index} className="letter">
            {letter || " "}
          </span>
        ))}
      </div>
      <Grid
        grid={grid}
        setGrid={setGrid}
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
      />
      <button className="check-button">Check</button>
      <Keyboard handlePlaceLetter={handlePlaceLetter} />
    </div>
  );
};

export default App;
