import { FC } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import {
    RiDiscordLine,
    RiInstagramLine,
    RiLinkedinLine,
    RiTiktokLine,
} from "react-icons/ri";
import { SiLinktree } from "react-icons/si";

import { socialLinks } from "@/data";

interface SocialIconsProps {
    className?: string;
    color?: string;
}

interface SocialIconLinkProps {
    href: string;
    className?: string;
    Icon: React.ElementType;
    platform: string;
}

const SocialIconLink = ({
    href,
    className,
    platform,
    Icon,
}: SocialIconLinkProps) => {
    return (
        <a
            href={href}
            className={`${className} transition-colors`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit our ${platform} page to learn more about HawkHacks!`}
        >
            <Icon
                size={25}
                style={{ transition: "color 0.5s" }}
                className="text-[currentColor] transition-colors hover:text-[#0FA3B1]"
            />
        </a>
    );
};

const SocialIcons: FC<SocialIconsProps> = ({ className }) => {
    const iconsClass = `social-links flex gap-[0.625rem] ${className}`;

    return (
        <div className={iconsClass}>
            <SocialIconLink
                href={socialLinks.email}
                Icon={FaRegEnvelope}
                platform="Email"
            />
            <SocialIconLink
                href={socialLinks.linkedin}
                Icon={RiLinkedinLine}
                platform="LinkedIn"
            />
            <SocialIconLink
                href={socialLinks.discord}
                Icon={RiDiscordLine}
                platform="Discord"
            />
            <SocialIconLink
                href={socialLinks.tiktok}
                Icon={RiTiktokLine}
                platform="Tiktok"
            />
            <SocialIconLink
                href={socialLinks.instagram}
                Icon={RiInstagramLine}
                platform="Instagram"
            />
            <SocialIconLink
                href={socialLinks.linktree}
                Icon={SiLinktree}
                platform="LinkTree"
            />
        </div>
    );
};

export { SocialIcons };
