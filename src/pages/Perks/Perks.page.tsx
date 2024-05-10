import React, { useEffect, useRef } from 'react';

const PerksPage = () => {
  const foodItemsRef = useRef([]);
  const otherItemsRef = useRef([]);

  useEffect(() => {
    const fadeInItems = (items) => {
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('opacity-100');
        }, 175 * index);
      });
    };

    fadeInItems(foodItemsRef.current);
    fadeInItems(otherItemsRef.current);
  }, []);

  return (
    <div>
      <div className="flex gap-32">
        <div className="w-1/3">
          <h2 className="text-xl font-bold mb-4">Food</h2>
          <div
            ref={(el) => (foodItemsRef.current[0] = el)}
            className="bg-white shadow-md p-4 rounded-xl flex items-center mb-4 opacity-0 transition-opacity duration-300"
          >
            <img src="/src/assets/perks/fantaun.png" alt="Fantuan Delivery" className="w-52 h-20 mr-6" />
            <div>
              <h3 className="font-bold mt-4">Fantuan Delivery</h3>
              <p className="text-gray-500 mt-2 mb-4">
                Free bubble tea for each participant as long as they "pre-order" through the app.
              </p>
            </div>
          </div>
          <div
            ref={(el) => (foodItemsRef.current[1] = el)}
            className="bg-white shadow-md p-4 rounded-xl flex items-center mb-4 opacity-0 transition-opacity duration-300"
          >
            <img src="/src/assets/perks/fantaun.png" alt="Fantuan Delivery" className="w-52 h-20 mr-4" />
            <div>
              <h3 className="font-bold">Fantuan Delivery</h3>
              <p className="text-gray-500 mt-2">
                Free bubble tea for each participant as long as they "pre-order" through the app.
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <h2 className="text-xl font-bold mb-4">Other</h2>
          <div
            ref={(el) => (otherItemsRef.current[0] = el)}
            className="bg-white shadow-md p-4 rounded-xl flex items-center mb-4 opacity-0 transition-opacity duration-300"
          >
            <img src="/src/assets/perks/fantaun.png" alt="Fantuan Delivery" className="w-52 h-20 mr-4" />
            <div>
              <h3 className="font-bold">Fantuan Delivery</h3>
              <p className="text-gray-500 mt-2">
                Free bubble tea for each participant as long as they "pre-order" through the app.
              </p>
            </div>
          </div>
          <div
            ref={(el) => (otherItemsRef.current[1] = el)}
            className="bg-white shadow-md p-4 rounded-xl flex items-center mb-4 opacity-0 transition-opacity duration-300"
          >
            <img src="/src/assets/perks/fantaun.png" alt="Fantuan Delivery" className="w-52 h-20 mr-4" />
            <div>
              <h3 className="font-bold">Fantuan Delivery</h3>
              <p className="text-gray-500 mt-2">
                Free bubble tea for each participant as long as they "pre-order" through the app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PerksPage };