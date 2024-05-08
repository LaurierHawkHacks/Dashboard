/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useEpg, Epg, Layout, ProgramItem } from "@nessprim/planby-pro";
import { formatISO } from "date-fns";
import { EventItem } from "@/services/utils/types";
import { getRedeemableItems } from "@/services/utils";

// Define the type for the date ranges
// type DateRangeKey = "2024-05-17" | "2024-05-18" | "2024-05-19";
// type DateRanges = Record<DateRangeKey, { start: Date; end: Date }>;

// const theme: Theme = {
//     primary: {
//         600: "#ffffff",
//         900: "#ffffff",
//     },
//     grey: {
//         300: "#fafafa",
//     },
//     white: "#4caf50",
//     green: {
//         200: "#4caf50",
//         300: "#4caf50",
//     },
//     loader: {
//         teal: "#80cbc4",
//         purple: "#ce93d8",
//         pink: "#f48fb1",
//         bg: "#ffffff",
//     },
//     scrollbar: {
//         border: "#dddddd",
//         thumb: {
//             bg: "#cccccc",
//         },
//     },
//     gradient: {
//         blue: {
//             300: "#e3f2fd",
//             600: "#90caf9",
//             900: "#42a5f5",
//         },
//     },
//     text: {
//         grey: {
//             300: "#222222",
//             500: "#333333",
//         },
//     },
//     timeline: {
//         divider: {
//             bg: "#bdbdbd",
//         },
//     },
// };

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
    const { image, title, since, till } = data;

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

export const SchedulePage: React.FC = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const ref = useRef(false);

    const epg = useMemo(() => {
        return events.map((e) => ({
            channelUuid: e.type,
            id: e.id,
            title: e.title,
            description: e.description,
            since: formatISO(e.startTime.toDate()),
            till: formatISO(e.endTime.toDate()),
            image: "",
        }));
    }, [events]);

    const { getEpgProps, getLayoutProps } = useEpg({
        // epg: [
        //     {
        //         channelUuid: "universal-channel",
        //         id: "event1",
        //         title: "event 1",
        //         description: "event 1",
        //         image: Logo,
        //         since: new Date(),
        //         till: addHours(new Date(), 1),
        //     },
        //     {
        //         channelUuid: "universal-channel",
        //         id: "event2",
        //         title: "event 2",
        //         description: "event 2",
        //         image: Logo,
        //         since: addHours(new Date(), 0.5),
        //         till: addHours(new Date(), 1.5),
        //     },
        // ],
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
        startDate: "2024-05-17T00:00:00-04:00",
        endDate: "2024-05-17T23:59:59-04:00",
        height: 600,
        isBaseTimeFormat: true,
        isCurrentTime: true,
        timezone: {
            enabled: true,
            mode: "utc",
            zone: "America/Toronto",
        },
        grid: {
            enabled: true,
        },
        overlap: {
            enabled: true,
            mode: "stack",
        },
        isTimeline: true,
        isInitialScrollToNow: true,
        isSidebar: false,
    });

    useEffect(() => {
        if (ref.current) return;
        (async () => {
            ref.current = true;
            const [ev] = await getRedeemableItems();
            setEvents(ev);
        })();
    }, []);

    // const DayButtons = () => (
    //     <div className="flex justify-evenly mb-5">
    //         {Object.keys(dateRanges).map((day) => (
    //             <button
    //                 key={day}
    //                 className={`px-6 py-3 hover:text-charcoalBlack focus:outline-none
    //                            ${
    //                                selectedDay === day
    //                                    ? "text-2xl border-b-4 border-orange-500 text-charcoalBlack font-bold"
    //                                    : "text-2xl text-gray-500"
    //                            }`}
    //                 onClick={() => handleDayChange(day as DateRangeKey)}
    //             >
    //                 {new Date(day).toLocaleDateString(undefined, {
    //                     weekday: "long",
    //                 })}
    //             </button>
    //         ))}
    //     </div>
    // );

    return (
        <div className="bg-white rounded-lg drop-shadow-lg p-6 mb-6 text-gray-900">
            <h1 className="text-sm pb-9">
                HawkHacks Hackathon starts at XX:XXPM! All times are in EST.
            </h1>
            {/* <DayButtons /> */}
            <div>
                <Epg {...getEpgProps()}>
                    <Layout
                        {...getLayoutProps()}
                        renderProgram={({ program, ...rest }) => (
                            <CustomItem
                                key={program.data.id}
                                program={program}
                                {...rest}
                            />
                        )}
                    />
                </Epg>
            </div>
        </div>
    );
};
