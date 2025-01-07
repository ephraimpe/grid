import React from "react";

const qwertyLayout = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

const Keyboard = ({ handlePlaceLetter, handleClear }) => {
  return (
    <div className="keyboard">
      {qwertyLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className="key"
              onClick={() => handlePlaceLetter(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <button className="key delete" onClick={handleClear}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
