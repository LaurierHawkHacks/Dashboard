/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useEpg, Epg, Layout, ProgramItem, Theme } from "@nessprim/planby-pro";
import { endOfDay, formatISO } from "date-fns";
import { EventItem } from "@/services/utils/types";
import { getRedeemableItems } from "@/services/utils";
import { Modal } from "@/components/Modal";
import { Button } from "@/components";

import {
    ProgramBox,
    ProgramContent,
    ProgramFlex,
    ProgramStack,
    ProgramTitle,
    ProgramText,
    ProgramImage,
    useProgram,
} from "planby";

const CustomItem = ({
    program,
    onClick,
    ...rest
}: ProgramItem & { onClick: (program: ProgramItem) => void }) => {
    const { isLive, isMinWidth, styles, formatTime, set12HoursTimeFormat } =
        useProgram({
            program,
            ...rest,
        });
   
   
        
    const { data } = program;
    const { image, title, since, till, type } = data;

    const sinceTime = formatTime(since, set12HoursTimeFormat()).toLowerCase();
    const tillTime = formatTime(till, set12HoursTimeFormat()).toLowerCase();

    return (
        <ProgramBox
            width={styles.width}
            style={styles.position}
            onClick={() => onClick(program)}
            
        >
            <ProgramContent width={styles.width} isLive={isLive}>
                <ProgramFlex>
                    {isLive && isMinWidth && (
                        <ProgramImage src={image} alt="Preview" />
                    )}
                    <ProgramStack>
                        <ProgramTitle>{title}</ProgramTitle>
                        <ProgramText>
                            {sinceTime} - {tillTime}
                        </ProgramText>
                    </ProgramStack>
                </ProgramFlex>
            </ProgramContent>
        </ProgramBox>
    );
};

const lightTheme: Theme = {
    primary: {
        600: "#767d8a",
        900: "#ffffff",
    },
    grey: {
        300: "#f5f5f5",
    },
    white: "#ffffff",
    green: {
        200: "#e0e0e0",
        300: "#bdbdbd",
    },
    loader: {
        teal: "#80cbc4",
        purple: "#ce93d8",
        pink: "#f48fb1",
        bg: "#ffffff",
    },
    scrollbar: {
        border: "#e0e0e0",
        thumb: {
            bg: "#bdbdbd",
        },
    },
    gradient: {
        blue: {
            300: "#d1d5db",
            600: "#9ca3af",
            900: "#6b7280",
        },
    },
    text: {
        grey: {
            300: "#4b5563",
            500: "#374151",
        },
    },
    timeline: {
        divider: {
            bg: "#e0e0e0",
        },
    },
    teal: {
        100: ""
    },
    grid: {
        item: "#e0e0e0",
        divider: "#e0e0e0",
        highlight: ""
    }
};
    
function calculateInitialScrollPositions(startTime: string | number | Date) {
    const startDate = new Date(startTime);
    const hourWidth = 2900 / 24;
    const scrollLeft = (startDate.getHours() + startDate.getMinutes() / 60) * hourWidth;
    return { top: 0, left: scrollLeft };
}

