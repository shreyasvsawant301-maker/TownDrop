import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { fetchAiShoppingRecommendations } from '../lib/supabase';

export default function AiShoppingAssistant({ onAddRecommendedToCart }) {
  const { products } = useApp();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const samplePrompts = [
    '🥣 Ingredients to make Poha for 4 people',
    '🔨 Tools & items for fixing a leaking pipe',
    '💊 First aid items for fever and small cuts'
  ];

  const handleSearch = async (queryText = prompt) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    const results = await fetchAiShoppingRecommendations(queryText, products);
    setRecommendations(results);
    setIsLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-primary-fixed-dim/20 to-tertiary-fixed-dim/20 border border-primary/20 rounded-2xl p-md md:p-lg mb-lg shadow-sm">
      <div className="flex items-center justify-between mb-sm">
        <div className="flex items-center gap-xs">
          <span className="bg-primary text-on-primary text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">auto_awesome</span> NVIDIA AI
          </span>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            TownDrop AI Shopping Assistant
          </h3>
        </div>
        <span className="font-label-sm text-xs text-secondary hidden sm:inline">
          Llama-3.1-70B Hyperlocal Engine
        </span>
      </div>

      <p className="font-body-sm text-secondary mb-md">
        Ask for any task, recipe, or home repair — our AI will find the exact products from local Karmala shops!
      </p>

      {/* Input Box */}
      <div className="flex gap-xs mb-sm">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="e.g. I need ingredients to make Poha for 4 people..."
          className="flex-1 p-sm bg-surface border border-outline-variant rounded-xl font-body-md text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={() => handleSearch()}
          disabled={isLoading}
          className="bg-primary text-on-primary font-label-md px-md py-sm rounded-xl font-bold hover:bg-primary-container transition-colors flex items-center gap-xs shrink-0 shadow-xs"
        >
          {isLoading ? (
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
          ) : (
            <span className="material-symbols-outlined">auto_awesome</span>
          )}
          <span>{isLoading ? 'Thinking...' : 'Ask AI'}</span>
        </button>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-wrap gap-xs mb-md">
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              setPrompt(p.replace(/^[^\s]+\s/, ''));
              handleSearch(p.replace(/^[^\s]+\s/, ''));
            }}
            className="text-xs bg-surface/80 hover:bg-surface text-on-surface-variant border border-outline-variant/60 px-sm py-1 rounded-full transition-colors font-medium"
          >
            {p}
          </button>
        ))}
      </div>

      {/* AI Recommendation Output */}
      {hasSearched && (
        <div className="bg-surface rounded-xl p-md border border-outline-variant/80 space-y-md animate-fadeIn">
          <div className="flex justify-between items-center">
            <h4 className="font-label-md font-bold text-on-surface flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary text-sm">shopping_bag</span>
              AI Recommended Products ({recommendations.length})
            </h4>
            {recommendations.length > 0 && (
              <button
                onClick={() => onAddRecommendedToCart(recommendations)}
                className="bg-tertiary text-on-tertiary text-xs font-bold px-md py-xs rounded-lg hover:opacity-90 transition-opacity flex items-center gap-xs shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                Add All Items to Cart
              </button>
            )}
          </div>

          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-sm">
              {recommendations.map(item => (
                <div key={item.id} className="bg-surface-container-low p-sm rounded-lg border border-outline-variant/50 flex flex-col justify-between">
                  <div>
                    <h5 className="font-label-md font-bold text-on-surface">{item.name}</h5>
                    <p className="text-xs text-secondary">{item.unit || '1 unit'} • ₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => onAddRecommendedToCart([item])}
                    className="mt-xs text-xs bg-primary-fixed text-on-primary-fixed font-bold py-1 px-sm rounded hover:bg-primary-fixed-dim transition-colors text-center"
                  >
                    + Add item
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-secondary italic">No exact items found in catalog for this request. Try searching for "Poha" or "Hammer".</p>
          )}
        </div>
      )}
    </div>
  );
}
