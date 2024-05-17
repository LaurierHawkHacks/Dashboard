import { Button, LoadingAnimation, Select, TextInput } from "@/components";
import { useNotification } from "@/providers/notification.provider";
import { getRedeemableItems } from "@/services/utils";
import { EventItem } from "@/services/utils/types";
import { format, isAfter, parseISO } from "date-fns";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { firestore } from "@/services/firebase";
import { z } from "zod";
import { useEventsStore } from "@/stores/events.store";
import { useShallow } from "zustand/react/shallow";

type KeyOfEventItem = keyof EventItem;

export const AdminManageEventsPage = () => {
    const events = useEventsStore(useShallow((state) => state.events));
    const setEvents = useEventsStore((state) => state.setEvents);
    const addEvent = useEventsStore((state) => state.addEvent);
    const removeEvent = useEventsStore((state) => state.removeEvent);
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

    const [isEditingEvent, setIsEditingEvent] = useState(false);

    const eventFormRef = useRef<HTMLFormElement>(null);
    const foodMobileRef = useRef<HTMLDivElement>(null);

    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (events.length > 0) {
            setIsLoading(false);
            return;
        }

        const timeout = 5000; // 5 seconds
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setIsLoading(false);
        }, timeout);

        (async () => {
            try {
                const evts = await getRedeemableItems();
                setEvents(evts);
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
        const id = isEditingEvent ? newEvent.id : nanoid(16);
        newEvent.id = id;

        try {
            const docRef = doc(firestore, "events", id);
            await setDoc(docRef, newEvent);
            showNotification({
                title: "Event Item Saved",
                message: "",
            });

            if (!isEditingEvent) {
                addEvent(newEvent);
            }
        } catch (e) {
            console.error(e);
            showNotification({
                title: "Failed to save event item",
                message:
                    "Please open the console and send a screenshot of the error to Engineering.",
            });
        }

        setNewEvent({
            title: "",
            description: "",
            location: "",
            type: "",
            id: "",
            startTime: "",
            endTime: "",
        });

        setIsEditingEvent(false);
    };

    const handleEditEvent = (evt: EventItem) => {
        setNewEvent(evt);
        setIsEditingEvent(true);
        eventFormRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleDeleteEvent = async (id: string) => {
        try {
            await deleteDoc(doc(firestore, "events", id));
            removeEvent(id);
            showNotification({
                title: "Event Deleted",
                message: "",
            });
        } catch (e) {
            console.error(e);
            showNotification({
                title: "Nooooo...it can't delete event :pepecry:",
                message:
                    "Please open the console and send a screenshot of the error to Engineering.",
            });
        }
    };

    const handleCancelEdit = () => {
        setNewEvent({
            title: "",
            description: "",
            location: "",
            type: "",
            id: "",
            startTime: "",
            endTime: "",
        });

        setIsEditingEvent(false);
    };

    const scrollToFood = () => {
        foodMobileRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (isLoading) return <LoadingAnimation />;

    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
                <form
                    ref={eventFormRef}
                    className="space-y-4 col-span-2 md:col-span-1"
                    onSubmit={submitNewEvent}
                >
                    <h1 className="mb-4 text-xl font-bold">
                        {isEditingEvent ? "Edit event" : "Add new event"}
                    </h1>

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

                    <div className="flex space-x-2">
                        <Button type="submit">
                            {isEditingEvent ? "Update" : "Save"}
                        </Button>

                        {isEditingEvent && (
                            <Button
                                type="button"
                                onClick={handleCancelEdit}
                                className="bg-red-500"
                            >
                                {" "}
                                Cancel{" "}
                            </Button>
                        )}
                    </div>
                </form>
            </div>

            <hr className="my-8" />

            <span className="underline">
                {" "}
                ⚠️ Please note when updating events or foods, you must refresh
                the page to see the changes.{" "}
            </span>

            <div className="mt-4 text-center lg:hidden">
                <Button onClick={scrollToFood}> Go to Food </Button>
                <p> (ur welcome) </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="col-span-2 lg:col-span-1">
                    <h1 className="mb-4 text-xl font-bold">Events</h1>
                    <ul className="space-y-4">
                        {events.map((evt) => (
                            <li
                                key={evt.id}
                                className="bg-white p-6 shadow-lg rounded-lg"
                            >
                                <div className="mb-4">
                                    <p className="font-semibold text-lg underline">
                                        Title:
                                    </p>
                                    <p>{evt.title}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-semibold text-lg underline">
                                        Description:
                                    </p>
                                    <p>{evt.description}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-semibold text-lg underline">
                                        Location:
                                    </p>
                                    <p>{evt.location}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-semibold text-lg underline">
                                        Type:
                                    </p>
                                    <p>{evt.type}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-semibold text-lg underline">
                                        Start:
                                    </p>
                                    <p>
                                        {format(
                                            evt.startTime,
                                            "MMM dd, yyyy (hh:mma)"
                                        )}
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <p className="font-semibold text-lg underline">
                                        End:
                                    </p>
                                    <p>
                                        {format(
                                            evt.endTime,
                                            "MMM dd, yyyy (hh:mma)"
                                        )}
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <Button
                                        onClick={() => handleEditEvent(evt)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            handleDeleteEvent(evt.id)
                                        }
                                        className="bg-red-500"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};
