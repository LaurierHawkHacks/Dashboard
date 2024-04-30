import { sponsorLinks } from "./sponsorLinks";
import {
    Solana,
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
        name: "Solana",
        link: sponsorLinks.solana,
        image: Solana,
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
