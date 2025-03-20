import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000/api';

const BattleArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPokemon } = location.state || {};
  const [diceRoll, setDiceRoll] = useState([0, 0]);
  const [winner, setWinner] = useState(null);
  const [phase, setPhase] = useState("roll");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedPokemon || selectedPokemon.length !== 2) {
      navigate('/');
    }
  }, [selectedPokemon, navigate]);

  const rollDice = useCallback(() => {
    const roll1 = Math.ceil(Math.random() * 6);
    const roll2 = Math.ceil(Math.random() * 6);
    setDiceRoll([roll1, roll2]);
    setPhase("result");
    setWinner(null); // Reset winner for a new battle
    setError(null); // Clear any previous errors
  }, []);

  const calculateWinner = useCallback(() => {
    if (!selectedPokemon || selectedPokemon.length !== 2) return;

    const [pokemon1, pokemon2] = selectedPokemon;
    const totalPower1 = pokemon1.stats.hp + pokemon1.stats.attack + diceRoll[0];
    const totalPower2 = pokemon2.stats.hp + pokemon2.stats.attack + diceRoll[1];

    const winner = totalPower1 > totalPower2 ? pokemon1 : pokemon2;
    setWinner(winner);

    // Send result to the server
    axios.post(`${API_URL}/battleresults`, {
      selectedPokemon: [pokemon1, pokemon2],
      battleResult: `${winner.name} wins`,
    })
      .then(() => {
        setTimeout(() => {
          setPhase("roll");
          setDiceRoll([0, 0]);
          setWinner(null);
        }, 5000);
      })
      .catch((error) => {
        console.error("Error updating battle results:", error);
        setError("Failed to save battle results. Please try again.");
      });
  }, [selectedPokemon, diceRoll]);

  useEffect(() => {
    if (phase === "result" && diceRoll[0] && diceRoll[1]) {
      calculateWinner();
    }
  }, [phase, diceRoll, calculateWinner]);

  if (!selectedPokemon || selectedPokemon.length !== 2) {
    return <p>Loading...</p>;
  }

  return (
    <div className="battle-arena">
      <h1>Battle Arena</h1>
      <div className="arena">
        <div className="pokemon-card">
          <h3>{selectedPokemon[0].name}</h3>
          <img src={selectedPokemon[0].sprites.front_default} alt={selectedPokemon[0].name} />
        </div>
        <div className="dice-roll">
          {phase === "roll" ? (
            <>
              <button onClick={rollDice}>Roll Dice</button>
              <p>Click to roll dice and start the battle!</p>
            </>
          ) : (
            <>
              <p>{`Dice Rolls: ${diceRoll[0]} vs ${diceRoll[1]}`}</p>
              {error && <p className="error">{error}</p>}
              {!error && <button onClick={rollDice}>Restart Battle</button>}
            </>
          )}
        </div>
        <div className="pokemon-card">
          <h3>{selectedPokemon[1].name}</h3>
          <img src={selectedPokemon[1].sprites.front_default} alt={selectedPokemon[1].name} />
        </div>
      </div>
      {winner && <h2>{winner.name} Wins!</h2>}
    </div>
  );
};

export default BattleArena;