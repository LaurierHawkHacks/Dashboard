/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useEpg, Epg, Layout, ProgramItem, Theme } from "@nessprim/planby-pro";
import { formatISO } from "date-fns";
import { EventItem } from "@/services/utils/types";
import { getRedeemableItems } from "@/services/utils";

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
    }
};

function calculateInitialScrollPositions(startTime) {
    const startDate = new Date(startTime);
    const hourWidth = 2900 / 24;
    const scrollLeft = (startDate.getHours() + startDate.getMinutes() / 60) * hourWidth;
    return { top: 0, left: scrollLeft };
}

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
        dayWidth: 2900,
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
        timelineHeight: 60,
        itemHeight: 70,
        isInitialScrollToNow: false,
        initialScrollPositions: epg.length > 0 ? calculateInitialScrollPositions(epg[0].since) : undefined,
        isSidebar: false,
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-800">
            <h1 className="text-lg font-semibold mb-4">
                HawkHacks Hackathon starts at XX:XXPM! All times are in EST.
            </h1>
            <div>
                <Epg {...getEpgProps()}>
                    <Layout
                        {...getLayoutProps()}
                        renderProgram={({ program, ...rest }) => (
                            <CustomItem
                                key={program.data.id}
                                program={program}
                                onClick={() => {}}
                                {...rest}
                            />
                        )}
                    />
                </Epg>
            </div>
        </div>
    );
};
