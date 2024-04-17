import { LoadingAnimation } from "@/components";
import { verifyRSVP } from "@/services/utils";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export const VerifyRSVP = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const verify = async () => {
            const confirmed = await verifyRSVP();
            flushSync(() => {
                setIsLoading(false);
                setVerified(confirmed);
            });
        };
        verify();
    }, []);

    if (isLoading) return <LoadingAnimation />;

    if (!verified) return <div>rsvp not verified</div>;

    return (
        <div className="fixed inset-0 bg-radial-gradient-peach overflow-y-auto">
            <div className="w-full h-full px-8 flex py-32 sm:py-60 md:py-80 items-center flex-col text-center">
                <h1 className="text-2xl sm:text-4xl whitespace-nowrap font-bold bg-clip-text text-transparent bg-gradient-to-b from-deepMarine to-tbrand-highlight">
                    Thanks for verifying your RSVP! See you soon!
                </h1>
            </div>
        </div>
    );
};
