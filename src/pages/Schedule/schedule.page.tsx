/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
    useEpg,
    Epg,
    Layout,
    ProgramItem,
    ProgramBox,
    ProgramContent,
    ProgramFlex,
    ProgramStack,
    ProgramTitle,
    ProgramText,
    useProgram,
} from "@nessprim/planby-pro";
import {
    addMinutes,
    format,
    formatISO,
    isWithinInterval,
    parseISO,
} from "date-fns";
import { EventItem } from "@/services/utils/types";
import { getRedeemableItems } from "@/services/utils";
import { cva } from "class-variance-authority";
import { Modal } from "@/components";

const programStyles = cva(["!border-none !bg-gradient-to-r"], {
    variants: {
        type: {
            Important: "from-[#19AEBC] to-[#19AEBC]",
            Workshop: "from-[#3160D9] to-[#3160D9]",
            Food: "from-[#F0A975] to-[#F0A975]",
            "Game/Chill": "from-[#AB8FF9] to-[#AB8FF9]",
            Networking: "from-[#F07584] to-[#F07584]",
        },
    },
});

interface Program {
    id: string;
    title: string;
    description: string;
    since: string;
    till: string;
    type: string;
    location: string;
}

const CustomItem = ({
    program,
    onClick,
    ...rest
}: ProgramItem & { onClick: (program: Program) => void }) => {
    const { isLive, styles, formatTime, set12HoursTimeFormat } = useProgram({
        program,
        ...rest,
    });

    const { data } = program;
    const { title, since, till, type } = data;

    const sinceTime = formatTime(since, set12HoursTimeFormat()).toLowerCase();
    const tillTime = formatTime(till, set12HoursTimeFormat()).toLowerCase();

    return (
        <ProgramBox
            width={styles.width}
            style={styles.position}
            // @ts-ignore
            onClick={() => onClick(data)}
        >
            <ProgramContent
                width={styles.width}
                className={programStyles({ type })}
                isLive={isLive}
            >
                <ProgramFlex>
                    <ProgramStack>
                        <ProgramTitle className="!font-bold">
                            {title}
                        </ProgramTitle>
                        <ProgramText className="!text-white">
                            {sinceTime} - {tillTime}
                        </ProgramText>
                    </ProgramStack>
                </ProgramFlex>
            </ProgramContent>
        </ProgramBox>
    );
};

const lightTheme = {
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
            bg: "#000000",
        },
    },
};

const hackathonDays = [
    {
        start: "2024-05-17T00:00:00",
        end: "2024-05-17T23:59:59",
    },
    {
        start: "2024-05-18T00:00:00",
        end: "2024-05-18T23:59:59",
    },
    {
        start: "2024-05-19T00:00:00",
        end: "2024-05-19T23:59:59",
    },
];

