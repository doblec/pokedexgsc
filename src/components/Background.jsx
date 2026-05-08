import gbCover from '../assets/bg/gbcover.png';
import './Background.css';

export default function Background({ scale = 1, hue = 0, offsetX = 0, offsetY = 0, lightX, lightY, radius = 14 }) {
  return (
    <div 
      className="gb-background"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: -1
      }}
    >
      <div
        className="gb-image-wrapper"
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: 'center center',
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
            style={{ 
              left: `${lightX}px`, 
              top: `${lightY}px`,
              width: `${radius}px`,
              height: `${radius}px`
            }}
          />
        )}
      </div>
    </div>
  );
}