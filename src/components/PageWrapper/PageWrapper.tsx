import { FC } from "react";
import { useLocation } from "react-router-dom";
import { titles } from "@/navigation/constants";
import { Navbar } from "@components";
import type { ComponentProps } from "@/components/types";

export const PageWrapper: FC<ComponentProps> = ({ children }) => {
    const location = useLocation();
    const title = titles[location.pathname] ?? {
        main: "Wow!",
        sub: "How did you end up here?",
    };

    return (
        <div>
            <Navbar />

            {/* right hand side */}
            <div className="md:pl-72">
                <div className="md:sticky top-0 z-10 shrink-0 px-6 md:py-8 py-2 border-b-2 border-b-gray-300 bg-white">
                    <h1 className="text-xl md:text-4xl text-gray-800 font-bold font-sans">
                        {title.main}
                    </h1>
                    <p className="text-md md:text-2xl text-gray-500 md:mt-4 font-sans">
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
