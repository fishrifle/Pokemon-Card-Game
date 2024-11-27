// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './App.css';

// const API_URL = 'http://localhost:3000/api';

// const PokemonBattle = () => {
//   const [allPokemon, setAllPokemon] = useState([]);
//   const [selectedPokemon, setSelectedPokemon] = useState([]);
//   const [battleResult, setBattleResult] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPokemon = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/pokemon`);
//         setAllPokemon(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching Pokémon:", error);
//         setError("Failed to load Pokémon data.");
//         setLoading(false);
//       }
//     };

//     fetchPokemon();
//   }, []);


//   // *************************
//   // we need to send a payload to server with both fighters and the result
//   // on server, we need to findById() each fighter and update their records
//   // Fighter are stored in selectedPokemon
//   // battle results are stored in battleResult

//   useEffect(() => {
//     console.log("BATTLE IF HIT")
//     if (battleResult.length && selectedPokemon.length === 2) {
//       console.log("BATTLE IF HIT")

//       axios({
//         method: "POST",
//         url: "http://localhost:3000/api/battleresults",
//         data: {
//           selectedPokemon: selectedPokemon,
//           battleResult: battleResult
//         }

//       })
//         .then(res => {
//           console.log("res", res, "Battle results saved:", res.data);
//           return axios.get(`${API_URL}/pokemon`);
//         })
//         .then((res) => {
//           setAllPokemon(res.data);
//         })
//         .catch((err) => {
//           console.error("Error updating battle results:", err);
//         });

//       setSelectedPokemon([]);
//       // setBattleResult(" ")
//     }

//   }, [battleResult])


//   // **************************
//   // Select or deselect cards 
//   const selectPokemon = (e, pokemon) => {
//     console.warn("selectPoke e", e.target.id, "poke", pokemon)
//     if (selectedPokemon.includes(pokemon)) {
//       setSelectedPokemon(selectedPokemon.filter(p => p !== pokemon));
//     } else if (selectedPokemon.length < 2) {
//       setSelectedPokemon([...selectedPokemon, pokemon]);
//     }
//   };

//   // Start a battle
//   const startBattle = () => {
//     if (selectedPokemon.length !== 2) {
//       alert("Select two Pokémon to battle!");
//       return;
//     }

//     const [pokemon1, pokemon2] = selectedPokemon;
//     const pokemon1Power = pokemon1.stats.hp + pokemon1.stats.attack + pokemon1.stats.defense;
//     const pokemon2Power = pokemon2.stats.hp + pokemon2.stats.attack + pokemon2.stats.defense;

//     if (pokemon1Power > pokemon2Power) {
//       setBattleResult(`${pokemon1.name} wins!`);
//     } else if (pokemon2Power > pokemon1Power) {
//       setBattleResult(`${pokemon2.name} wins!`);
//     } else {
//     }
//   };
//   // ***************


//   //  Reset battle
//   const resetBattle = () => {
//     setSelectedPokemon([]);
//     setBattleResult(" ");
//   };

//   return (
//     <div>
//       <h1>Let The Best Pokemon Win</h1>
//       {console.log("selectedPokemon", selectedPokemon)}
//       {/* Battle controls and result display */}
//       <div className="battle-controls">
//         <button className="battle-button" onClick={startBattle} disabled={selectedPokemon.length !== 2}>
//           Start Battle
//         </button>
//         <button className="reset-button" onClick={resetBattle}>
//           Reset Battle
//         </button>
//         {battleResult && <div className="battle-result">{battleResult}</div>}
//       </div>

//       {loading ? (
//         <p>Loading Pokémon...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : (
//         <div className="pokemon-list">
//           {allPokemon.map((pokemon) => {
//             const isSelected = selectedPokemon.includes(pokemon);



//             return (
//               <div
//                 key={pokemon._id}
//                 id={pokemon._id}
//                 className={`pokemon-card ${isSelected ? 'selected' : ''} type-${pokemon.type[0].toLowerCase()}`}

