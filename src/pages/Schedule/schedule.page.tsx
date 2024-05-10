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

    const epg = useMemo(() => {
        const { start, end } = hackathonDays[day];
        return events
            .filter(
                (evt) =>
                    isWithinInterval(evt.startTime, {
                        start,
                        end,
                    }) && isWithinInterval(evt.endTime, { start, end })
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
    }, [events, day]);

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
        dayWidth: 2900,
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
                <h1 className="text-lg mb-4">
                    HawkHacks Hackathon starts at XX:XXPM! All times are in EST.
                </h1>
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
                            <p className="font-bold col-span-1">Time</p>
                            <p className="col-span-1 text-left">
                                {format(activeProgram.since, "h:mma")} -{" "}
                                {format(activeProgram.till, "h:mma")}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 space-y-2 sm:space-y-0">
                            <p className="font-bold col-span-2 sm:col-span-1">
                                Event Details
                            </p>
                            <p className="col-span-2 sm:col-span-1 text-left">
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
