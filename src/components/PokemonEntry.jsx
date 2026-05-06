import { useEffect, useState } from 'react';
import { usePokemonDetails } from '../hooks/usePokemon';
import './PokemonEntry.css';

export default function PokemonEntry({ id, onBack, onIdChange }) {
  const { details, loading } = usePokemonDetails(id);
  const [pageIndex, setPageIndex] = useState(2); // 0: Gold, 1: Silver, 2: Crystal
  const [isShiny, setIsShiny] = useState(false);
  const [menuSelection, setMenuSelection] = useState(-1); // -1: None, 0: PAGE, 1: AREA, 2: CRY, 3: SHINY

  // Reset page to Crystal when pokemon changes
  useEffect(() => {
    // Mantener estado al cambiar de entry
    // setPageIndex(2);
    // setIsShiny(false);
  }, [id]);

  // Manejo de teclado para navegación y acciones
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'x') { 
        onBack();
      } else if (key === 'arrowleft') {
        setMenuSelection(prev => {
          if (prev === -1) return 0;
          return prev > 0 ? prev - 1 : 3;
        });
      } else if (key === 'arrowright') {
        setMenuSelection(prev => {
          if (prev === -1) return 0;
          return prev < 3 ? prev + 1 : 0;
        });
      } else if (key === 'arrowup') {
        e.preventDefault();
        onIdChange(prevId => (prevId > 1 ? prevId - 1 : 251));
      } else if (key === 'arrowdown') {
        e.preventDefault();
        onIdChange(prevId => (prevId < 251 ? prevId + 1 : 1));
      } else if (key === 'z') {
        if (menuSelection === 0) handlePageChange();
        if (menuSelection === 2) playCry();
        if (menuSelection === 3) toggleShiny();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, menuSelection, pageIndex, isShiny, details, onIdChange]); // Dependencias necesarias para las acciones

  // Función para reproducir el grito
  const playCry = () => {
    if (details?.cry) {
      const audio = new Audio(details.cry);
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play failed", e));
    }
  };

  const handlePageChange = () => {
    // Cycle through the 3 descriptions (0, 1, 2)
    setPageIndex(prevIndex => (prevIndex + 1) % 3);
  };

  const toggleShiny = () => {
    setIsShiny(prev => !prev);
  };

  if (loading || !details) {
    return <div className="pokedex-entry-container"></div>;
  }

  // Conversión de unidades para mostrar estilo imperial (como en el juego US)
  const feet = Math.floor((details.height * 3.937) / 12);
  const inches = Math.round(((details.height * 3.937) % 12));
  const lbs = (details.weight * 0.220462).toFixed(1);

  const pageVersions = ['GOLD', 'SILVER', 'CRYSTAL'];
  
  const currentSprite = details.sprites 
    ? (isShiny ? details.sprites.shiny[pageIndex] : details.sprites.normal[pageIndex])
    : null;

  return (
    <div className="pokedex-entry-container">
      {/* Mitad Superior */}
      <div className="top-half">
        <div className="entry-left">
          <div className="entry-sprite-box">
            <img key={`${pageIndex}-${isShiny}`} src={currentSprite} alt={details.name} />
          </div>
          <div className="entry-number">
            <span className="no-label">No</span><span className="no-value">.</span>
            <span className="no-value">{String(details.id).padStart(3, '0')}</span>
          </div>
        </div>
        
        <div className="entry-right">
          <div className="entry-name">{details.name.toUpperCase()}</div>
          <div className="entry-category">{details.category.toUpperCase()}</div>
          <div className="entry-stats">
            <div className="stat-row">
              <span className="label">HT</span>
              <span className="value">{feet}'{String(inches).padStart(2, '0')}''</span>
            </div>
            <div className="stat-row">
              <span className="label">WT</span>
              <span className="value">{lbs}lb</span>
            </div>
          </div>
        </div>
      </div>

      {/* Separador Central */}
      <div className="separator-line">
       <div className="page-tab">{pageVersions[pageIndex]}</div>
      </div>

      {/* Mitad Inferior (Descripción) */}
      <div className="bottom-half">
        <p className="flavor-text">{details.descriptions && details.descriptions[pageIndex]}</p>
      </div>

      {/* Menú Inferior */}
      <div className="entry-menu">
        <div className="menu-pill">
          <span 
            className={`clickable ${menuSelection === 0 ? 'selected' : ''}`} 
            onClick={() => { setMenuSelection(0); handlePageChange(); }}
          >PAGE</span>
          
          <span 
            className={menuSelection === 1 ? 'selected' : ''} 
            onClick={() => setMenuSelection(1)}
          >AREA</span>
          
          <span 
            className={`clickable ${menuSelection === 2 ? 'selected' : ''}`} 
            onClick={() => { setMenuSelection(2); playCry(); }}
          >CRY</span>
          
          <span 
            className={`clickable ${menuSelection === 3 ? 'selected' : ''}`} 
            onClick={() => { setMenuSelection(3); toggleShiny(); }}
          >SHINY</span>
        </div>
      </div>
    </div>
  );
}