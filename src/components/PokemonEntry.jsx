import { useEffect, useState, useRef } from 'react';
import { usePokemonDetails } from '../hooks/usePokemon';
import whiterowSprite from '../assets/sprites/whiterow.png';
import './PokemonEntry.css';
import clickSfx from '../assets/sfx/click.mp3';

export default function PokemonEntry({ id, onBack, onIdChange }) {
  const { details, loading } = usePokemonDetails(id);
  const [pageIndex, setPageIndex] = useState(2); // 0: Gold, 1: Silver, 2: Crystal
  const [isShiny, setIsShiny] = useState(false);
  const [menuSelection, setMenuSelection] = useState(0); // -1: None, 0: GAME, 1: AREA, 2: CRY, 3: SHINY
  const descriptionContainerRef = useRef(null);
  const flavorTextRef = useRef(null);

  // References to calculate touch swipe
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);

  // Reference to throttle navigation events (wheel and keyboard)
  const lastNavTime = useRef(0);

  // Reset page to Crystal when pokemon changes
  useEffect(() => {
    // Keep state when switching entries
    // setPageIndex(2);
    // setIsShiny(false);
  }, [id]);

  // Keyboard handling for navigation and actions
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'x') { 
        onBack();
      } else if (key === 'arrowleft') {
        setMenuSelection(prev => {
          if (prev === 0) return 4;
          if (prev === 4) return 2;
          if (prev === 2) return 3; 
          if (prev === 3) return 0; // Skip AREA (1)
          return 0;
        });
      } else if (key === 'arrowright') {
        setMenuSelection(prev => {
          if (prev === 0) return 3; // Skip AREA (1)
          if (prev === 3) return 2;
          if (prev === 2) return 4;
          if (prev === 4) return 0;
          return 0;
        });
      } else if (key === 'arrowup') {
        e.preventDefault();
        const now = Date.now();
        if (now - lastNavTime.current < 40) return;
        lastNavTime.current = now;
        onIdChange(prevId => (prevId > 1 ? prevId - 1 : 251));
      } else if (key === 'arrowdown') {
        e.preventDefault();
        const now = Date.now();
        if (now - lastNavTime.current < 40) return;
        lastNavTime.current = now;
        onIdChange(prevId => (prevId < 251 ? prevId + 1 : 1));
      } else if (key === 'z') {
        if (menuSelection === 0) handlePageChange();
        if (menuSelection === 2) playCry();
        if (menuSelection === 3) toggleShiny();
        if (menuSelection === 4) onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, menuSelection, pageIndex, isShiny, details, onIdChange]); // Required dependencies for actions

  // Play pokemon cry
  const playCry = () => {
    if (details?.cry) {
      const audio = new Audio(details.cry);
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play failed", e));
    }
  };

  // Auto-play cry when details load
  useEffect(() => {
    if (details?.cry) {
      const timeoutId = setTimeout(() => {
        const audio = new Audio(details.cry);
        audio.volume = 0.5;
        audio.play().catch(e => console.log("Audio play failed", e));
      }, 250);
      
      return () => clearTimeout(timeoutId);
    }
  }, [details?.cry]);

  const playClickSound = () => {
    const audio = new Audio(clickSfx);
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed", e));
  };

  const handlePageChange = () => {
    playClickSound();
    // Cycle through the 3 descriptions (0, 1, 2)
    setPageIndex(prevIndex => (prevIndex + 1) % 3);
  };

  const toggleShiny = () => {
    playClickSound();
    setIsShiny(prev => !prev);
  };

  // Resize flavor text to fit container
  useEffect(() => {
    if (!descriptionContainerRef.current || !flavorTextRef.current) return;

    const container = descriptionContainerRef.current;
    const text = flavorTextRef.current;

    // Reset to base size
    text.style.fontSize = '12px';

    let fontSize = 12;
    while (container.scrollHeight > container.clientHeight && fontSize > 9.9) {
      fontSize -= 0.15;
      text.style.fontSize = `${fontSize}px`;
    }
  }, [details?.descriptions, pageIndex]);

  // Touch event handling for swiping up/down
  const minSwipeDistance = 70;

  const handleTouchStart = (e) => {
    touchEndY.current = null; // Reset touch end to avoid false positives
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.targetTouches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;
    const distance = touchStartY.current - touchEndY.current;
    if (distance > minSwipeDistance) {
      onIdChange(prevId => (prevId < 251 ? prevId + 1 : 1)); 
    } else if (distance < -minSwipeDistance) {
      onIdChange(prevId => (prevId > 1 ? prevId - 1 : 251)); 
    }
  };

  // Mouse wheel handling for navigation
  const handleWheel = (e) => {
    const now = Date.now();
    if (now - lastNavTime.current < 40) return; // 40ms cooldown to prevent skipping too many entries

    if (e.deltaY > 0) {
      onIdChange(prevId => (prevId < 251 ? prevId + 1 : 1)); // Scroll down: Go forward (+1)
      lastNavTime.current = now;
    } else if (e.deltaY < 0) {
      onIdChange(prevId => (prevId > 1 ? prevId - 1 : 251)); // Scroll up: Go back (-1)
      lastNavTime.current = now;
    }
  };

  if (!details) {
    return <div className="pokedex-entry-container"></div>;
  }

  // Convert units to imperial (US game style)
  const totalInches = Math.round(details.height * 3.937);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  const lbs = (details.weight * 0.220462).toFixed(1);

  const pageVersions = ['GOLD', 'SILVER', 'CRYSTAL'];
  
  const currentSprite = details.sprites 
    ? (isShiny ? details.sprites.shiny[pageIndex] : details.sprites.normal[pageIndex])
    : null;

  return (
    <div 
      className="pokedex-entry-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Top Half */}
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

      {/* Center Separator */}
      <div className="separator-line">
       <div className={`page-tab tab-${pageVersions[pageIndex].toLowerCase()}`}>{pageVersions[pageIndex]}</div>
      </div>

      {/* Bottom Half (Description) */}
      <div className="bottom-half" ref={descriptionContainerRef}>
        <p className="flavor-text" ref={flavorTextRef}>
          {details.descriptions && details.descriptions[pageIndex]}
        </p>
      </div>

      {/* Bottom Menu */}
      <div className="entry-menu">
        <div className="menu-pill">
          <div 
            className="menu-item-wrapper clickable" 
            onMouseEnter={() => setMenuSelection(0)}
            onClick={() => { setMenuSelection(0); handlePageChange(); }}
          >
            {menuSelection === 0 && <img src={whiterowSprite} className="menu-cursor" alt="" />}
            <span>GAME</span>
          </div>
          
          {/* 
            <div 
              className="menu-item-wrapper clickable" 
              onClick={() => setMenuSelection(1)}
              onMouseEnter={() => setMenuSelection(1)}
            >
              {menuSelection === 1 && <img src={whiterowSprite} className="menu-cursor" alt="" />}
              <span>AREA</span>
            </div>
          */}
          
          <div 
            className="menu-item-wrapper clickable" 
            onMouseEnter={() => setMenuSelection(3)}
            onClick={() => { setMenuSelection(3); toggleShiny(); }}
          >
            {menuSelection === 3 && <img src={whiterowSprite} className="menu-cursor" alt="" />}
            <span>SHINY</span>
          </div>
          
          <div 
            className="menu-item-wrapper clickable" 
            onMouseEnter={() => setMenuSelection(2)}
            onClick={() => { setMenuSelection(2); playCry(); }}
          >
            {menuSelection === 2 && <img src={whiterowSprite} className="menu-cursor" alt="" />}
            <span>CRY</span>
          </div>
          
          <div 
            className="menu-item-wrapper clickable" 
            onMouseEnter={() => setMenuSelection(4)}
            onClick={() => { setMenuSelection(4); onBack(); }}
          >
            {menuSelection === 4 && <img src={whiterowSprite} className="menu-cursor" alt="" />}
            <span>BACK</span>
          </div>
        </div>
      </div>
    </div>
  );
}