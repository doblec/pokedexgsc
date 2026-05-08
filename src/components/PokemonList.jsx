import { useEffect, useRef, useState } from 'react';
import pokeballSprite from '../assets/sprites/pokeball.png';
import selectorSprite from '../assets/sprites/selector.png';
import arrowSprite from '../assets/sprites/arrow.png';
import './PokemonList.css';

export default function PokemonList({ list, selectedId, onSelect, onConfirm }) {
  const listRef = useRef(null);
  const blockScrollRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [spriteSrc, setSpriteSrc] = useState(null);
  const [isSpriteLoading, setIsSpriteLoading] = useState(true);

  // Convert GIF to PNG for the first frame to get accurate cropping
  useEffect(() => {
    if (!selectedId) return;

    setIsSpriteLoading(true);
    const form = selectedId === 201 ? '-a' : '';
    const gifUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/animated/${selectedId}${form}.gif`;

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Required for canvas operations on external images
    img.src = gifUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0); // Draws the first frame of the GIF
      setSpriteSrc(canvas.toDataURL('image/png'));
      setIsSpriteLoading(false);
    };
    
    img.onerror = () => {
      console.error("Failed to load GIF for conversion:", gifUrl);
      setIsSpriteLoading(false);
      setSpriteSrc(null);
    };
  }, [selectedId]);

  // Auto-scroll to keep selection visible
  useEffect(() => {
    if (listRef.current && !blockScrollRef.current) {
      const container = listRef.current;
      const selectedElement = container.querySelector('.selected');
      if (selectedElement) {
        // Calculate scroll manually to prevent shifting parent containers
        const elementTop = selectedElement.offsetTop;
        const elementHeight = selectedElement.offsetHeight;
        const containerHeight = container.clientHeight;
        container.scrollTop = Math.round(elementTop - (containerHeight / 2) + (elementHeight / 2));
      }
    }
  }, [selectedId]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        blockScrollRef.current = false;
        onSelect(prev => (prev < list.length ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        blockScrollRef.current = false;
        onSelect(prev => (prev > 1 ? prev - 1 : prev));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        blockScrollRef.current = false;
        onSelect(prev => Math.min(prev + 10, list.length));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        blockScrollRef.current = false;
        onSelect(prev => Math.max(prev - 10, 1));
      } else if (e.key.toLowerCase() === 'z') {
        onConfirm(selectedId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [list, selectedId, onSelect, onConfirm]);

  const currentPokemon = list.find(p => p.id === selectedId);

  // Handle mouse pagination
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent native browser menu from opening
    blockScrollRef.current = false;
    onSelect(prev => Math.min(prev + 10, list.length));
  };

  const handleListLeftClick = (e) => {
    // Ignore if clicking a pokemon item (let the item's onClick handle it)
    if (e.target.closest('.list-item')) return;
    blockScrollRef.current = false;
    onSelect(prev => Math.max(prev - 10, 1));
  };

  return (
    <div className="pokedex-list-container">
      {/* Left Column */}
      <div className="left-column">
        <div className="sprite-box">
          {currentPokemon && !isSpriteLoading && spriteSrc && (
            <img 
              key={selectedId}
              src={spriteSrc}
              alt="preview"
              className="monochrome-sprite"
            />
          )}
          <div className="sprite-overlay"></div>
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

      {/* Right Column */}
      <div 
        className="right-column-container"
        onContextMenu={handleContextMenu}
        onClick={handleListLeftClick}
      >
        <div className="scroll-indicator-top">
          <img src={arrowSprite} className="scroll-arrow" alt="up" />
        </div>
        <div className="right-column-wrapper">
        <div className="right-column" ref={listRef}>
          {list.map((pokemon) => (
            <div 
              key={pokemon.id} 
              className={`list-item ${pokemon.id === selectedId ? 'selected' : ''}`}
              onMouseMove={(e) => {
                if (e.clientX === lastMousePos.current.x && e.clientY === lastMousePos.current.y) return;
                lastMousePos.current = { x: e.clientX, y: e.clientY };
                if (pokemon.id !== selectedId) {
                  blockScrollRef.current = true;
                  onSelect(pokemon.id);
                }
              }}
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