import React, { useEffect, useRef, useState } from 'react';
import { perksData } from '../../data/perks';

const PerksPage = () => {
  const foodItemsRef = useRef([]);
  const otherItemsRef = useRef([]);
  const [selectedPerk, setSelectedPerk] = useState(null);
  const [popupStyle, setPopupStyle] = useState({ opacity: 0 });

  useEffect(() => {
    const fadeInItems = (items) => {
      items.forEach((item, index) => {
        if (item) {
          setTimeout(() => {
            item.classList.add('opacity-100');
          }, 175 * index);
        }
      });
    };

    fadeInItems(foodItemsRef.current);
    fadeInItems(otherItemsRef.current);
  }, []);

  const openPopup = (perk) => {
    setSelectedPerk(perk);
    document.body.classList.add('overflow-hidden');
    setTimeout(() => {
      setPopupStyle({ opacity: 1 });
    }, 0);
  };

  const closePopup = () => {
    setPopupStyle({ opacity: 0 });
    setTimeout(() => {
      setSelectedPerk(null);
      document.body.classList.remove('overflow-hidden');
    }, 300);
  };

  const renderPerk = (perk, ref) => {
    const shortenDescription = (description, maxLength) => {
      if (description.length <= maxLength) {
        return description;
      }
      return `${description.slice(0, maxLength)}...`;
    };

    return (
      <div
        ref={(el) => (ref.current[ref.current.length] = el)}
        className="bg-white shadow-md p-4 rounded-xl flex items-center mb-4 opacity-0 transition-opacity duration-300 cursor-pointer"
        onClick={() => openPopup(perk)}
      >
        <div className="w-52 h-32 mr-6 flex items-center justify-center">
          <img src={perk.image} alt={perk.alt} className="max-w-full max-h-full object-contain" />
        </div>
        <div className="w-2/3">
          <h3 className="font-bold mt-4">{perk.title}</h3>
          <p className="text-gray-500 mt-2 mb-4">{shortenDescription(perk.description, 80)}</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex gap-32">
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Food</h2>
          {perksData.food.map((perk, index) => renderPerk(perk, foodItemsRef))}
        </div>
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Other</h2>
          {perksData.other.map((perk, index) => renderPerk(perk, otherItemsRef))}
        </div>
      </div>

      {selectedPerk && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            ...popupStyle,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          <div
            className="fixed inset-0 bg-gray-900"
            onClick={closePopup}
            style={{
              ...popupStyle,
              opacity: 0.8,
              transition: 'opacity 0.3s ease-in-out',
            }}
          ></div>
          <div className="bg-white rounded-xl p-8 max-w-2xl mx-auto z-10 shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={closePopup}
            >
            </button>
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 mr-6 flex items-center justify-center">
                <img src={selectedPerk.image} alt={selectedPerk.alt} className="max-w-full max-h-full object-contain" />
              </div>
              <h2 className="text-2xl font-bold">{selectedPerk.title}</h2>
            </div>
            <p className="text-gray-800 mb-6">{selectedPerk.description}</p>
            {selectedPerk.link && (
              <a
                href={selectedPerk.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
              >
                {selectedPerk.buttonTitle || 'Learn More'}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { PerksPage };