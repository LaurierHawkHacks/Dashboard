import { GoHome } from "react-icons/go";
import { PiCalendarCheckFill } from "react-icons/pi";
import { TiGroup } from "react-icons/ti";
import { PiIdentificationBadgeFill } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { GoHomeFill } from "react-icons/go";

export const Navbar = () => {
    const [open, setOpen] = useState(true);

    return (
        <div
            className={`h-screen bg-white transition-all duration-300 gap-12 flex flex-col md:w-[200px] w-[60px]`}
        >
            <div>
                <a className="flex gap-4 items-center justify-center" href="/">
                    <img
                        className="h-12 w-12 mt-6"
                        src="./src/assets/hh-dashboard-logo.svg"
                        alt="HawkHacks Logo"
                    />
                    <span className="hidden md:flex">HawkHacks</span>
                </a>
            </div>

            <aside className="flex flex-col items-center justify-between h-full">
                <ul className="flex flex-col items-start justify-start gap-4">
                    <li className="flex">
                        <a
                            href="/"
                            className="flex items-center justify-start gap-2"
                        >
                            <GoHome size={32} />
                            <span className="hidden md:flex">Home</span>
                        </a>
                    </li>
                    <li className="flex">
                        <a
                            href="/"
                            className="flex items-center justify-center gap-2"
                        >
                            <PiCalendarCheckFill size={32} />
                            <span className="hidden md:flex">Home</span>
                        </a>
                    </li>{" "}
                    <li className="flex">
                        <a
                            href="/"
                            className="flex items-center justify-center gap-2"
                        >
                            <TiGroup size={32} />
                            <span className="hidden md:flex">Home</span>
                        </a>
                    </li>{" "}
                    <li className="flex">
                        <a
                            href="/"
                            className="flex items-center justify-center gap-2"
                        >
                            <PiIdentificationBadgeFill size={32} />
                            <span className="hidden md:flex">Home</span>
                        </a>
                    </li>
                </ul>

                <div className="flex items-center justify-center gap-2 mb-8">
                    <FiLogOut size={32} />
                    <span className="hidden md:flex">Sign out</span>
                </div>
            </aside>
        </div>
    );
};
