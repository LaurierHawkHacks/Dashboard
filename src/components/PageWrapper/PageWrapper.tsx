import { FC } from "react";
import type { ComponentProps } from "@components";
import { useLocation } from "react-router-dom";
import { titles } from "@utils";

export const PageWrapper: FC<ComponentProps> = ({ children }) => {
    const location = useLocation();
    const title = titles[location.pathname];

    return (
        <div>
            <div className="">
                <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:z-50 lg:w-72 border-r-2 border-r-gray-300"></div>

                {/* right hand side */}
                <div className="lg:pl-72">
                    <div className="sticky top-0 z-40 shrink-0 px-6 py-8 border-b-2 border-b-gray-300 bg-white">
                        <h1 className="text-xl md:text-4xl text-gray-800 font-bold font-sans">
                            {title.main}
                        </h1>
                        <p className="text-md md:text-2xl text-gray-500 mt-4 font-sans">
                            {title.sub}
                        </p>
                    </div>
                    <div className="px-6 py-6">{children}</div>
                </div>
            </div>
        </div>
    );
};