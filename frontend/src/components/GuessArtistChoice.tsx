import React, { useState } from "react";
import type { Song } from "../types/song";


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

    const handleGuess = () => {
        if (currentSong && guess.toLowerCase() === currentSong.artist.toLowerCase()) {
            onCorrectGuess();
        } else {
            setShowWrongMessage(true);
            if (onWrongGuess) {
                onWrongGuess();
            }
        }
    };

    return (
        <div className="guess-artist-container">
            <h2>GUESS THE ARTIST:</h2>
            <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter artist name"
            />
            <button onClick={handleGuess}>Submit Guess</button>
            {showWrongMessage && <p className="error-message">Wrong guess, try again!</p>}
        </div>
    );
};

export default GuessArtistChoice;