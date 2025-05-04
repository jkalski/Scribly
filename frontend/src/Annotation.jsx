import React, { useState } from 'react';

const Annotation = ({ id, position, comment, color = '#FFEB3B' }) => {
  const [showPopup, setShowPopup] = useState(false);
  
  const annotationStyle = {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${position.width || 10}%`,
    height: `${position.height || 5}%`,
    backgroundColor: `${color}40`, // 40 is for 25% opacity in hex
    border: `2px solid ${color}`,
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    pointerEvents: 'auto',
    zIndex: 10
  };
  
  const popupStyle = {
    position: 'absolute',
    left: `${position.x + (position.width || 10) + 1}%`,
    top: `${position.y}%`,
    display: showPopup ? 'block' : 'none',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    padding: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '300px',
    zIndex: 20,
    pointerEvents: 'auto'
  };
  
  const numberStyle = {
    display: 'inline-block',
    backgroundColor: color,
    color: '#000',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    textAlign: 'center',
    lineHeight: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    position: 'absolute',
    top: '2px',
    left: '2px'
  };
  
  return (
    <>
      <div 
        className="annotation"
        style={annotationStyle}
        onClick={() => setShowPopup(!showPopup)}
        data-annotation-id={id}
      >
        <div style={numberStyle}>{id}</div>
      </div>
      
      <div 
        className="annotation-popup"
        style={popupStyle}
      >
        <div className="annotation-comment">{comment}</div>
        <div 
          style={{
            position: 'absolute',
            top: '2px',
            right: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onClick={() => setShowPopup(false)}
        >
          ×
        </div>
      </div>
    </>
  );
};

export default Annotation;