import { DayPilotCalendar, DayPilot } from "daypilot-pro-react";
import React, { useState } from "react";
import { eventsData, EventData } from "./EventData"; 
import { Modal } from "@/components/Modal";
import { Button } from "@/components";



export const SchedulePage: React.FC = () => {
    const [events] = useState<DayPilot.EventData[]>(eventsData.map((event: EventData) => {
        const start = new DayPilot.Date(event.date);
        const end = new DayPilot.Date(event.date).addHours(event.duration);
        const startTime = start.toString("h:mm tt");
        const endTime = end.toString("h:mm tt");

        return {
            start: start,
            end: end,
            id: DayPilot.guid(),
            text: `${event.title}\n${event.location}\n${startTime} to ${endTime}`, 
            resource: event.location,
            barColor: event.color,
            backColor: event.color,
            data: event,
        };
    }));

    const startDate = new DayPilot.Date(new Date(2024, 4, 17, 9, 0)); // hardcode the start date to May 17th, 2024
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    console.log("Selected Event:", selectedEvent);

    return (
        <div className="bg-white rounded-lg drop-shadow-lg p-6 mb-6">
            <h1 className="text-sm pb-3">HawkHacks Hackathon starts at XX:XXPM! All times are in EST.</h1>
            <div className="h-400">
                <DayPilotCalendar
                    startDate={startDate}
                    days={3}
                    headerDateFormat={"dddd"}
                    events={events}
                    eventMoveHandling="Disabled"
                    onEventClick={(args) => {
                        console.log("Clicked Event:", args.e.data);
                        setSelectedEvent(args.e.data);
                        setIsModalOpen(true);
                    }}
                />
            </div>
            {selectedEvent && (
                <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedEvent ? selectedEvent.title : ""}
                subTitle={selectedEvent ? selectedEvent.subTitle || "" : ""}
            >
                {selectedEvent && (
                    <div>
                        <p>Location: {selectedEvent.location}</p>
                        <p>Description: {selectedEvent.description || ""}</p>
                        <Button onClick={() => setIsModalOpen(false)}>Cool!</Button>
                    </div>
                )}
            </Modal>
            
            )}
        </div>
    );
    
};