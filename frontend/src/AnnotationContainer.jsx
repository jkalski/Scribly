import React, { useState } from 'react';
import Annotation from './Annotation';

const AnnotationContainer = ({ annotations, pageNumber }) => {
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  
  // Filter annotations for the current page
  const pageAnnotations = annotations.filter(ann => ann.page === pageNumber);
  
  const handleAnnotationClick = (id) => {
    setActiveAnnotation(id === activeAnnotation ? null : id);
  };
  
  return (
    <div 
      className="annotation-container" 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none' 
      }}
    >
      {pageAnnotations.map(annotation => (
        <Annotation 
          key={annotation.id}
          id={annotation.id}
          type={annotation.type}
          title={annotation.title}
          description={annotation.description}
          position={annotation.position}
          isActive={annotation.id === activeAnnotation}
          onClick={() => handleAnnotationClick(annotation.id)}
        />
      ))}
    </div>
  );
};

export default AnnotationContainer;