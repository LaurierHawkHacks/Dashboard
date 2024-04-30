import { FC } from "react";

interface Sponsor {
    logo?: string;
    title?: string;
    description?: string;
    link?: string;
}

const SponsorCard: FC<Sponsor> = ({ logo, title, description, link }) => {
    return (
        <div>
            <img src={logo} alt={title} />
            <p>{title}</p>
            <p>{description}</p>
            <a href={link}>{title}</a>
        </div>
    );
};

export { SponsorCard };
