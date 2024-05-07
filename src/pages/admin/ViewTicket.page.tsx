import { Button } from "@/components";
import { useAuth } from "@/providers/auth.provider";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    EventItem,
    FoodItem,
    type ExtendedTicketData,
} from "@/services/utils/types";
import { getExtendedTicketData } from "@/services/utils/ticket";
import { useNotification } from "@/providers/notification.provider";
import { getRedeemableItems, getResume, redeemItem } from "@/services/utils";
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
    const [events, setEvents] = useState<EventItem[]>([]);
    const [foods, setFoods] = useState<EventItem[]>([]);

    useEffect(() => {
        if (!ticketId) return;
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsLoading(false), 1500);

        (async () => {
            if (!currentUser) return navigate("/login");

            if (!currentUser.hawkAdmin) return navigate("/ticket/" + ticketId);

            const res = await getExtendedTicketData(ticketId);
            const [e, f] = await getRedeemableItems();
            if (res.status == 200) {
                setTicketData(res.data);
                setEvents(e);
                setFoods(f);
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

    const checkEvent = async (e: EventItem) => {
        if (!ticketData) return;
        if (ticketData?.events.includes(e.id) || !ticketId) return;

        try {
            const res = await redeemItem(ticketId, e.id, "event");
            if (res.status === 200) {
                showNotification({
                    title: "Event Item Checked!",
                    message: "",
                });
                ticketData.events.push(e.id);
                setTicketData({ ...ticketData });
            } else {
                showNotification({
                    title: "Failed to check event item",
                    message: res.message,
                });
            }
        } catch (e) {
            showNotification({
                title: "Failed to check event item",
                message: (e as Error).message,
            });
        }
    };

    const checkFood = async (f: FoodItem) => {
        if (!ticketData) return;
        if (ticketData?.foods.includes(f.id) || !ticketId) return;

        // try {
        //     const res = await redeemItem(ticketId, e.id, "event");
        //     if (res.status === 200) {
        //         showNotification({
        //             title: "Event Item Checked!",
        //             message: "",
        //         });
        //         ticketData.events.push(e.id);
        //         setTicketData({ ...ticketData });
        //     } else {
        //         showNotification({
        //             title: "Failed to check event item",
        //             message: res.message,
        //         });
        //     }
        // } catch (e) {
        //     showNotification({
        //         title: "Failed to check event item",
        //         message: (e as Error).message,
        //     });
        // }
    };

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
                <h2 className="font-medium text-lg mb-4">Events</h2>
                <ul className="divide-y divide-gray-300 space-y-4">
                    {events.map((e) => (
                        <li key={e.id}>
                            <div className="flex items-center gap-4">
                                <span>{e.title}</span>
                                <button
                                    className="p-2 bg-tbrand text-white rounded disabled:bg-gray-400"
                                    disabled={ticketData.events.includes(e.id)}
                                    onClick={() => checkEvent(e)}
                                >
                                    Check
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Foods</h2>
                <ul>
                    {foods.map((f) => (
                        <li key={f.id}>
                            <div>
                                <span>{f.title}</span>
                                <button
                                    className="p-2 bg-tbrand text-white rounded disabled:bg-gray-400"
                                    disabled={ticketData.foods.includes(f.id)}
                                    onClick={() => checkFood(f)}
                                >
                                    Check
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
