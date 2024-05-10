import { sponsorLinks } from "./sponsorLinks";
import {
    Avalanche,
    Near,
    Fantuan,
    SmokesPoutinerie,
    Dominos,
    Nibiru,
    Distributive,
} from "@assets";

interface Sponsor {
    name: string;
    link: string;
    image: string;
}

const sponsors: Sponsor[] = [
    {
        name: "Avalanche",
        link: sponsorLinks.avalanche,
        image: Avalanche,
    },
    {
        name: "Near",
        link: sponsorLinks.near,
        image: Near,
    },

    {
        name: "Fantuan Delivery",
        link: sponsorLinks.fantuan,
        image: Fantuan,
    },
    {
        name: "Smoke Poutinerie",
        link: sponsorLinks.sp,
        image: SmokesPoutinerie,
    },
    {
        name: "Dominos",
        link: sponsorLinks.domino,
        image: Dominos,
    },
    {
        name: "Nibiru",
        link: sponsorLinks.nibiru,
        image: Nibiru,
    },
    {
        name: "Distributive",
        link: sponsorLinks.distributive,
        image: Distributive,
    },
];

export { sponsors };
