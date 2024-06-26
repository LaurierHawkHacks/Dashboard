import {
    Perks1Password,
    PerksBalsamiq,
    PerksCertopus,
    PerksEcho3D,
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
    PerksMLH,
} from "@/assets";

export interface PerksData {
    image: string;
    title: string;
    description: string;
    link: string | null;
    alt: string;
    buttonTitle: string | null;
    actions?: {
        link: string;
        title: string;
    }[];
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
            description:
                "Providing 2 category podiums totalling to a $8,050 prize pool! Click below to see how to win.",
            link: null,
            alt: "NEAR",
            buttonTitle: null,
            actions: [
                {
                    link: "/NEAR_Track.pdf",
                    title: "NEAR at HawkHacks",
                },
                {
                    link: "/TENAMINTxGamingDao.pdf",
                    title: "TENAMINT x GamingDAO",
                },
                {
                    link: "/NEAR_Resources_v2.pdf",
                    title: "NEAR Resources",
                },
            ],
        },
        {
            image: PerksAvalanche,
            title: "Avalanche",
            description:
                'To have an edge when competing in Avalanche’s prize category/bounty, we recommend you check out the Avalanche Academy before arriving. They have numerous free courses including "Avalanche Fundamentals" and "Blockchain and Subnet Architecture" with official certifications. Showing these course certificates at the Avalanche Booth may win you a little something extra! 😉',
            link: "https://academy.avax.network/?utm_source=ambassador-dao",
            alt: "Avalanche",
            buttonTitle: "Complete Your Certificate",
        },
        {
            image: PerksDistributive,
            title: "Distributive",
            description:
                "Distributive is one of our titular sponsors - come back soon to see what they’re giving away!",
            link: null,
            alt: "Distributive",
            buttonTitle: null,
        },
        {
            image: PerksNeurelo,
            title: "Neurelo",
            description:
                "Neurelo is one of our titular sponsors - come back soon to see what they’re giving away!",
            link: null,
            alt: "Neurelo",
            buttonTitle: null,
        },
        {
            image: PerksMetis,
            title: "Metis",
            description:
                "Check out Metis's bounty to win $2.5k in stables and Metis tokens.",
            link: "https://github.com/metis-edu/Bounties/blob/main/Loyalty%20Program%20/instructions.md",
            alt: "Metis",
            buttonTitle: "View Bounty",
        },
        {
            image: PerksMLH,
            title: "MLH",
            description:
                "The prizes just keep coming! MLH, in collaboration with their partners, are hosting some really cool additional prize categories at HawkHacks. Check them out below!",
            link: "https://hack.mlh.io/hawkhacks-62/prizes",
            alt: "MLH",
            buttonTitle: "View Prizes",
        },
    ],
    food: [
        {
            image: PerksIndomie,
            title: "Indomie",
            description:
                "Indomie is graciously providing all hackers with 1 cup of ramen (feel free to cook some up during HawkHacks 😉) and 1 pillow pack of ramen. Hackers can pick up their cup noodles Friday night as a late-night snack, and the pillow pack of ramen will be provided at registration.",
            link: "https://indomieonline.ca/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Indomie",
            buttonTitle: "Shop Now",
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
                "🔐 Get NordVPN with a whopping 68% discount PLUS enjoy NordPass and NordLocker for all participants!",
            link: "https://nordvpn.com/hackathons/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "NordVPN & NordPass",
            buttonTitle: "Redeem Now",
        },
        {
            image: PerksIncogni,
            title: "Incogni",
            description:
                "🛡️ Delete your personal data from the internet with Incogni! Incogni is providing all participants with a 50% coupon to all participants!",
            link: "https://incogni.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Incogni",
            buttonTitle: "Redeem Now",
        },
        {
            image: PerksDeFiBlocks,
            title: "DeFi Blocks",
            description: "Come back soon to see what they’re giving away!",
            link: null,
            alt: "DeFi Blocks",
            buttonTitle: null,
        },
        {
            image: Perks1Password,
            title: "1Password",
            description:
                "We're proud to offer 1 year free of 1Password Families to all participants who are new users!",
            link: "https://start.1password.com/signup/plan?c=HACK-TG35J694",
            alt: "1Password",
            buttonTitle: "Redeem Now",
        },
        {
            image: PerksWolfram,
            title: "Wolfram",
            description:
                "Access to Wolfram | Reedemable for the first 500 users who sign up! Wolfram | One includes both Desktop and Cloud access, full access to the Wolfram Language, 5000 Wolfram | Alpha API calls and more!",
            link: "https://account.wolfram.com/redeem/zHawkHacks424",
            alt: "Wolfram",
            buttonTitle: "Redeem Now",
        },
        {
            image: PerksTaskade,
            title: "Taskade",
            description:
                "Taskade is giving all hackers promo codes for 20% off their starter tier and a lifetime discount! Once you sign up for free, email Taskade directly with your username, email, and the exact event details to redeem.",
            link: "https://www.taskade.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Taskade",
            buttonTitle: "Redeem Now",
        },
        {
            image: PerksBalsamiq,
            title: "Balsamiq",
            description:
                "Balsamiq is providing all HawkHack attendees with a 60-day extended trial of Balsamiq Cloud - their effortless wireframing tool valued by product managers, founders, developers, & UX teams. Make sure to use code “BQHACK60” after creating an account!",
            link: "https://balsamiq.com/?utm_medium=affiliate&utm_term=&utm_content&utm_campaign=hawkhacks24",
            alt: "Balsamiq",
            buttonTitle: "Redeem Now",
        },
        {
            image: PerksEcho3D,
            title: "Echo3D",
            description:
                "Echo3D is giving all hackers a 1-month Pro-Tier subscription to Echo3D to all HawkHacks participants. Tech support will be available via Discord during the weekend.",
            link: "https://console.echo3d.com/#/auth/register-promo?code=April2024echo944",
            alt: "Echo3D",
            buttonTitle: "Redeem Now",
        },
        {
            image: PerksRosenfield,
            title: "Rosenfeld",
            description:
                "Rosenfeld will give 20% discount promos when checking out using the provided link for all participants.",
            link: "https://rosenfeldmedia.com/hawkhacks",
            alt: "Rosenfeld",
            buttonTitle: "Shop Now",
        },
        {
            image: PerksCertopus,
            title: "Certopus",
            description: "Come back soon to see what they’re giving away!",
            link: null,
            alt: "Certopus",
            buttonTitle: null,
        },
    ],
};

export { perksData };
