import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary-600 mb-4">
          Bienvenue sur SOUKLOU
        </h1>
        <p className="text-xl text-gray-600">
          La marketplace moderne qui connecte vendeurs et acheteurs
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="card">
          <div className="text-4xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold mb-2">Large Catalogue</h3>
          <p className="text-gray-600">
            Des milliers de produits dans toutes les catégories
          </p>
        </div>

        <div className="card">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold mb-2">Paiement Sécurisé</h3>
          <p className="text-gray-600">
            Transactions 100% sécurisées et protégées
          </p>
        </div>

        <div className="card">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Livraison Rapide</h3>
          <p className="text-gray-600">
            Livraison express partout dans le pays
          </p>
        </div>
      </div>

      <div className="text-center">
        <button className="btn-primary mr-4">
          Commencer à acheter
        </button>
        <button className="btn-secondary">
          Devenir vendeur
        </button>
      </div>
    </div>
  );
};

export default Home;
