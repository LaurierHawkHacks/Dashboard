import { GoHome } from "react-icons/go";
import { PiCalendarCheckFill } from "react-icons/pi";
import { TiGroup } from "react-icons/ti";
import { PiIdentificationBadgeFill } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAuth } from "@providers";
import Hamburger from "hamburger-react";

const navItems = [
    { path: "/profile", label: "Home", Icon: GoHome },
    { path: "/schedule", label: "Schedule", Icon: PiCalendarCheckFill },
    { path: "/networking", label: "Networking", Icon: TiGroup },
    { path: "/ticket", label: "Ticket", Icon: PiIdentificationBadgeFill },
];

export const Navbar = () => {
    const { logout } = useAuth();

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const updateNavbarState = () => {
        setIsMobile(window.innerWidth <= 768);
    };

    useEffect(() => {
        window.addEventListener("resize", updateNavbarState);
        return () => {
            window.removeEventListener("resize", updateNavbarState);
        };
    }, []);

    const renderNavItems = (isMobile: boolean) =>
        navItems.map(({ path, label, Icon }) => (
            <li
                key={label}
                className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full hover:text-black"
            >
                <a
                    href={path}
                    className="flex items-center justify-start gap-2"
                >
                    {isMobile ? (
                        label
                    ) : (
                        <>
                            <Icon size={32} />
                            <span className="hidden md:flex">{label}</span>
                        </>
                    )}
                </a>
            </li>
        ));

    return (
        <>
            {isMobile ? (
                <>
                    <nav className="flex items-center justify-between p-4 text-white border-b-2 border-b-gray-300">
                        <div className="flex items-center justify-start">
                            <a
                                className="flex gap-4 items-center z-50"
                                href="/"
                            >
                                <img
                                    className="h-12 w-12"
                                    src="./src/assets/hh-dashboard-logo.svg"
                                    alt="HawkHacks Logo"
                                />
                            </a>
                        </div>
                        <div className="z-50">
                            <Hamburger
                                toggled={isMobileMenuOpen}
                                toggle={setMobileMenuOpen}
                                size={24}
                                color="black"
                                label="Show navigation menu"
                                className="z-50"
                            />
                        </div>
                    </nav>

                    <div
                        className={`fixed right-0 top-0 z-40 h-full w-full max-w-[65%] p-10 py-24 bg-gray-200 backdrop-blur-xl transition-transform duration-300 ease-in-out ${
                            isMobileMenuOpen
                                ? "translate-x-0 opacity-100"
                                : "translate-x-full opacity-0"
                        } `}
                    >
                        <ul className="flex flex-col items-start justify-start gap-4">
                            {renderNavItems(true)}
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
                    className={`h-screen p-4 bg-white transition-all duration-300 gap-12 flex-col w-[60px] font-medium text-cadetBlue hidden md:block md:fixed md:inset-y-0 md:z-50 md:w-72 border-r-2 border-r-gray-300`}
                >
                    <div className="flex items-start justify-start p-4">
                        <a
                            className="flex gap-4 items-center justify-start"
                            href="/"
                        >
                            <img
                                className="h-12 w-12"
                                src="./src/assets/hh-dashboard-logo.svg"
                                alt="HawkHacks Logo"
                            />
                            <span className="hidden md:flex text-2xl font-bold text-black">
                                HawkHacks
                            </span>
                        </a>
                    </div>

                    <aside className="flex flex-col items-start justify-between h-[90%]">
                        <ul className="flex flex-col items-start justify-start gap-4 w-full">
                            {renderNavItems(false)}
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
