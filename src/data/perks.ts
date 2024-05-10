import {
    Perks1Password,
    PerksBalsamiq,
    PerksCertopus,
    PerksEcho3D,
    PerksFantuan,
    PerksIncogni,
    PerksIndomie,
    PerksNordVPN,
    PerksRosenfield,
    PerksSmokes,
    PerksTaskade,
    PerksWolfram,
    PerksNEAR,
    PerksAvalanche,
    PerksDistributive,
    PerksNeurelo,
    PerksMetis,
    PerksDeFiBlocks,
} from "@/assets";

export interface PerksData {
    image: string;
    title: string;
    description: string;
    link: string | null;
    alt: string;
    buttonTitle: string | null;
}

const perksData: {
    featured: PerksData[];
    food: PerksData[];
    other: PerksData[];
} = {
    featured: [
        {
            image: PerksNEAR,
            title: "NEAR",
            description: "NEAR is one of our titular sponsors - come back soon to see what they’re giving away!",
            link: null,
            alt: "NEAR",
            buttonTitle: null,
        },
        {
            image: PerksAvalanche,
            title: "Avalanche",
            description:
                "To have an edge when competing in Avalanche’s prize category/bounty, we recommend you check out the Avalanche Academy before arriving. They have numerous free courses including 'Avalanche Fundamentals' and 'Blockchain and Subnet Architecture' with official certifications. Showing these course certificates at the Avalanche Booth may win you a little something extra! 😉",
            link: "https://academy.avax.network/?utm_source=ambassador-dao",
            alt: "Avalanche",
            buttonTitle: "Get Your Certificate",
        },
        {
            image: PerksDistributive,
            title: "Distributive",
            description: "Distributive is one of our titular sponsors - come back soon to see what they’re giving away!",
            link: null,
            alt: "Distributive",
            buttonTitle: null,
        },
        {
            image: PerksNeurelo,
            title: "Neurelo",
            description: "Neurelo is one of our titular sponsors - come back soon to see what they’re giving away!",
            link: null,
            alt: "Neurelo",
            buttonTitle: null,
        },
        {
            image: PerksMetis,
            title: "Metis",
            description: "Metis is one of our titular sponsors - come back soon to see what they’re giving away!",
            link: null,
            alt: "Metis",
            buttonTitle: null,
        },
    ],
    food: [
        {
            image: PerksFantuan,
            title: "Fantuan",
            description:
                "Fantuan is providing all our participants with free bubble tea! All you'll have to do to secure some is place a FREE order on the HawkHacks Fantuan store!",
            link: "https://order.fantuan.ca/store/Restaurant/ca-22098?shippingType=0&inviteCode=ca09jcqrt&tTraceId=MerchantShare-22098-0-68c98f2f08c048e995841671731611b3&channel=merchant_share",
            alt: "Fantuan Delivery",
            buttonTitle: "Order Now",
        },
        {
            image: PerksIndomie,
            title: "Indomie",
            description:
                "Indomie has graciously provided all hackers 1 cup noodle (feel free to cook some up during HawkHacks 😉) and 1 pillow pack of ramen. Hackers will have the opportunity to pick up their cup noodle Friday night as a late-night snack, and the pillow pack of ramen will be provided once you check-in at registration.",
            link: null,
            alt: "Indomie",
            buttonTitle: null,
        },
        {
            image: PerksSmokes,
            title: "Smokes",
            description:
                "Smokes will be offering various prizes throughout the duration of the HawkHacks weekend, such as stickers, merch, and other goodies!",
            link: "https://smokespoutinerie.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Smokes Poutinerie",
            buttonTitle: "Learn More",
        },
    ],
    other: [
        {
            image: PerksNordVPN,
            title: "NordVPN & NordPass",
            description:
                "NordVPN has collaborated with HawkHacks to provide the top 16 victors a full year's access to NordVPN and NordPass.",
            link: "https://nordvpn.com/hackathons/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "NordVPN & NordPass",
            buttonTitle: "Get NordVPN & NordPass",
        },
        {
            image: PerksIncogni,
            title: "Incogni",
            description:
                "Incogni will award our top 16 hackers with one-year subscriptions to their product, Incogni. This product empowers users to regain control of their data, minimize spam, and thwart scam attempts by seamlessly opting them out of data broker databases.",
            link: null,
            alt: "Incogni",
            buttonTitle: null,
        },
        {
            image: PerksDeFiBlocks,
            title: "DeFi Blocks",
            description: "DeFi Blocks is one of our titular sponsors - come back soon to see what they’re giving away!",
            link: null,
            alt: "DeFi Blocks",
            buttonTitle: null,
        },
        {
            image: Perks1Password,
            title: "1Password",
            description:
                "1Password has graciously provided all hackers who attend HawkHacks 1 year free of 1Password Families! (note: offer is valid for new signups only)",
            link: "https://1password.com",
            alt: "1Password",
            buttonTitle: "Sign Up",
        },
        {
            image: PerksWolfram,
            title: "Wolfram",
            description:
                "Wolfram will be providing the top six teams the Wolfram Award, regardless of whether solutions include Wolfram Tech. This award provides a year of Wolfram|One Personal Edition, as well as a one-year subscription to Wolfram|Alpha Pro. Additionally, Wolfram will be giving all HawkHack participants access to Wolfram|One for 30 days.",
            link: "https://www.wolframalpha.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Wolfram",
            buttonTitle: "Explore Wolfram",
        },
        {
            image: PerksTaskade,
            title: "Taskade",
            description:
                "Taskade will provide 40 HawkHack winners with 3-year upgrades to Taskade's starter plan. Taskade will give all HawkHack participants promo codes for 20% off their plans.",
            link: null,
            alt: "Taskade",
            buttonTitle: null,
        },
        {
            image: PerksBalsamiq,
            title: "Balsamiq",
            description:
                "Balsamiq will be providing all HawkHack attendees 60-day extended trial of Balsamiq Cloud. Balsamiq Cloud is an effortless wireframing tool, a low-fidelity, high-impact tool highly valued by product managers, founders, developers, & UX teams.",
            link: "https://balsamiq.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Balsamiq",
            buttonTitle: "Start Trial",
        },
        {
            image: PerksEcho3D,
            title: "Echo3D",
            description:
                "Echo3D will give all HawkHack participants a 1-month Pro tier subscription. Recorded workshop about 3D/AR/VR and how to use echo3D, as well as tech support via Discord will be available to hackers during the weekend.",
            link: "https://www.echo3d.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Echo3D",
            buttonTitle: "Learn More",
        },
        {
            image: PerksRosenfield,
            title: "Rosenfeld",
            description:
                "Rosenfeld will give 20% discount promos when checking out using the provided link for all HawkHacks attendees.",
            link: "https://rosenfeldmedia.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Rosenfeld",
            buttonTitle: "Get 20% Off",
        },
        {
            image: PerksCertopus,
            title: "Certopus",
            description:
                "Certopus will be providing free-verified e-certificates for all HawkHack attendees who complete their courses.",
            link: null,
            alt: "Certopus",
            buttonTitle: "Get Certified",
        },
    ],
}

export { perksData };