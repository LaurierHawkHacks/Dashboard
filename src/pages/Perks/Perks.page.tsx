import { useEffect, useRef, useState } from "react";
import { PerksData, perksData } from "../../data/perks";
import { Modal } from "@/components";
import { getButtonStyles } from "@/components/Button/Button.styles";

const PerksPage = () => {
    const foodItemsRef = useRef([]);
    const otherItemsRef = useRef([]);
    const featuredItemsRef = useRef([]);
    const [selectedPerk, setSelectedPerk] = useState<PerksData | null>(null);
    const [isPopup, setIsPopup] = useState(false);

    useEffect(() => {
        //@ts-ignore
        const fadeInItems = (items) => {
            //@ts-ignore
            items.forEach((item, index) => {
                if (item) {
                    setTimeout(() => {
                        item.classList.add("opacity-100");
                    }, 175 * index);
                }
            });
        };

        fadeInItems(foodItemsRef.current);
        fadeInItems(otherItemsRef.current);
        fadeInItems(featuredItemsRef.current);
    }, []);

    const openPopup = (perk: PerksData) => {
        setSelectedPerk(perk);
        setIsPopup(true);
    };

    const closePopup = () => {
        setIsPopup(false);
    };
    // @ts-ignore
    const renderPerk = (perk: PerksData, ref) => {
        const shortenDescription = (description: string, maxLength: number) => {
            if (description.length <= maxLength) {
                return description;
            }
            return `${description.slice(0, maxLength)}...`;
        };

        const isFreeBubbleTea = perk.title.includes("Fantuan");

        const perkStyle = isFreeBubbleTea
            ? {
                  animation: "pulse 2s infinite",
                  boxShadow: "0 0 0 0 rgba(255, 204, 0, 0.7)",
                  borderColor: "#ffcc00",
                  borderWidth: "2px",
                  borderStyle: "solid",
              }
            : {};

        return (
            <div
                ref={(el) => (ref.current[ref.current.length] = el)}
                className="bg-white shadow-md p-4 rounded-xl flex items-center mb-4 opacity-0 transition-transform hover:scale-105 duration-300 cursor-pointer transform"
                onClick={() => openPopup(perk)}
                style={{ flexBasis: "33%", marginBottom: "16px", ...perkStyle }}
            >
                {isFreeBubbleTea && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-white py-1 px-3 rounded-full text-xs font-bold">
                        FREE Bubble Tea!
                    </div>
                )}
                <div className="w-40 h-24 mr-4 flex items-center justify-center">
                    <img
                        src={perk.image}
                        alt={perk.alt}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
                <div className="flex-grow">
                    <h3 className="font-bold mt-2">{perk.title}</h3>
                    <p className="text-gray-500 mt-1">
                        {shortenDescription(perk.description, 80)}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Featured</h2>
                <div className="flex flex-wrap justify-start gap-x-32 gap-y-2">
                    {perksData.featured.map((perk) =>
                        renderPerk(perk, featuredItemsRef)
                    )}
                </div>
            </div>

            <div className="flex gap-32">
                <div className="w-1/3">
                    <h2 className="text-xl font-bold mb-4">Food</h2>
                    {perksData.food.map((perk) =>
                        renderPerk(perk, foodItemsRef)
                    )}
                </div>
                <div className="w-1/3">
                    <h2 className="text-xl font-bold mb-4">Other</h2>
                    {perksData.other.map((perk) =>
                        renderPerk(perk, otherItemsRef)
                    )}
                </div>
            </div>

            <Modal title="" subTitle="" open={isPopup} onClose={closePopup}>
                {selectedPerk && (
                    <div className="p-2">
                        <img
                            src={selectedPerk.image}
                            alt={selectedPerk.alt}
                            className="w-28 mb-4 object-contain"
                        />
                        <p className="text-gray-800 mb-6">
                            {selectedPerk.description}
                        </p>
                        {selectedPerk.link && (
                            <a
                                href={selectedPerk.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={getButtonStyles({
                                    className: "bg-tbrand rounded-lg",
                                })}
                            >
                                {selectedPerk.buttonTitle || "Learn More"}
                            </a>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export { PerksPage };
