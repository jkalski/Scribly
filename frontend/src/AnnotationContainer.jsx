import React from 'react';
import Annotation from './Annotation';

const AnnotationContainer = ({ annotations, pageNumber }) => {
  // Filter annotations for the current page
  const pageAnnotations = annotations.filter(ann => ann.page === pageNumber);
  
  return (
    <div className="annotation-container">
      {pageAnnotations.map(annotation => (
        <Annotation 
          key={annotation.id}
          id={annotation.id}
          position={annotation.position}
          comment={annotation.comment}
          color={annotation.color || '#FFEB3B'}
        />
      ))}
    </div>
  );
};

export default AnnotationContainer;