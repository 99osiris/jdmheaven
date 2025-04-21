import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`inline-flex items-center text-gray-400 hover:text-white transition ${className}`}
      aria-label="Go back"
    >
      <ChevronLeft className="w-6 h-6" />
      <span className="ml-1">Back</span>
    </button>
  );
};

export default BackButton;