const DayButton = ({
    active,
    children,
    onClick,
}: {
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}) => {
    return (
        <button
            className={
                "col-span-1 px-3 py-4" +
                (active ? " border-b-2 border-orange-400" : "")
            }
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export const SchedulePage: React.FC = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const ref = useRef(false);
    const [day, setDay] = useState(0);
    const [activeProgram, setActiveProgram] = useState<Program | null>(null);
    const [openProgramDetailModal, setOpenProgramDetailModal] = useState(false);
    // for the search bar
    const [searchTerm, setSearchTerm] = useState("");
    //dropdown for search bar
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredEvents = useMemo(() => {
        if (!searchTerm) {
            setShowDropdown(false);
            return [];
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let allEvents: any[] = [];
        Object.values(events).forEach((dayEvents) => {
            allEvents = allEvents.concat(dayEvents);
        });
        const filtered = allEvents.filter((event) =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setShowDropdown(filtered.length > 0);
        return filtered;
    }, [events, searchTerm]);

    const epg = useMemo(() => {
        const { start, end } = hackathonDays[day];
        return events
            .filter((evt) =>
                isWithinInterval(evt.startTime, {
                    start,
                    end,
                })
            )
            .map((e) => ({
                channelUuid: e.type,
                id: e.id,
                title: e.title,
                description: e.description,
                since: e.startTime,
                till: e.endTime,
                image: "",
                type: e.type,
                location: e.location,
            }));
    }, [events, day, filteredEvents]);

    const { getEpgProps, getLayoutProps } = useEpg({
        epg,
        channels: [
            {
                logo: "",
                uuid: "Important",
            },
            {
                logo: "",
                uuid: "Workshop",
            },
            {
                logo: "",
                uuid: "Food",
            },
            {
                logo: "",
                uuid: "Game/Chill",
            },
            {
                logo: "",
                uuid: "Networking",
            },
        ],
        startDate: epg.length ? epg[0].since : "2024-05-17T18:00:00",
        endDate: epg.length
            ? formatISO(
                  addMinutes(parseISO(epg[epg.length - 1].till), 1)
              ).slice(0, -6)
            : "2024-05-18T00:00:00",
        dayWidth: 5000,
        isBaseTimeFormat: true,
        isCurrentTime: false,
        isLine: false,
        grid: {
            enabled: true,
        },
        overlap: {
            enabled: true,
            mode: "stack",
        },
        isTimeline: true,
        timelineHeight: 60,
        itemHeight: 70,
        isSidebar: false,
        height: 600,
        // @ts-ignore
        theme: lightTheme,
    });

    useEffect(() => {
        if (ref.current) return;
        (async () => {
            ref.current = true;
            const [ev] = await getRedeemableItems();
            setEvents(ev);
        })();
    }, []);

    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-800">
                <div className="flex justify-between items-center flex-col lg:flex-row mb-4">
                    <h1 className="text-lg mb-4">
                        HawkHacks Hackathon starts at 6PM! All times are in EST.
                    </h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for something!"
                            className="form-input rounded-full px-4 py-3 pl-10 w-full lg:w-96 border-none bg-searchbar text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg
                            className="w-4 h-4 absolute left-3 top-4 text-gray-600"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        {showDropdown && (
                            <div className="absolute border top-full translate-y-2 z-10 w-full bg-white shadow-xl max-h-60 overflow-auto rounded-lg">
                                {filteredEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-4 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            setShowDropdown(false);
                                            setActiveProgram({
                                                ...event,
                                                since: event.startTime,
                                                till: event.endTime,
                                            });
                                            setOpenProgramDetailModal(true);
                                        }}
                                    >
                                        {event.title} -{" "}
                                        {format(event.startTime, "hh:mma")}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <div className="grid grid-cols-3">
                        <DayButton active={day === 0} onClick={() => setDay(0)}>
                            Friday
                        </DayButton>
                        <DayButton active={day === 1} onClick={() => setDay(1)}>
                            Saturday
                        </DayButton>
                        <DayButton active={day === 2} onClick={() => setDay(2)}>
                            Sunday
                        </DayButton>
                    </div>
                    <Epg {...getEpgProps()}>
                        <Layout
                            {...getLayoutProps()}
                            renderProgram={({ program, ...rest }) => (
                                <CustomItem
                                    key={program.data.id}
                                    program={program}
                                    onClick={(p) => {
                                        setActiveProgram(p);
                                        setOpenProgramDetailModal(true);
                                    }}
                                    {...rest}
                                />
                            )}
                        />
                    </Epg>
                </div>
            </div>
            <Modal
                title={activeProgram?.title ?? ""}
                subTitle=""
                open={openProgramDetailModal}
                onClose={() => {
                    setOpenProgramDetailModal(false);
                }}
            >
                {activeProgram && (
                    <div className="px-4 space-y-6">
                        <div className="grid grid-cols-2">
                            <p className="font-bold col-span-1">Location</p>
                            <p className="col-span-1 text-left">
                                {activeProgram.location}
                            </p>
                        </div>
                        <div className="grid grid-cols-2">
                            <p className="font-bold col-span-1">Type</p>
                            <p className="col-span-1 text-left">
                                {activeProgram.type}
                            </p>
                        </div>
                        <div className="grid grid-cols-2">
                            <p className="font-bold col-span-1">Date</p>
                            <p className="col-span-1 text-left">
                                {format(activeProgram.since, "MMM dd")} -{" "}
                                {format(activeProgram.till, "MMM dd")}
                            </p>
                        </div>
                        <div className="grid grid-cols-2">
                            <p className="font-bold col-span-1">Time</p>
                            <p className="col-span-1 text-left">
                                {format(activeProgram.since, "h:mma")} -{" "}
                                {format(activeProgram.till, "h:mma")}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 space-y-2 sm:space-y-0">
                            <p className="font-bold col-span-2">
                                Event Details
                            </p>
                            <p className="col-span-2 text-left">
                                {activeProgram.description ||
                                    "Oh... looks like there are no details for this event."}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};
