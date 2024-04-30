import { GoHome } from "react-icons/go";
import { PiCalendarCheckFill } from "react-icons/pi";
import { TiGroup } from "react-icons/ti";
import { PiIdentificationBadgeFill } from "react-icons/pi";
import { RiDiscordLine } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/hooks";
import Hamburger from "hamburger-react";
import { Link } from "react-router-dom";
import { Logo } from "@/assets";
import { useAvailableRoutes } from "@/providers/routes.provider";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { UserGroupIcon } from "@heroicons/react/24/solid";

export const Navbar = () => {
    const { logout } = useAuth();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { userRoutes, paths } = useAvailableRoutes();
    const navItems = {
        [paths.portal]: {
            label: "Home",
            Icon: GoHome,
        },
        [paths.schedule]: {
            label: "Schedule",
            Icon: PiCalendarCheckFill,
        },
        [paths.networking]: {
            label: "Networking",
            Icon: TiGroup,
        },
        [paths.ticket]: {
            label: "Ticket",
            Icon: PiIdentificationBadgeFill,
        },
        [paths.application]: {
            label: "Application",
            Icon: CodeBracketIcon,
        },
        [paths.myTeam]: {
            label: "My Team",
            Icon: UserGroupIcon,
        },
    };

    const updateNavbarState = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        window.addEventListener("resize", updateNavbarState);
        return () => {
            window.removeEventListener("resize", updateNavbarState);
        };
    }, []);

    const renderNavItems = (isMobile: boolean) => {
        return userRoutes
            .filter(({ path }) => !!navItems[path as string])
            .map(({ path }) => {
                const { label, Icon } = navItems[path as string];
                return (
                    <Link key={label} to={path as string} className="w-full">
                        <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
                            {isMobile ? (
                                label
                            ) : (
                                <>
                                    <Icon className="w-8 h-8" />
                                    <span className="hidden md:flex">
                                        {label}
                                    </span>
                                </>
                            )}
                        </li>
                    </Link>
                );
            });
    };

    return (
        <>
            {isMobile ? (
                <>
                    <nav className="flex items-center justify-between p-4 text-white border-b-2 border-b-gray-300">
                        <div className="flex items-center justify-start">
                            <Link
                                className="flex gap-4 items-center z-10"
                                to="/profile"
                            >
                                <img
                                    className="h-10 w-10"
                                    src={Logo}
                                    alt="HawkHacks Logo"
                                />
                            </Link>
                        </div>
                        <div className="z-20">
                            <Hamburger
                                toggled={isMobileMenuOpen}
                                toggle={setMobileMenuOpen}
                                size={24}
                                color="black"
                                label="Show navigation menu"
                            />
                        </div>
                    </nav>

                    <div
                        className={`fixed right-0 top-0 h-full max-w-full p-10 py-24 bg-gray-200 backdrop-blur-xl transition-all duration-300 ease-in-out ${
                            isMobileMenuOpen
                                ? "translate-x-0 opacity-100"
                                : "translate-x-full opacity-0"
                        }`}
                    >
                        <ul className="flex flex-col items-start justify-start">
                            {renderNavItems(true)}
                            <a
                                href="https://discord.com/invite/GxwvFEn9TB"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                            >
                                <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
                                    Discord Support
                                </li>
                            </a>
                        </ul>
                        <button
                            className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full flex items-center justify-start gap-2 hover:text-black"
                            type="button"
                            onClick={logout}
                        >
                            Sign out
                        </button>
                    </div>
                </>
            ) : (
                <nav
                    className={
                        "h-screen p-4 bg-white transition-all duration-300 gap-12 flex-col w-[60px] font-medium text-cadetBlue hidden md:block md:fixed md:inset-y-0 md:z-10 md:w-72 border-r-2 border-r-gray-300"
                    }
                >
                    <div className="flex items-start justify-start p-4">
                        <Link
                            className="flex gap-4 items-center justify-start"
                            to={paths.portal}
                        >
                            <img
                                className="h-10 w-10"
                                src={Logo}
                                alt="HawkHacks Logo"
                            />
                            <span className="hidden md:flex text-2xl font-bold text-black">
                                HawkHacks
                            </span>
                        </Link>
                    </div>

                    <aside className="flex flex-col items-start justify-between h-[90%]">
                        <ul className="flex flex-col items-start justify-start gap-4 w-full">
                            {renderNavItems(false)}
                            <a
                                href="https://discord.com/invite/GxwvFEn9TB"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                            >
                                <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
                                    <RiDiscordLine size={32} />
                                    Discord Support
                                </li>
                            </a>
                        </ul>

                        <button
                            className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full flex items-center justify-start gap-2 hover:text-black"
                            type="button"
                            onClick={logout}
                        >
                            <FiLogOut size={32} />
                            <span className="hidden md:flex">Sign out</span>
                        </button>
                    </aside>
                </nav>
            )}
        </>
    );
};
