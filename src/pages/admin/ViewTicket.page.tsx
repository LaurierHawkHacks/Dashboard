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
import { getRedeemableItems, redeemItem } from "@/services/utils";
import { Button, LoadingAnimation, Modal } from "@/components";

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
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [activeEvent, setActiveEvent] = useState<EventItem | null>(null);
    const [activeFood, setActiveFood] = useState<FoodItem | null>(null);

    useEffect(() => {
        if (!ticketId) return;
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsLoading(false), 5000);

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
        } finally {
            closeModal();
        }
    };

    const checkFood = async (f: FoodItem) => {
        if (!ticketData) return;
        if (ticketData?.foods.includes(f.id) || !ticketId) return;

        try {
            const res = await redeemItem(ticketId, f.id, "food");
            if (res.status === 200) {
                showNotification({
                    title: "Food Item Checked!",
                    message: "",
                });
                ticketData.foods.push(f.id);
                setTicketData({ ...ticketData });
            } else {
                showNotification({
                    title: "Failed to check food item",
                    message: res.message,
                });
            }
        } catch (e) {
            showNotification({
                title: "Failed to check event item",
                message: (e as Error).message,
            });
        } finally {
            closeModal();
        }
    };

    const closeModal = () => {
        setActiveEvent(null);
        setActiveFood(null);
        setOpenConfirm(false);
    };

    if (isLoading) return <LoadingAnimation />;

    if (!ticketData)
        return <div>Failed to load ticket. Please ping @Juan in Discord.</div>;

    return (
        <>
            <div>
                <div className="flex items-center gap-10">
                    <h1 className="font-bold text-2xl">
                        {`${ticketData.firstName} ${ticketData.lastName}`}
                    </h1>
                    <p>{ticketData.pronouns}</p>
                </div>
                <div className="mt-12">
                    <h2 className="font-medium text-xl mb-2">Allergies</h2>
                    {ticketData.allergies.length > 0 ? (
                        <ul className="list-disc list-inside">
                            {ticketData.allergies.map((allergy, index) => (
                                <li key={index}>{allergy}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No known allergies</p>
                    )}
                </div>
                <div className="mt-12">
                    <h2 className="font-medium text-xl mb-2">Events</h2>
                    <ul className="divide-y divide-gray-300 space-y-4">
                        {events.map((e) => (
                            <li key={e.id}>
                                <div className="space-y-2">
                                    <div>
                                        <p className="font-medium">
                                            Title:
                                            <span className="ml-2 font-normal">
                                                {e.title}
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        className="p-2 bg-tbrand text-white rounded disabled:bg-gray-400"
                                        disabled={ticketData.events.includes(
                                            e.id
                                        )}
                                        onClick={() => {
                                            setActiveEvent(e);
                                            setOpenConfirm(true);
                                        }}
                                    >
                                        Check
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-12">
                    <h2 className="font-medium text-xl mb-2">Foods</h2>
                    <ul className="divide-y divide-gray-300 space-y-4">
                        {foods.map((f) => (
                            <li key={f.id}>
                                <div className="space-y-2">
                                    <div>
                                        <p className="font-medium">
                                            Title:
                                            <span className="ml-2 font-normal">
                                                {f.title}
                                            </span>
                                        </p>
                                    </div>
                                    <button
                                        className="p-2 bg-tbrand text-white rounded disabled:bg-gray-400"
                                        disabled={ticketData.foods.includes(
                                            f.id
                                        )}
                                        onClick={() => {
                                            setActiveFood(f);
                                            setOpenConfirm(true);
                                        }}
                                    >
                                        Check
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Modal
                title="Confirm Check"
                subTitle="This action cannot be undone."
                open={openConfirm}
                onClose={closeModal}
            >
                <div className="flex items-center justify-center">
                    <Button
                        onClick={() => {
                            if (activeEvent) checkEvent(activeEvent);
                            else if (activeFood) checkFood(activeFood);
                        }}
                    >
                        Confirm
                    </Button>
                </div>
            </Modal>
        </>
    );
};