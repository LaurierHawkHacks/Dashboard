const PerksPage = () => {
  return (
    <div>
      <div className="flex gap-8">
        <div className="w-1/4">
          <h2 className="text-xl font-bold mb-4">Food</h2>
          <div className="bg-white shadow-md p-4 rounded-xl flex items-center mb-4">
            <img
              src="/src/assets/perks/fantaun.png"
              alt="Fantuan Delivery"
              className="w-24 h-16 mr-4"
            />
            <div>
              <h3 className="font-bold">Fantuan Delivery</h3>
              <p className="text-gray-500">
                Free bubble tea for each participant as long as they "pre-order"
                through the app.
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <h2 className="text-xl font-bold mb-4">Other</h2>
          <div className="bg-white shadow-md p-4 rounded-xl flex items-center mb-4">
            <img
              src="/src/assets/perks/fantaun.png"
              alt="Fantuan Delivery"
              className="w-24 h-16 mr-4"
            />
            <div>
              <h3 className="font-bold">Fantuan Delivery</h3>
              <p className="text-gray-500">
                Free bubble tea for each participant as long as they "pre-order"
                through the app.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PerksPage };