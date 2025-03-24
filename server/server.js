// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const axios = require('axios');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI, {

// }).then(() => console.log("Connected to MongoDB"))
//   .catch((error) => console.error("MongoDB connection error:", error));

// const Schema = mongoose.Schema

// const pokemonSchema = new mongoose.Schema({
//   name: String,
//   type: [String],
//   stats: {
//     hp: Number,
//     attack: Number,
//     defense: Number,
//     speed: Number,
//   },
//   sprites: {
//     front_default: String,
//   },
//   battles: [{
//     opponent: { type: Schema.Types.ObjectId, ref: 'Pokemon' },
//     winner: { type: Schema.Types.ObjectId, ref: 'Pokemon' },
//   }],
//   battleStats: {
//     wins: Number,
//     loses: Number
//   }
// });

// const Pokemon = mongoose.model('Pokemon', pokemonSchema);

// const fetchAndSaveAllPokemon = async () => {
//   try {
//     const response = await axios.get("https://pokeapi.co/api/v2/pokemon/?limit=300");
//     const requests = response.data.results.map(pokemon => axios.get(pokemon.url));
//     const pokemonResponses = await Promise.all(requests);

//     const pokemonData = pokemonResponses.map(res => ({
//       name: res.data.name,
//       type: res.data.types.map(typeInfo => typeInfo.type.name), // Store types as an array
//       stats: {
//         hp: res.data.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
//         attack: res.data.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
//         defense: res.data.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0,
//         speed: res.data.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0,
//       },
//       sprites: {
//         front_default: res.data.sprites.front_default,
//       },

//       battleStats: {
//         wins: 0,
//         loses: 0,
//       },
//     }));
//     for (const pokemon of pokemonData) {
//       await Pokemon.updateOne(
//         { name: pokemon.name },
//         { $set: pokemon },

//         { upsert: true }
//       );
//     }

//     console.log("First 151 unique Pokémon saved successfully.");
//   } catch (error) {
//     console.error("Error saving Pokémon data:", error);
//   }
// };



// fetchAndSaveAllPokemon();

// app.get('/api/pokemon', async (req, res) => {
//   try {
//     const pokemons = await Pokemon.find();
//     res.json(pokemons);
//   } catch (error) {
//     console.error("Error fetching Pokémon:", error);
//     res.status(500).send("Failed to fetch Pokémon.");
//   }
// });

// app.post("/api/battleresults", (req, res) => {
//   console.log("BattleRes HIT", req.body)
//   console.log("$fighter 1", req.body.selectedPokemon[0]._id)
//   console.log("$fighter 2", req.body.selectedPokemon[1]._id)

//   // need to find each poke and update results of battle
//   Pokemon.findById(req.body.selectedPokemon[0]._id)
//     .then(fighterOne => {
//       console.log("fighter1", fighterOne, fighterOne.name)
//       // find fighter name that matches req.body.battleresults[0]
//       // update battles opponent and winner
//       // update wins and loses
//       console.log("req.body.battleResult[0]", req.body.battleResult.split(" ")[0])

//       if (fighterOne.name === req.body.battleResult.split(" ")[0]) {
//         console.log("fighter1 IF hit")
//         // update winner with fighter1
//         fighterOne.battles.push({
//           opponent: req.body.selectedPokemon[1]._id,
//           winner: req.body.selectedPokemon[0]._id
//         })
//         fighterOne.battleStats.wins += 1
//         fighterOne.save()
//       } else {
//         fighterOne.battles.push({
//           opponent: req.body.selectedPokemon[1]._id,
//           winner: req.body.selectedPokemon[1]._id
//         })
//         fighterOne.battleStats.loses += 1
//         fighterOne.save()
//       }
      

//     })


//   // fighter 2
//   Pokemon.findById(req.body.selectedPokemon[1]._id)
//     .then(fighterTwo => {
//       console.log("fighter2", fighterTwo, fighterTwo.name)
//       // find fighter name that matches req.body.battleresults[0]
//       // update battles opponent and winner
//       // update wins and loses
//       console.log("req.body.battleResult[1]", req.body.battleResult.split(" ")[0])

