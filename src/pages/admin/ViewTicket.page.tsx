import { Button } from "@/components";
import { useAuth } from "@/providers/auth.provider";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ExtendedTicketData } from "@/services/utils/types";
import { getExtendedTicketData } from "@/services/utils/ticket";
import { useNotification } from "@/providers/notification.provider";
import { getResume } from "@/services/utils";
import { LoadingAnimation } from "@/components";

export const AdminViewTicketPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const timeoutRef = useRef<number | null>(null);
    const [ticketData, setTicketData] = useState<ExtendedTicketData | null>(
        null
    );
    const { showNotification } = useNotification();

    useEffect(() => {
        if (!ticketId) return;
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsLoading(false), 1500);

        (async () => {
            if (!currentUser) return navigate("/login");

            if (!currentUser.hawkAdmin) return navigate("/ticket/" + ticketId);

            const res = await getExtendedTicketData(ticketId);
            if (res.status == 200) {
                setTicketData(res.data);
            } else {
                showNotification({
                    title: "Failed to load ticket",
                    message: res.message,
                });
            }
        })();

        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, [currentUser]);

    if (isLoading) return <LoadingAnimation />;

    if (!ticketData)
        return <div>Failed to load ticket. Please ping @Juan in Discord.</div>;

    return (
        <div>
            <div className="flex items-center gap-10">
                <h1 className="font-bold text-2xl">
                    {`${ticketData.firstName} ${ticketData.lastName}`}
                </h1>
                <p>{ticketData.pronouns}</p>
            </div>
            <div>
                <h2>Events</h2>
                <ul></ul>
            </div>
            <div>
                <h2>Foods</h2>
                <ul></ul>
            </div>
            <div className="flex flex-col max-w-md gap-5 mt-12">
                {Object.keys(ticketData).map((key) => (
                    <div
                        className="bg-white shadow-md p-4 rounded-xl flex flex-col"
                        key={key}
                    >
                        <div className="mb-2 flex justify-between items-center">
                            <p className="flex-1 capitalize">{key}</p>
                        </div>
                        {/* @ts-ignore */}
                        <p>{ticketData[key]}</p>
                    </div>
                ))}
                {ticketData.resumeRef && (
                    <div className="bg-white shadow-md p-4 rounded-xl flex flex-col">
                        <div className="mb-2 flex justify-between items-center">
                            <p className="flex-1 capitalize">Resume</p>
                        </div>
                        <div>
                            <Button
                                onClick={() => {
                                    getResume(ticketData.resumeRef);
                                }}
                            >
                                Download
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
