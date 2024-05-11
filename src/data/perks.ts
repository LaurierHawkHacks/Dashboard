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
                "To have an edge when competing in Avalanche’s prize category/bounty, we recommend you check out the Avalanche Academy before arriving. They have numerous free courses including \"Avalanche Fundamentals\" and \"Blockchain and Subnet Architecture\" with official certifications. Showing these course certificates at the Avalanche Booth may win you a little something extra! 😉",
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
                "Fantuan is providing all our participants with free bubble tea! All you have to do to secure some is place a FREE pre-order on the HawkHacks Fantuan store!",
            link: "https://order.fantuan.ca/store/Restaurant/ca-22098?shippingType=0&inviteCode=ca09jcqrt&tTraceId=MerchantShare-22098-0-68c98f2f08c048e995841671731611b3&channel=merchant_share",
            alt: "Fantuan Delivery",
            buttonTitle: "Order Now",
        },
        {
            image: PerksIndomie,
            title: "Indomie",
            description:
                "Indomie is graciously providing all hackers with 1 cup of ramen (feel free to cook some up during HawkHacks 😉) and 1 pillow pack of ramen. Hackers can pick up their cup noodles Friday night as a late-night snack, and the pillow pack of ramen will be provided at registration.",
            link: "https://indomieonline.ca/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Indomie",
            buttonTitle: "Learn More",
        },
        {
            image: PerksSmokes,
            title: "Smokes",
            description:
                "Smokes is offering various prizes throughout HawkHacks, such as stickers, merch, and other goodies!",
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
                "As well as contributing greatly to the prize pool, NordVPN is providing a 74% coupon for NordVPN, NordPass, and NordLocker to all participants!",
            link: "https://nordvpn.com/hackathons/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "NordVPN & NordPass",
            buttonTitle: "Get NordVPN & NordPass",
        },
        {
            image: PerksIncogni,
            title: "Incogni",
            description:
                "Incogni will award our top 16 hackers with one-year subscriptions to their product, Incogni. This product empowers users to regain control of their data, minimize spam, and thwart scam attempts by seamlessly opting them out of data broker databases.",
            link: "https://incogni.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Incogni",
            buttonTitle: "null",
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
                "As well as contributing to the winner prize pool, 1Password is graciously providing all participants 1 year free of 1Password Families to new users!",
            link: "https://start.1password.com/signup/plan?c=HACK-TG35J694",
            alt: "1Password",
            buttonTitle: "Sign Up",
        },
        {
            image: PerksWolfram,
            title: "Wolfram",
            description:
                "As well as contributing to the winner prize pool, Wolfram is giving all HawkHack participants access to Wolfram|One for 30 days.",
            link: "https://account.wolfram.com/redeem/zHawkHacks424",
            alt: "Wolfram",
            buttonTitle: "Explore Wolfram",
        },
        {
            image: PerksTaskade,
            title: "Taskade",
            description:
                "As well as contributing to the winner prize pool, Taskade is giving all hackers promo codes for 20% off their starter tier! ",
            link: "https://www.taskade.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Taskade",
            buttonTitle: "Sign Up",
        },
        {
            image: PerksBalsamiq,
            title: "Balsamiq",
            description:
                "Balsamiq is providing all HawkHack attendees with a 60-day extended trial of Balsamiq Cloud - their effortless wireframing too valued by product managers, founders, developers, & UX teams. Make sure to use code “BQHACK60” after creating an account!",
            link: "https://balsamiq.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Balsamiq",
            buttonTitle: "Start Trial",
        },
        {
            image: PerksEcho3D,
            title: "Echo3D",
            description:
                "Echo3D is giving all hackers a 1-month Pro-Tier subscription to Echo3D to all HawkHacks participants. Tech support will be available via Discord during the weekend.",
            link: "https://console.echo3d.com/#/auth/register-promo?code=April2024echo944",
            alt: "Echo3D",
            buttonTitle: "Try Now",
        },
        {
            image: PerksRosenfield,
            title: "Rosenfeld",
            description:
                "Rosenfeld will give 20% discount promos when checking out using the provided link for all participants.",
            link: "https://rosenfeldmedia.com/hawkhacks",
            alt: "Rosenfeld",
            buttonTitle: "Get 20% Off",
        },
        {
            image: PerksCertopus,
            title: "Certopus",
            description:
                "Come back soon to see what they’re giving away!",
            link: null,
            alt: "Certopus",
            buttonTitle: null,
        },
    ],
}

export { perksData };