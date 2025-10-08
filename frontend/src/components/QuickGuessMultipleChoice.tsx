import React from "react";
import "../css/MultipleChoice.css";
import songIcon from "../assets/song-icon.png";

interface QuickGuessMultipleChoiceProps {
  options: string[];
  onSelect: (index: number) => void;
  selectedIndex: number | null;
  correctAnswer: string;
  showCorrectAnswer: boolean;
  hasPlayedSnippet: boolean;
  snippetDuration?: number;
}

const QuickGuessMultipleChoice: React.FC<QuickGuessMultipleChoiceProps> = ({
  options,
  onSelect,
  selectedIndex,
  correctAnswer,
  showCorrectAnswer,
  hasPlayedSnippet,
  snippetDuration = 3,
}) => {
  const getButtonClass = (index: number) => {
    let className = "answer-btn";

    if (selectedIndex === index) {
      if (showCorrectAnswer) {
        className += options[index] === correctAnswer ? " correct" : " wrong";
      } else {
        className += " selected";
      }
    }

    if (selectedIndex !== null && selectedIndex !== index) {
      className += " disabled";
      if (showCorrectAnswer && options[index] === correctAnswer) {
        className += " correct";
      }
    }

    return className;
  };

  const handleButtonClick = (index: number) => {
    if (selectedIndex === null && hasPlayedSnippet) {
      onSelect(index);
    }
  };

  return (
    <div className="choose-song-container">
      {!hasPlayedSnippet ? (
        <div className="status-message waiting">
          🎵 Get ready! A {snippetDuration}-second snippet will play automatically...
        </div>
      ) : (
        <h2>SONG:</h2>
      )}

      <div className="song-icon">
        <img src={songIcon} alt="Song Icon" />
      </div>

      <div className="answer-buttons">
        {options.map((option, index) => (
          <button
            key={option}
            type="button"
            className={getButtonClass(index)}
            onClick={() => handleButtonClick(index)}
            disabled={!hasPlayedSnippet || (selectedIndex !== null && selectedIndex !== index)}
            aria-pressed={selectedIndex === index}
          >
            {`${index + 1}. ${option}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickGuessMultipleChoice;