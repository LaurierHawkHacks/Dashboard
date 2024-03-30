import { GoHome } from "react-icons/go";
import { PiCalendarCheckFill } from "react-icons/pi";
import { TiGroup } from "react-icons/ti";
import { PiIdentificationBadgeFill } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { GoHomeFill } from "react-icons/go";
import { useAuth } from "@providers";

export const Navbar = () => {
    const { logout } = useAuth();
    return (
        <div
            className={`h-screen p-4 bg-white transition-all duration-300 gap-12 flex flex-col md:w-full w-[60px] font-medium text-cadetBlue`}
        >
            <div className="flex items-start justify-start p-4">
                <a className="flex gap-4 items-center justify-start" href="/">
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

            <aside className="flex flex-col items-start justify-between h-full">
                <ul className="flex flex-col items-start justify-start gap-4 w-full">
                    <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full">
                        <a
                            href="/"
                            className="flex items-center justify-start gap-2"
                        >
                            <GoHome size={32} />
                            <span className="hidden md:flex">Home</span>
                        </a>
                    </li>
                    <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full">
                        <a
                            href="/"
                            className="flex items-center justify-start gap-2"
                        >
                            <PiCalendarCheckFill size={32} />
                            <span className="hidden md:flex">Schedule</span>
                        </a>
                    </li>{" "}
                    <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full">
                        <a
                            href="/"
                            className="flex items-center justify-start gap-2"
                        >
                            <TiGroup size={32} />
                            <span className="hidden md:flex">Networking</span>
                        </a>
                    </li>{" "}
                    <li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full">
                        <a
                            href="/"
                            className="flex items-center justify-start gap-2"
                        >
                            <PiIdentificationBadgeFill size={32} />
                            <span className="hidden md:flex">Ticket</span>
                        </a>
                    </li>
                </ul>

                <button
                    className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md w-full flex items-center justify-start gap-2"
                    type="button"
                    onClick={logout}
                >
                    <FiLogOut size={32} />
                    <span className="hidden md:flex">Sign out</span>
                </button>
            </aside>
        </div>
    );
};
