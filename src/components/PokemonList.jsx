import { useEffect, useRef } from 'react';
import pokeballSprite from '../assets/sprites/pokeball.png';
import selectorSprite from '../assets/sprites/selector.png';
import arrowSprite from '../assets/sprites/arrow.png';
import './PokemonList.css';

export default function PokemonList({ list, selectedId, onSelect, onConfirm }) {
  const listRef = useRef(null);

  // Auto-scroll para mantener la selección visible
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector('.selected');
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    }
  }, [selectedId]);

  // Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        onSelect(prev => (prev < list.length ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onSelect(prev => (prev > 1 ? prev - 1 : prev));
      } else if (e.key.toLowerCase() === 'z') {
        onConfirm(selectedId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [list, selectedId, onSelect, onConfirm]);

  const currentPokemon = list.find(p => p.id === selectedId);

  return (
    <div className="pokedex-list-container">
      {/* Columna Izquierda */}
      <div className="left-column">
        <div className="sprite-box">
          {currentPokemon && (
            <img 
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/${selectedId}.png`}
              alt="preview"
              className="monochrome-sprite"
            />
          )}
        </div>
        <div className="counters-box">
          <div className="counter-block">
            <span className="counter-label">SEEN</span>
            <span className="counter-value">251</span>
          </div>
          <div className="counter-block">
            <span className="counter-label">OWN</span>
            <span className="counter-value">251</span>
          </div>
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="right-column-container">
        <div className="scroll-indicator-top">
          <img src={arrowSprite} className="scroll-arrow" alt="up" />
        </div>
        <div className="right-column-wrapper">
        <div className="right-column" ref={listRef}>
          {list.map((pokemon) => (
            <div 
              key={pokemon.id} 
              className={`list-item ${pokemon.id === selectedId ? 'selected' : ''}`}
              onClick={() => { onSelect(pokemon.id); onConfirm(pokemon.id); }}
            >
              {pokemon.id === selectedId && (
                <>
                  <img src={selectorSprite} className="selector-corner top-left" alt="" />
                  <img src={selectorSprite} className="selector-corner top-right" alt="" />
                  <img src={selectorSprite} className="selector-corner bottom-left" alt="" />
                  <img src={selectorSprite} className="selector-corner bottom-right" alt="" />
                </>
              )}
              <div className="item-number">{String(pokemon.id).padStart(3, '0')}</div>
              <div className="item-name-row">
                {pokemon.caught ? (
                  <img src={pokeballSprite} alt="caught" className="pokeball-icon-img" />
                ) : (
                  <div className="pokeball-icon-placeholder"></div>
                )}
                <span className="name">{pokemon.name.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
        </div>
        <div className="scroll-indicator-bottom">
          <img src={arrowSprite} className="scroll-arrow flip-y" alt="down" />
        </div>
      </div>
    </div>
  );
}