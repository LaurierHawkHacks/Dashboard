import { Button, LoadingAnimation, Select, TextInput } from "@/components";
import { useNotification } from "@/providers/notification.provider";
import { getRedeemableItems } from "@/services/utils";
import { EventItem, FoodItem } from "@/services/utils/types";
import { format, isAfter, parseISO } from "date-fns";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { firestore } from "@/services/firebase";
import { z } from "zod";

type KeyOfEventItem = keyof EventItem;
type KeyOfFoodItem = keyof FoodItem;

export const AdminManageEventsPage = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [foods, setFoods] = useState<FoodItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showNotification } = useNotification();
    const [newEvent, setNewEvent] = useState<EventItem>({
        title: "",
        description: "",
        location: "",
        type: "",
        id: "",
        startTime: "",
        endTime: "",
    });
    const [newFood, setNewFood] = useState<FoodItem>({
        title: "",
        location: "",
        time: Timestamp.now(),
        id: "",
    });

    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const timeout = 5000; // 5 seconds
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setIsLoading(false);
        }, timeout);

        (async () => {
            try {
                const [evts, fds] = await getRedeemableItems();
                setEvents(evts);
                setFoods(fds);
            } catch (e) {
                showNotification({
                    title: "Error Loading Items",
                    message: (e as Error).message,
                });
            } finally {
                if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
                setIsLoading(false);
            }
        })();
    }, []);

    const handleEventChange = (key: KeyOfEventItem, value: string) => {
        const event = { ...newEvent };
        event[key] = value;
        setNewEvent(event);
    };

    const handleFoodChange = (key: KeyOfFoodItem, value: string | Date) => {
        const food = { ...newFood };
        if (key === "time") {
            food[key] = Timestamp.fromDate(value as Date);
        } else {
            //@ts-ignore
            food[key] = value;
        }
        setNewFood(food);
    };

    const submitNewEvent: FormEventHandler = async (e) => {
        e.preventDefault();

        // validate inputs
        const res = z
            .object({
                title: z.string().min(1),
                description: z.string(),
                location: z.string().min(1),
                type: z.string().min(1),
                startTime: z.string().min(1),
                endTime: z.string().min(1),
            })
            .safeParse(newEvent);
        if (!res.success) {
            showNotification({
                title: "Missing fields in event input",
                message: res.error.issues.map((i) => i.path).join("\n"),
            });
            return;
        }

        if (
            !isAfter(parseISO(newEvent.endTime), parseISO(newEvent.startTime))
        ) {
            showNotification({
                title: "Invalid date range",
                message: "End date cannot be before start date.",
            });
            return;
        }

        // generate new id
        const id = nanoid(16);
        newEvent.id = id;

        try {
            const docRef = doc(firestore, "events", id);
            await setDoc(docRef, newEvent);
            showNotification({
                title: "Event Item Saved",
                message: "",
            });
        } catch (e) {
            console.error(e);
            showNotification({
                title: "Failed to save event item",
                message:
                    "Please open the console and send a screenshot of the error to Engineering.",
            });
        }
    };

    const submitNewFood: FormEventHandler = async (e) => {
        e.preventDefault();

        // generate new id
        const id = nanoid(16);
        newFood.id = id;

        try {
            const docRef = doc(firestore, "foods", id);
            await setDoc(docRef, newFood);
            showNotification({
                title: "Food Item Saved",
                message: "",
            });
        } catch (e) {
            console.error(e);
            showNotification({
                title: "Failed to save food item",
                message:
                    "Please open the console and send a screenshot of the error to Engineering.",
            });
        }
    };

    if (isLoading) return <LoadingAnimation />;

    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
                <form
                    className="space-y-4 col-span-2 md:col-span-1"
                    onSubmit={submitNewEvent}
                >
                    <h1 className="font-medium">Add new event</h1>
                    <TextInput
                        label="Title"
                        id="new-event-input"
                        value={newEvent.title}
                        onChange={(e) =>
                            handleEventChange("title", e.target.value)
                        }
                    />
                    <TextInput
                        label="Description"
                        id="event-description-input"
                        value={newEvent.description}
                        onChange={(e) =>
                            handleEventChange("description", e.target.value)
                        }
                    />
                    <TextInput
                        label="Location"
                        id="event-location-input"
                        value={newEvent.location}
                        onChange={(e) =>
                            handleEventChange("location", e.target.value)
                        }
                    />
                    <Select
                        label="Type"
                        options={[
                            "Important",
                            "Workshop",
                            "Food",
                            "Game/Chill",
                            "Networking",
                        ]}
                        initialValue={newEvent.type}
                        onChange={(v) => {
                            handleEventChange("type", v);
                        }}
                    />
                    <TextInput
                        label="Start Date (EST)"
                        placeholder="2024-05-17T19:00:00"
                        description="Example May 17, 2024 7:PM would be 2024-05-17T19:00:00"
                        id="start-date-input"
                        onChange={(e) => {
                            handleEventChange("startTime", e.target.value);
                        }}
                    />
                    <TextInput
                        label="End Date (EST)"
                        placeholder="2024-05-17T19:00:00"
                        description="Example May 17, 2024 7:PM would be 2024-05-17T19:00:00"
                        id="end-date-input"
                        value={newEvent.endTime}
                        onChange={(e) => {
                            handleEventChange("endTime", e.target.value);
                        }}
                    />
                    <Button type="submit">Save</Button>
                </form>
                <form
                    className="col-span-2 md:col-span-1 space-y-4"
                    onSubmit={submitNewFood}
                >
                    <h1 className="font-medium">Add new food item</h1>
                    <TextInput
                        label="Title"
                        id="new-food-input"
                        value={newFood.title}
                        onChange={(e) =>
                            handleFoodChange("title", e.target.value)
                        }
                    />
                    <TextInput
                        label="Location"
                        id="food-location-input"
                        value={newFood.location}
                        onChange={(e) =>
                            handleFoodChange("location", e.target.value)
                        }
                    />
                    <div>
                        <label htmlFor="food-time-picker" className="block">
                            Time (EST)
                        </label>
                        <input
                            type="datetime-local"
                            id="food-time-picker"
                            className="block"
                            onChange={(e) =>
                                handleFoodChange(
                                    "time",
                                    new Date(e.target.value)
                                )
                            }
                        />
                    </div>
                    <Button type="submit">Save</Button>
                </form>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="col-span-2 lg:col-span-1">
                    <h1 className="mb-4 text-xl font-bold">Events</h1>
                    <ul className="space-y-4 divide-y divide-gray-300">
                        {events.map((evt) => (
                            <li key={evt.id} className="space-y-1">
                                <p className="font-medium">Title:</p>
                                <p>{evt.title}</p>
                                <p className="font-medium">Description:</p>
                                <p>{evt.description}</p>
                                <p className="font-medium">Location:</p>
                                <p>{evt.location}</p>
                                <p className="font-medium">Type:</p>
                                <p>{evt.type}</p>
                                <p className="font-medium">Start:</p>
                                <p>
                                    {format(
                                        evt.startTime,
                                        "MMM dd, yyyy (hh:mma)"
                                    )}
                                </p>
                                <p className="font-medium">End:</p>
                                <p>
                                    {format(
                                        evt.endTime,
                                        "MMM dd, yyyy (hh:mma)"
                                    )}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-span-2 lg:col-span-1">
                    <h1 className="mb-4 font-bold text-xl">Foods</h1>
                    <ul className="space-y-4 divide-y divide-gray-300">
                        {foods.map((food) => (
                            <li key={food.id} className="space-y-1">
                                <p className="font-medium">Title:</p>
                                <p>{food.title}</p>
                                <p className="font-medium">Location:</p>
                                <p>{food.location}</p>
                                <p className="font-medium">Time:</p>
                                <p>
                                    {format(
                                        food.time.toDate(),
                                        "MMM dd, yyyy (hh:mma)"
                                    )}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
