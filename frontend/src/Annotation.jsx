import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const Annotation = ({ id, type, title, description, position, onClick, isActive }) => {
  // Get appropriate icon based on type
  const getIcon = () => {
    switch (type) {
      case 'critical':
        return <XCircle size={16} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      case 'suggestion':
        return <Info size={16} className="text-blue-500" />;
      case 'positive':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };
  
  // Determine colors based on type
  let bgColor = 'rgba(74, 134, 232, 0.2)';  // default blue
  let borderColor = 'rgba(74, 134, 232, 0.6)';
  
  if (type === 'critical') {
    bgColor = 'rgba(234, 67, 53, 0.2)';
    borderColor = 'rgba(234, 67, 53, 0.6)';
  } else if (type === 'warning') {
    bgColor = 'rgba(251, 188, 4, 0.2)';
    borderColor = 'rgba(251, 188, 4, 0.6)';
  } else if (type === 'positive') {
    bgColor = 'rgba(52, 168, 83, 0.2)';
    borderColor = 'rgba(52, 168, 83, 0.6)';
  }
  
  // Style for the annotation highlight on the PDF
  const markerStyle = {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    width: `${position.width || 10}%`,
    height: `${position.height || 5}%`,
    backgroundColor: bgColor,
    border: `2px solid ${borderColor}`,
    borderRadius: '3px',
    cursor: 'pointer',
    pointerEvents: 'auto',
    transition: 'all 0.2s',
    boxShadow: isActive ? `0 0 0 2px ${borderColor}, 0 0 10px rgba(0,0,0,0.2)` : 'none',
    zIndex: isActive ? 20 : 10
  };
  
  // Style for the number indicator
  const numberStyle = {
    position: 'absolute',
    top: '-8px',
    left: '-8px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: 'white',
    border: `2px solid ${borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    zIndex: 30
  };
  
  // Style for the popup tooltip with better positioning
  const popupStyle = {
    position: 'absolute',
    left: `${position.x + position.width + 1}%`,
    top: `${position.y}%`,
    width: 'max-content',
    maxWidth: '250px',
    backgroundColor: 'white',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    border: `1px solid ${borderColor}`,
    padding: '12px',
    zIndex: 50,
    display: isActive ? 'block' : 'none'
  };
  
  // Determine where to position the connector line
  const connectorX = position.x + position.width;
  const connectorY = position.y + (position.height / 2);
  
  return (
    <>
      <div 
        className={`annotation-marker ${type} ${isActive ? 'active' : ''}`}
        style={markerStyle}
        onClick={onClick}
        data-annotation-id={id}
      >
        <div style={numberStyle}>{id}</div>
      </div>
      
      {isActive && (
        <>
          {/* Popup tooltip with annotation details */}
          <div className="annotation-popup" style={popupStyle}>
            <div className="flex items-center mb-1">
              {getIcon()}
              <span className="ml-2 font-medium">{title}</span>
            </div>
            <p className="text-sm text-gray-700">{description}</p>
          </div>
          
          {/* Improved connecting line with better positioning */}
          <div 
            style={{
              position: 'absolute',
              left: `${connectorX}%`,
              top: `${connectorY}%`,
              width: '30px',
              height: '2px',
              backgroundColor: borderColor,
              zIndex: 20
            }}
          />
        </>
      )}
    </>
  );
};

export default Annotation;