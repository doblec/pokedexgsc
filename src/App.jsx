import { useState, useEffect } from 'react'
import PokemonList from './components/PokemonList';
import PokemonEntry from './components/PokemonEntry';
import { usePokemonList } from './hooks/usePokemon';
import Background from './components/Background';
import clickSfx from './assets/sfx/click.mp3';
import './App.css'

function App() {
  const [view, setView] = useState('LIST'); // 'LIST' | 'ENTRY'
  const [selectedId, setSelectedId] = useState(1);
  const [appScale, setAppScale] = useState(1);
  const { pokemonList, loading } = usePokemonList();

  // JS-based scaling for 100% cross-browser compatibility (fixes Firefox calc issue)
  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 700;
      const scaleY = window.innerHeight / 850;
      setAppScale(Math.min(1, scaleX, scaleY));
    };
    handleResize(); // Initial calculation
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const playClickSound = () => {
    const audio = new Audio(clickSfx);
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed", e));
  };

  const handleSelectPokemon = (id) => {
    playClickSound();
    setSelectedId(id);
    setView('ENTRY');
  };

  const handleBackToList = () => {
    playClickSound();
    setView('LIST');
  };

  return (
    <div className="app-container" style={{ '--app-scale': appScale }}>
      <div className="layout-scaler">
        <Background 
          scale={1.35} 
          hue={0} 
          offsetX={0} 
          offsetY={450} 
          lightX={83} 
          lightY={262} 
          radius={15}
        />

        {/* Physical screen container */}
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
      </div>
    </div>
  )
}

export default App
