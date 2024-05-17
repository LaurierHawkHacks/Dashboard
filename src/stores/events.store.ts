import { EventItem } from "@/services/utils/types";
import { create } from "zustand";

export interface EventStore {
    events: EventItem[];
    addEvent: (event: EventItem) => void;
    setEvents: (events: EventItem[]) => void;
}

export const useEventsStore = create<EventStore>((set) => ({
    events: [],
    addEvent: (event: EventItem) =>
        set((state) => {
            state.events.push(event);
            return state;
        }),
    setEvents: (events: EventItem[]) =>
        set((state) => {
            state.events = events;
            return state;
        }),
}));
