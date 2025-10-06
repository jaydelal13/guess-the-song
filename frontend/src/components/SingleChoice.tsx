import React, { useState, useEffect } from "react";
import "../css/GuessSong.css";
import PlayIcon from "../assets/Play.png";
import { songService } from "../services/songServices";
import type { Song } from "../types/song";

interface UnifiedChoiceProps {
  onCorrectGuess: () => void;
  currentSong: Song | null;
  hasGuessedCorrectly: boolean;
  onWrongGuess?: () => void;
  mode: 'title' | 'artist'; // NEW: Determines what to guess
}

const UnifiedChoice: React.FC<UnifiedChoiceProps> = ({
  onCorrectGuess,
  currentSong,
  hasGuessedCorrectly,
  onWrongGuess,
  mode, // NEW: mode prop
}) => {
  const [guess, setGuess] = useState("");
  const [showWrongMessage, setShowWrongMessage] = useState(false);

  /** Create a masked version of text (blanks only, no punctuation/featuring info) */
  const createBlanks = (text: string): string => {
    let mainText = text
      .replace(/\s*\([^)]*\)/g, "")
      .replace(/\s*feat\.?\s+.*/gi, "")
      .replace(/\s*ft\.?\s+.*/gi, "")
      .replace(/\s*featuring\s+.*/gi, "")
      .trim();

    const cleanText = mainText
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return cleanText
      .split(" ")
      .filter(Boolean)
      .map(word => "_".repeat(word.length))
      .join("   ");
  };

  /** Normalize text for comparison */
  const normalizeForComparison = (text: string): string => {
    return text
      .replace(/\s*\([^)]*\)/g, "")
      .replace(/\s*feat\.?\s+.*/gi, "")
      .replace(/\s*ft\.?\s+.*/gi, "")
      .replace(/\s*featuring\s+.*/gi, "")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  };

  useEffect(() => {
    setGuess("");
    setShowWrongMessage(false);
  }, [currentSong]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuess(e.target.value);
  };

  /** Check guess against the target (title or artist based on mode) */
  const handleSubmitGuess = () => {
    if (!currentSong || hasGuessedCorrectly) return;

    const normalizedGuess = normalizeForComparison(guess);
    const target = mode === 'title' ? currentSong.title : currentSong.artist;
    const normalizedTarget = normalizeForComparison(target);

    if (normalizedGuess === normalizedTarget) {
      onCorrectGuess();
    } else {
      setShowWrongMessage(true);
      onWrongGuess?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !hasGuessedCorrectly) {
      handleSubmitGuess();
    }
  };

  // Determine what to show and what to blank based on mode
  const getDisplayContent = () => {
    if (!currentSong) return { blanked: "Loading...", shown: "" };
    
    if (mode === 'title') {
      return {
        blanked: `TITLE: ${createBlanks(currentSong.title)}`,
        shown: `ARTIST: ${currentSong.artist}`,
      };
    } else {
      return {
        blanked: `ARTIST: ${createBlanks(currentSong.artist)}`,
        shown: `TITLE: ${currentSong.title}`,
      };
    }
  };

  const { blanked, shown } = getDisplayContent();

  return (
    <div className="music-guess-game">
      {/* Blanked content (what user needs to guess) */}
      <div className="artist-label">
        <h1>{blanked}</h1>
      </div>

      {/* Shown content (hint) */}
      <div className="artist-label artist-label--spacing">
        <h2 className="artist-text">{shown}</h2>
      </div>

      {/* Play song button */}
      <div className="central-circle-container">
        <button
          className="central-circle"
          onClick={() => songService.playSong()}
        >
          <img src={PlayIcon} className="circle-image" alt="Play button" />
        </button>
      </div>

      {/* Guess input */}
      <div className="input-container">
        <input
          type="text"
          value={guess}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={
            hasGuessedCorrectly
              ? "CORRECT! WAIT FOR NEXT ROUND..."
              : "TYPE YOUR GUESS HERE..."
          }
          className="guess-input"
          disabled={hasGuessedCorrectly}
        />
      </div>

      {/* Submit + feedback */}
      <div className="controls">
        <button
          onClick={handleSubmitGuess}
          disabled={hasGuessedCorrectly}
          className={`submit-btn ${hasGuessedCorrectly ? "submit-btn--disabled" : ""}`}
        >
          {hasGuessedCorrectly ? "Correct! ✅" : "Submit Guess"}
        </button>

        {/* Show wrong guess feedback */}
        {showWrongMessage && !hasGuessedCorrectly && (
          <div className="wrong-message">Try again! 🤔</div>
        )}
      </div>
    </div>
  );
};

export default UnifiedChoice;