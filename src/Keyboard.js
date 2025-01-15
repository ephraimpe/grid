import React from "react";
import "./Keyboard.css";

const Keyboard = ({ handlePlaceLetter, handleClear }) => {
  const keys = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const handleKeyClick = (key) => {
    if (key === "DELETE") {
      handleClear();
    } else {
      handlePlaceLetter(key);
    }
  };

  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className="key"
              onClick={() => handleKeyClick(key)}
            >
              {key}
            </button>
          ))}
          {rowIndex === 2 && (
            <button
              className="key delete-key"
              onClick={() => handleKeyClick("DELETE")}
            >
              DELETE
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
