import { RiDiscordLine } from "react-icons/ri";
import { FiLogOut, FiMapPin } from "react-icons/fi";
import { RxStar } from "react-icons/rx";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/hooks";
import Hamburger from "hamburger-react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/assets";
import { useAvailableRoutes } from "@/providers/routes.provider";
import {
    CalendarDaysIcon,
    CodeBracketIcon,
    HomeIcon,
    ShareIcon,
    TicketIcon,
    UserGroupIcon,
} from "@heroicons/react/24/outline";

export const Navbar = () => {
    const { logout } = useAuth();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { userRoutes, paths } = useAvailableRoutes();
    const { currentUser, userApp } = useAuth();

    const navItems = {
        [paths.portal]: {
            label: "Home",
            Icon: HomeIcon,
        },
        [paths.schedule]: {
            label: "Schedule",
            Icon: CalendarDaysIcon,
        },
        [paths.networking]: {
            label: "Networking",
            Icon: ShareIcon,
        },
        [paths.myTicket]: {
            label: "My Ticket",
            Icon: TicketIcon,
        },
        [paths.application]: {
            label: "Application",
            Icon: CodeBracketIcon,
        },
        [paths.myTeam]: {
            label: "My Team",
            Icon: UserGroupIcon,
        },
        [paths.perks]: {
            label: "Perks",
            Icon: RxStar,
        },
        [paths.location]: {
            label: "Location",
            Icon: FiMapPin,
            externalLink: "https://www.google.com/maps/place/Your+Location/",
        },
    };

    const location = useLocation();

    const updateNavbarState = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    const firstName =
        userApp?.firstName ||
        currentUser?.displayName?.split(" ")[0] ||
        "Unknown";

    useEffect(() => {
        window.addEventListener("resize", updateNavbarState);
        return () => {
            window.removeEventListener("resize", updateNavbarState);
        };
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const renderNavItems = (isMobile: boolean) => {
        return userRoutes
            .filter(({ path }) => !!navItems[path as string])
            .map(({ path }) => {
                const { label, Icon } = navItems[path as string];
                if (
                    (path === paths.myTeam &&
                        !window.localStorage.getItem(path)) ||
                    (path === paths.myTicket &&
                        !window.localStorage.getItem(path)) ||
                    (path === paths.perks && !window.localStorage.getItem(path))
                ) {
                    return (
                        <Link
                            key={label}
                            to={path as string}
                            className="relative w-full"
                        >
                            <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
                                {isMobile ? (
                                    <>
                                        <Icon className="w-4 h-4" />
                                        <span className="relative">
                                            {label}

                                            <span className="absolute flex h-2 w-2 top-0 right-0 translate-x-full">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                            </span>
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Icon className="w-8 h-8" />
                                        <span className="relative hidden md:flex">
                                            {label}
                                            <span className="absolute flex h-2 w-2 top-0 right-0 translate-x-full">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                            </span>
                                        </span>
                                    </>
                                )}
                            </li>
                        </Link>
                    );
                }

                return (
                    <Link key={label} to={path as string} className="w-full">
                        <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
                            {isMobile ? (
                                <>
                                    <Icon className="w-4 h-4" />
                                    <span>{label}</span>
                                </>
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
                        <div>
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
                        className={`fixed z-20 right-0 top-0 h-full max-w-full p-10 py-24 bg-gray-200 backdrop-blur-xl transition-all duration-300 ease-in-out ${
                            isMobileMenuOpen
                                ? "translate-x-0 opacity-100"
                                : "translate-x-full opacity-0"
                        }`}
                    >
                        <div className="absolute right-2 top-2">
                            <Hamburger
                                toggled={isMobileMenuOpen}
                                toggle={setMobileMenuOpen}
                                size={24}
                                color="black"
                                label="Show navigation menu"
                            />
                        </div>
                        <ul className="flex flex-col items-start justify-start divide-y divide-charcoalBlack">
                            {currentUser && renderNavItems(true)}
                            <a
                                href="https://discord.com/invite/GxwvFEn9TB"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                            >
                                <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
                                    Location
                                </li>
                            </a>
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

                        {currentUser && (
                            <button
                                className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full flex items-center justify-start gap-2 hover:text-black"
                                type="button"
                                onClick={logout}
                            >
                                Sign out
                            </button>
                        )}
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

                    <div className="flex items-left justify-left p-4">
                        Welcome,{" "}
                        <span className="ml-1 font-bold"> {firstName} </span> !
                    </div>

                    <aside className="flex flex-col items-start justify-between h-[83%] overflow-y-auto">
                        <ul className="flex flex-col items-start justify-start gap-4 w-full">
                            {currentUser && renderNavItems(false)}
                            <a
                                href="https://maps.app.goo.gl/Fxic5XJBzZjHP4Yt5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                            >
                                <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black cursor-pointer flex items-center justify-start gap-2">
                                    <FiMapPin size={32} />
                                    Location
                                </li>
                            </a>
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
                        {currentUser && (
                            <button
                                className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full flex items-center justify-start gap-2 hover:text-black"
                                type="button"
                                onClick={logout}
                            >
                                <FiLogOut size={32} />
                                <span className="hidden md:flex">Sign out</span>
                            </button>
                        )}
                    </aside>
                </nav>
            )}
        </>
    );
};
