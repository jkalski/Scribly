import React, { useState } from 'react';

const Annotation = ({ id, position, comment, color = '#FFEB3B' }) => {
  const [showPopup, setShowPopup] = useState(false);
  
  const annotationStyle = {
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${position.width || 10}%`,
    height: `${position.height || 5}%`,
    backgroundColor: `${color}40`, // 40 is for 25% opacity in hex
    borderColor: color
  };
  
  const popupStyle = {
    left: `${position.x + (position.width || 10) + 1}%`,
    top: `${position.y}%`,
    display: showPopup ? 'block' : 'none'
  };
  
  return (
    <>
      <div 
        className="annotation"
        style={annotationStyle}
        onClick={() => setShowPopup(!showPopup)}
        data-annotation-id={id}
      >
        <div className="annotation-number">{id}</div>
      </div>
      
      <div 
        className="annotation-popup"
        style={popupStyle}
      >
        <div className="annotation-comment">{comment}</div>
      </div>
    </>
  );
};

export default Annotation;