//       if (fighterTwo.name === req.body.battleResult.split(" ")[0]) {
//         console.log("fighter2 IF hit")
//         // update winner with fighter1
//         fighterTwo.battles.push({
//           opponent: req.body.selectedPokemon[0]._id,
//           winner: req.body.selectedPokemon[1]._id
          
//         })
        
//         fighterTwo.battleStats.wins += 1
//         fighterTwo.save()
//       } else {
//         fighterTwo.battles.push({
//           opponent: req.body.selectedPokemon[0]._id,
//           winner: req.body.selectedPokemon[0]._id
//         })
//         fighterTwo.battleStats.loses += 1
//         fighterTwo.save()
//       }



//     })
//     console.log(res, req, "res", "req")
// .then(() => {
//   res.status(200).send("Battles results saved successfully");
// })
// .catch((error) => {
//   console.error("Error updating battle results:" , error);
//   if(!res.headersSent) {
//     res.status(500).send("Faild to update battle results")
//   }
// });

// });

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI, {
  
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const Schema = mongoose.Schema;

const pokemonSchema = new mongoose.Schema({
  name: String,
  type: [String],
  stats: {
    hp: Number,
    attack: Number,
    defense: Number,
    speed: Number,
  },
  sprites: {
    front_default: String,
  },
  battles: [
    {
      opponent: { type: Schema.Types.ObjectId, ref: "Pokemon" },
      winner: { type: Schema.Types.ObjectId, ref: "Pokemon" },
    },
  ],
  battleStats: {
    wins: { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
  },
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);

const fetchAndSaveAllPokemon = async () => {
  try {
    const response = await axios.get(
      "https://pokeapi.co/api/v2/pokemon/?limit=300"
    );
    const requests = response.data.results.map((pokemon) =>
      axios.get(pokemon.url)
    );
    const pokemonResponses = await Promise.all(requests);

    const pokemonData = pokemonResponses.map((res) => ({
      name: res.data.name,
      type: res.data.types.map((typeInfo) => typeInfo.type.name),
      stats: {
        hp:
          res.data.stats.find((stat) => stat.stat.name === "hp")?.base_stat ||
          0,
        attack:
          res.data.stats.find((stat) => stat.stat.name === "attack")
            ?.base_stat || 0,
        defense:
          res.data.stats.find((stat) => stat.stat.name === "defense")
            ?.base_stat || 0,
        speed:
          res.data.stats.find((stat) => stat.stat.name === "speed")
            ?.base_stat || 0,
      },
      sprites: {
        front_default: res.data.sprites.front_default,
      },
      battleStats: {
        wins: 0,
        loses: 0,
      },
    }));

    for (const pokemon of pokemonData) {
      await Pokemon.updateOne(
        { name: pokemon.name },
        { $set: pokemon },
        { upsert: true }
      );
    }

    console.log("First 300 unique Pokémon saved successfully.");
  } catch (error) {
    console.error("Error saving Pokémon data:", error);
  }
};

fetchAndSaveAllPokemon();

app.get("/api/pokemon", async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.json(pokemons);
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    res.status(500).send("Failed to fetch Pokémon.");
  }
});

app.post("/api/battleresults", async (req, res) => {
  try {
    const { selectedPokemon, battleResult } = req.body;
    const winnerName = battleResult.split(" ")[0];

    const fighterOne = await Pokemon.findById(selectedPokemon[0]._id);
    const fighterTwo = await Pokemon.findById(selectedPokemon[1]._id);

    if (!fighterOne || !fighterTwo) {
      return res.status(404).send("Pokémon not found.");
    }

    const updateBattleStats = (fighter, opponentId, isWinner) => {
      fighter.battles.push({
        opponent: opponentId,
        winner: isWinner ? fighter._id : opponentId,
      });
      if (isWinner) {
        fighter.battleStats.wins += 1;
      } else {
        fighter.battleStats.loses += 1;
      }
      return fighter.save();
    };

    await Promise.all([
      updateBattleStats(
        fighterOne,
        selectedPokemon[0]._id,
        fighterOne.name === winnerName
      ),
      updateBattleStats(
        fighterTwo,
        selectedPokemon[1]._id,
        fighterTwo.name === winnerName
      ),
    ]);

    res.status(200).send("Battle results saved successfully");
  } catch (error) {
    console.error("Error updating battle results:", error);
    res.status(500).send("Failed to update battle results");
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);