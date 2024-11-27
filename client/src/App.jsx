import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PokemonBattle from './PokemonBattle';
import BattleArena from './BattleArena';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PokemonBattle />} />
        <Route path="/battle" element={<BattleArena />} />
      </Routes>
    </Router>
  );
}

export default App;