export const SchedulePage: React.FC = () => {

    const [eventsByDay, setEventsByDay] = useState<{ [key: string]: EventItem[] }>({
        '2024-05-17': [],
        '2024-05-18': [],
        '2024-05-19': [],
    });

    //for the day selection button
    const [selectedDay, setSelectedDay] = useState('2024-05-17');
    // for the search bar
    const [searchTerm, setSearchTerm] = useState('');  
    //dropdown for search bar
    const [showDropdown, setShowDropdown] = useState(false);
    //for modal
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleEventClick = (event: EventItem) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleProgramClick = (programId: string) => {
        const event = eventsByDay[selectedDay].find(e => e.id === programId);
        if (event) {
            handleEventClick(event);
        }
    };
    

    const filteredEvents = useMemo(() => {
        if (!searchTerm) {
            setShowDropdown(false);
            return [];
        }
        let allEvents: any[] = [];
        Object.values(eventsByDay).forEach(dayEvents => {
            allEvents = allEvents.concat(dayEvents);
        });
        const filtered = allEvents.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setShowDropdown(filtered.length > 0);
        return filtered;
    }, [eventsByDay, searchTerm]);

    
    const epg = useMemo(() => {
        return eventsByDay[selectedDay].map((e) => ({
            channelUuid: e.type,
            id: e.id,
            title: e.title,
            description: e.description,
            since: formatISO(e.startTime.toDate()),
            till: formatISO(e.endTime.toDate()),
            image: "",
        }));
    }, [eventsByDay, selectedDay, filteredEvents]);

    const { getEpgProps, getLayoutProps } = useEpg({
        epg,
        channels: [
            { logo: "", uuid: "Important" },
            { logo: "", uuid: "Workshop" },
            { logo: "", uuid: "Food" },
            { logo: "", uuid: "Game/Chill" },
            { logo: "", uuid: "Networking" },
        ],
        startDate: `${selectedDay}T00:00:00-04:00`,
        endDate: `${selectedDay}T23:59:59-04:00`,
        height: 600,
        dayWidth: 2900,
        isBaseTimeFormat: true,
        isCurrentTime: true,
        timezone: { enabled: true, mode: "utc", zone: "America/Toronto" },
        grid: { enabled: true },
        overlap: { enabled: true, mode: "stack" },
        isTimeline: true,
        timelineHeight: 60,
        itemHeight: 70,
        isInitialScrollToNow: false,
        initialScrollPositions: epg.length > 0 ? calculateInitialScrollPositions(epg[0].since) : undefined,
        isSidebar: false,
        theme: lightTheme,
    });

      useEffect(() => {
        const fetchAllData = async () => {
            const days = ['2024-05-17', '2024-05-18', '2024-05-19'];
            const eventsByDayTemp = {};
            for (const day of days) {
                const [events] = await getRedeemableItems(day);
                eventsByDayTemp[day] = events;
            }
            setEventsByDay(eventsByDayTemp);
        };
        fetchAllData();
    }, []);

    const DayButtons = () => (
        <div className="flex justify-evenly mb-5">
            {Object.keys(eventsByDay).map(day => (
                <button
                    key={day}
                    className={`px-6 py-3 hover:text-charcoalBlack focus:outline-none
                                ${selectedDay === day 
                                  ? 'text-2xl border-b-4 border-orange-500 text-charcoalBlack font-bold' 
                                  : 'text-2xl text-gray-500'}`}
                    onClick={() => setSelectedDay(day)}
                >
                    {new Date(day).toLocaleDateString(undefined, { weekday: 'long' })}
                </button>
            ))}
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">
                    HawkHacks Hackathon starts at XX:XXPM! All times are in EST.
                </h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search for something!"
                        className="form-input rounded-full px-4 py-3 pl-10 w-96 border-none bg-search-bar text-gray-700"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <svg className="w-4 h-4 absolute left-3 top-4 text-gray-600" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {showDropdown && (
                        <div className="absolute z-10 w-full bg-white shadow-lg max-h-60 overflow-auto">
                            {filteredEvents.map(event => (
                                <div
                                    key={event.id}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                    onClick={() => {
                                        setSearchTerm(event.title);
                                        setShowDropdown(false);
                                        handleEventClick(event);
                                    }}
                                >
                                    {event.title} - {new Date(event.startTime.toDate()).toLocaleDateString()}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Modal for Event Details */}
            {isModalOpen && selectedEvent && (
                <Modal open={isModalOpen} onClose={handleCloseModal} title={""} subTitle={""}>
                    <h2>{selectedEvent.title}</h2>
                    <p>{selectedEvent.description}</p>
                    <p>Location: {selectedEvent.location}</p>
                    <p >Start Time: {selectedEvent.startTime.toLocaleString()}</p>
                    <p>End Time: {selectedEvent.endTime.toLocaleString()}</p>
                    <Button onClick={() => setIsModalOpen(false)}>Cool!</Button>
                </Modal>
            )}
            <DayButtons />
            <div>
                <Epg {...getEpgProps()}>
                    <Layout
                        {...getLayoutProps()}
                        renderProgram={({ program, ...rest }) => (
                            <CustomItem
                                key={program.data.id}
                                program={program}
                                onClick={() => {
                                    handleProgramClick(program.data.id);
                                }}
                                {...rest}
                            />
                        )}
                    />
                </Epg>
            </div>
        </div>
    );
};