
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-secondary-900/50 rounded-xl shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