//                 onClick={(e) => selectPokemon(e, pokemon)}

//               >

//                 <h3>{pokemon.name}</h3>
//                 <img src={pokemon.sprites.front_default} alt={pokemon.name} />
//                 <div className="pokemon-stats">
//                 <p>Types: {pokemon.type.join(", ")}</p>
//                   <p>HP: {pokemon.stats.hp}</p>
//                   <p>Attack: {pokemon.stats.attack}</p>
//                   <p>Defense: {pokemon.stats.defense}</p>
//                   <p>Speed: {pokemon.stats.speed}</p>
//                   <br></br>
//                   <p>Total Battles: {pokemon.battles.length}</p>
//                   <p>Wins: {pokemon.battleStats.wins}</p>
//                   <p>Losses: {pokemon.battleStats.loses}</p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PokemonBattle;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000/api';

const PokemonBattle = () => {
  const [allPokemon, setAllPokemon] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flippedCards, setFlippedCards] = useState([]); // Tracks flipped cards
  const navigate = useNavigate();

  // Fetch Pokémon from the server
  useEffect(() => {
    axios.get(`${API_URL}/pokemon`)
      .then((response) => {
        setAllPokemon(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Pokémon:", error);
        setError("Failed to load Pokémon data.");
        setLoading(false);
      });
  }, []);

  const selectPokemon = (e, pokemon) => {
    if (selectedPokemon.includes(pokemon)) {
      setSelectedPokemon(selectedPokemon.filter((p) => p !== pokemon));
    } else if (selectedPokemon.length < 2) {
      setSelectedPokemon([...selectedPokemon, pokemon]);
    }
  };

  const flipCard = (e, pokemonId) => {
    e.preventDefault(); // Prevent default right-click menu
    setFlippedCards((prev) =>
      prev.includes(pokemonId) ? prev.filter((id) => id !== pokemonId) : [...prev, pokemonId]
    );
  };

  const startBattle = () => {
    if (selectedPokemon.length !== 2) {
      alert("Select two Pokémon to battle!");
      return;
    }

    navigate('/battle', { state: { selectedPokemon } });
  };

  return (
    <div>
      <h1>Let The Best Pokemon Win</h1>
      {loading ? (
        <p>Loading Pokémon...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="pokemon-list">
          {allPokemon.map((pokemon) => {
            const isFlipped = flippedCards.includes(pokemon._id);
            const isSelected = selectedPokemon.includes(pokemon);

            return (
              <div
                key={pokemon._id}
                className={`pokemon-card ${isSelected ? 'selected' : ''} ${isFlipped ? 'flipped' : ''} type-${pokemon.type[0].toLowerCase()}`}
                onClick={(e) => selectPokemon(e, pokemon)} // Left-click selects
                onContextMenu={(e) => flipCard(e, pokemon._id)} // Right-click flips
              >
                <div className="card-inner">
                  <div className="card-front">
                    <h3>{pokemon.name}</h3>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    <div className="pokemon-stats">
                      <p>Types: {pokemon.type.join(", ")}</p>
                      <p>HP: {pokemon.stats.hp}</p>
                      <p>Attack: {pokemon.stats.attack}</p>
                      <p>Defense: {pokemon.stats.defense}</p>
                      <p>Speed: {pokemon.stats.speed}</p>
                    </div>
                  </div>
                  <div className="card-back">
                    <p>{`${pokemon.name} has fought ${pokemon.battles.length} battles.`}</p>
                    <p>{`Record: ${pokemon.battleStats.wins} wins and ${pokemon.battleStats.loses} losses.`}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Floating "Start Battle" Button */}
      <div className="battle-controls">
        <button
          className="battle-button"
          onClick={startBattle}
          disabled={selectedPokemon.length !== 2}
        >
          Start Battle
        </button>
      </div>
    </div>
  );
};

export default PokemonBattle;
