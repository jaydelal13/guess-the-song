import React, { useEffect, useState } from "react";
import type { Song } from "../types/song";
import { songService } from "../services/songServices";
import PlayIcon from "../assets/Play.png";
import "../css/GuessSong.css";

interface GuessArtistChoiceProps {
    onCorrectGuess: () => void;
    currentSong: Song | null;
    hasGuessedCorrectly: boolean;
    onWrongGuess?: () => void;
}

const GuessArtistChoice: React.FC<GuessArtistChoiceProps> = ({
    onCorrectGuess,
    currentSong,
    hasGuessedCorrectly,
    onWrongGuess,
}) => {
    const [guess, setGuess] = useState("");
    const [showWrongMessage, setShowWrongMessage] = useState(false);

    /** Create a masked version of the artist name (blanks only, no punctuation/featuring info) */
    const createBlanks = (text: string): string => {
        let mainArtist = text
        .replace(/\s*\([^)]*\)/g, "") // Remove parentheses content
        .replace(/\s*feat\.?\s+.*/gi, "") // Remove "feat."
        .replace(/\s*ft\.?\s+.*/gi, "") // Remove "ft."
        .replace(/\s*featuring\s+.*/gi, "") // Remove "featuring"
        .trim();

        const cleanArtistName = mainArtist
            .replace(/[^\w\s]/g, "") // Remove punctuation
            .replace(/\s+/g, " ") // Normalize spaces
            .trim();

        return cleanArtistName
            .split(" ")
            .filter(Boolean)
            .map(word => "_".repeat(word.length)) // Replace words with underscores
            .join("   ");
    };

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
  
    /** Check guess against the artist */
    const handleSubmitGuess = () => {
      if (!currentSong || hasGuessedCorrectly) return;
  
      const normalizedGuess = normalizeForComparison(guess);
      const normalizedArtist = normalizeForComparison(currentSong.artist);

      if (normalizedGuess === normalizedArtist) {
        onCorrectGuess(); // Correct guess → notify parent
      } else {
        setShowWrongMessage(true); // Wrong guess → show message
        onWrongGuess?.();
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !hasGuessedCorrectly) {
          handleSubmitGuess();
        }
    };

  return (
    <div className="music-guess-game">
      {/* Artist name blanks */}
      <div className="artist-label">
        <h1>
          {currentSong ? `ARTIST: ${createBlanks(currentSong.artist)}` : "Loading..."}
        </h1>
      </div>

      {/* Song title name */}
      <div className="artist-label artist-label--spacing">
        <h2 className="artist-text">
          {currentSong ? `TITLE: ${currentSong.title}` : ""}
        </h2>
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

export default GuessArtistChoice;
