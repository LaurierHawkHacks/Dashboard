import { FC } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@components";
import type { ComponentProps } from "@/components/types";
import { useAvailableRoutes } from "@/providers/routes.provider";

export const PageWrapper: FC<ComponentProps> = ({ children }) => {
    const location = useLocation();
    const { titles } = useAvailableRoutes();

    let title = titles[location.pathname] ?? {
        main: "Wow!",
        sub: "How did you end up here?",
    };
    if (location.pathname.startsWith("/ticket")) {
        title = {
            main: "Networking",
            sub: "A quick way to connect with new people at HawkHacks!",
        };
    }

    return (
        <div>
            <Navbar />

            {/* right hand side */}
            <div className="md:pl-72">
                <div className="md:sticky top-0 z-10 shrink-0 px-6 md:py-8 py-2 border-b-2 border-b-gray-300 bg-white">
                    <h1 className="text-xl md:text-4xl text-gray-800 font-bold font-sans">
                        {title.main}
                    </h1>
                    <p className="text-md md:text-xl text-gray-500 md:mt-4 font-sans whitespace-pre-line">
                        {title.sub}
                    </p>
                    <p className="text-gray-800 mt-2">
                        Having trouble? Get help in our{" "}
                        <a
                            href="https://discord.com/invite/GxwvFEn9TB"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-600 font-bold underline"
                        >
                            Discord
                        </a>{" "}
                        support channel.
                    </p>
                </div>
                <div className="px-6 py-6">{children}</div>
            </div>
        </div>
    );
};
