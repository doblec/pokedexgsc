import { useState } from 'react'
import PokemonList from './components/PokemonList';
import PokemonEntry from './components/PokemonEntry';
import { usePokemonList } from './hooks/usePokemon';
import './App.css'

function App() {
  const [view, setView] = useState('LIST'); // 'LIST' | 'ENTRY'
  const [selectedId, setSelectedId] = useState(1);
  const { pokemonList, loading } = usePokemonList();

  const handleSelectPokemon = (id) => {
    setSelectedId(id);
    setView('ENTRY');
  };

  const handleBackToList = () => {
    setView('LIST');
  };

  return (
    <div className="app-container">
      {/* Contenedor físico de la pantalla (Estética) */}
      <div className="gameboy-screen">
        <div className="screen-content">
          {view === 'LIST' && (
            <PokemonList
              list={pokemonList}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onConfirm={handleSelectPokemon}
            />
          )}
          {view === 'ENTRY' && (
            <PokemonEntry
              id={selectedId}
              onBack={handleBackToList}
              onIdChange={setSelectedId}
            />
          )}
        </div>
      </div>

      <div className="instructions">
        <p>CONTROLS:</p>
        <p>Z : Select</p>
        <p>X : Back</p>
        <p>⬆ / ⬇ / ⬅ / ➡ : Navigate</p>
      </div>
    </div>
  )
}

export default App
