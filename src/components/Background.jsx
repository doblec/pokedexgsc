import gbCover from '../assets/bg/gbcover.png';
import './Background.css';

export default function Background({ scale = 1, hue = 0, offsetX = 0, offsetY = 0, lightX, lightY }) {
  return (
    <div 
      className="gb-background"
      style={{ 
        transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`
      }}
    >
      <div
        className="gb-image-wrapper"
        style={{
          transform: `scale(${scale})`,
          position: 'relative'
        }}
      >
        <img 
          src={gbCover} 
          alt="GameBoy Background" 
          className="gb-background-image"
          style={{ filter: `hue-rotate(${hue}deg)` }}
        />
        {lightX !== undefined && lightY !== undefined && (
          <div 
            className="gb-power-light"
            style={{ left: `${lightX}px`, top: `${lightY}px` }}
          />
        )}
      </div>
    </div>
  );
}