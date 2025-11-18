import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page non trouvée</p>
        <Link to="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
