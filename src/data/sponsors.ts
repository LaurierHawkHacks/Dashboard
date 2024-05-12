import { sponsorLinks } from "./sponsorLinks";
import {
    Avalanche,
    Near,
    Distributive,
    SmokesPoutinerie,
    Neurelo,
    Metis,
    Fantuan,
    Dominos,
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
        name: "Distributive",
        link: sponsorLinks.distributive,
        image: Distributive,
    },
    {
        name: "Smoke Poutinerie",
        link: sponsorLinks.sp,
        image: SmokesPoutinerie,
    },
    {
        name: "Neurelo",
        link: sponsorLinks.neurelo,
        image: Neurelo,
    },
    {
        name: "Metis",
        link: sponsorLinks.metis,
        image: Metis,
    },
    {
        name: "Fantuan Delivery",
        link: sponsorLinks.fantuan,
        image: Fantuan,
    },
    {
        name: "Dominos",
        link: sponsorLinks.dominos,
        image: Dominos,
    },

];

export { sponsors };
