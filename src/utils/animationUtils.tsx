import React from 'react';
import { useIntersection } from '../hooks/useIntersection';

import '../styles/animations.css';
interface Props {
  children: React.ReactNode;
}

const FadeInSection = ({ children }:Props) => {

  const [ref, isVisible] = useIntersection({
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });

  return (
    <div
      ref={ref}
      className={`fade-in ${isVisible ? 'visible' : ''}`}
    >
      {children}
    </div>
  );
};


export default FadeInSection;