import { Modal, PageWrapper } from "@/components";
import {
	ScheduleGrid,
	ScheduleGridItem,
	ScheduleRoot,
	ScheduleTabContent,
	ScheduleTabList,
	ScheduleTabTrigger,
	format12HourTime,
} from "@/components/Schedule/Schedule";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";

const schedule = [
	{
		startDate: new Date("2025-05-16T09:30:00"),
		endTime: new Date("2025-05-16T11:30:00"),
		color: "teal",
		title: "Registration",
		description: "Registration for the event.",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T09:30:00"),
		endTime: new Date("2025-07-25T11:30:00"),
		color: "teal",
		title: "Registration",
		description: "Registration for the event.",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T11:30:00"),
		endTime: new Date("2025-07-25T12:00:00"),
		color: "green",
		title: "Robotics Workshop",
		description:
			"Learn about robotics and its applications with hands-on experience.",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T19:00:00"),
		endTime: new Date("2025-07-25T20:30:00"),
		color: "purple",
		title: "Musical Chairs",
		description: "Join us for a fun game of musical chairs!",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T11:00:00"),
		endTime: new Date("2025-07-25T12:30:00"),
		color: "purple",
		title: "Zumba",
		description: "Jam out with us in this fun Zumba class!",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T14:00:00"),
		endTime: new Date("2025-07-25T15:00:00"),
		color: "red",
		title: "Sponsor",
		description:
			"Meet our sponsors and learn about their products and services.",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T11:00:00"),
		endTime: new Date("2025-07-25T14:00:00"),
		color: "red",
		title: "Networking",
		description: "Network with other attendees and make new connections.",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-25T14:00:00"),
		endTime: new Date("2025-07-25T15:30:00"),
		color: "purple",
		title: "Pictureka",
		description: "Join us for a fun game of Pictureka!",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-26T09:30:00"),
		endTime: new Date("2025-07-26T11:30:00"),
		color: "teal",
		title: "Registration",
		description: "Registration for the event.",
		location: "Location",
	},
	{
		startDate: new Date("2025-07-27T09:30:00"),
		endTime: new Date("2025-07-27T11:30:00"),
		color: "teal",
		title: "Registration",
		description: "Registration for the event.",
		location: "Location",
	},
];

interface ScheduleEntry {
	title: string;
	description: string;
	location: string;
	startTime: `${number}:${number}`;
	endTime: `${number}:${number}`;
	color: string;
}

export const SchedulePage: React.FC = () => {
	const [selectedEntry, setSelectedEntry] = useState<
		ScheduleEntry | undefined
	>();

	const groupedSchedule = schedule.reduce((acc, event) => {
		const entry = {
			title: event.title,
			description: event.description,
			location: event.location,
			startTime:
				`${event.startDate.getHours()}:${event.startDate.getMinutes()}` as const,
			endTime:
				`${event.endTime.getHours()}:${event.endTime.getMinutes()}` as const,
			color: event.color,
		};

		// 'YYYY-MM-DD'
		const dayKey = event.startDate.toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});

		const dayMapEntry = acc.get(dayKey) ?? {
			dayDate: event.startDate,
			entries: [] as ScheduleEntry[],
		};

		acc.set(dayKey, dayMapEntry);
		dayMapEntry.entries.push(entry);
		return acc;
	}, new Map<string, { dayDate: Date; entries: ScheduleEntry[] }>());

	const scheduleEntries = Array.from(groupedSchedule.entries());

	const breakpoint = useBreakpointValue(
		{ base: "base", md: "md" },
		{ ssr: false },
	);

	return (
		<PageWrapper
			title="Schedule"
			subTitle="View the schedule for the weekend!"
			variant={breakpoint === "base" ? "tight" : "default"}
		>
			<ScheduleRoot defaultValue={scheduleEntries[0][0]}>
				<Box
					position={{ base: "sticky", md: "unset" }}
					shadow={{ base: "sm", md: "unset" }}
					top={0}
					zIndex={1}
				>
					<ScheduleTabList>
						{scheduleEntries.map(([dayKey, { dayDate }]) => (
							<ScheduleTabTrigger key={dayKey} value={dayKey}>
								{breakpoint === "base"
									? // 'Saturday'
										dayDate.toLocaleDateString("en-US", {
											weekday: "long",
										})
									: // 'Saturday, July 25'
										dayDate.toLocaleDateString("en-US", {
											weekday: "long",
											month: "long",
											day: "numeric",
										})}
							</ScheduleTabTrigger>
						))}
					</ScheduleTabList>
				</Box>

				{scheduleEntries.map(([dayKey, { dayDate, entries }]) => (
					<ScheduleTabContent key={dayKey} value={dayKey}>
						<ScheduleGrid dayDate={dayDate}>
							{entries.map((entry, idx) => (
								<ScheduleGridItem
									key={entry.title}
									scrollIntoViewOnMount={idx === 0}
									startTime={entry.startTime}
									endTime={entry.endTime}
									color={entry.color}
									onClick={() => setSelectedEntry(entry)}
								>
									<strong>{entry.title}</strong>
									<span>{entry.location}</span>
									<Box textWrap="wrap">
										{format12HourTime(entry.startTime)} -{" "}
										{format12HourTime(entry.endTime)}
									</Box>
								</ScheduleGridItem>
							))}
						</ScheduleGrid>
					</ScheduleTabContent>
				))}
			</ScheduleRoot>

			{selectedEntry && (
				<Modal
					title={selectedEntry.title}
					subTitle=""
					open
					onClose={() => setSelectedEntry(undefined)}
				>
					<Box display="flex" flexDir="column" gap={2}>
						<Box display="flex" flexDir="column">
							<strong>Location</strong>
							<span>{selectedEntry.location}</span>
						</Box>
						<Box display="flex" flexDir="column">
							<strong>Time</strong>
							<span>
								{format12HourTime(selectedEntry.startTime)} -{" "}
								{format12HourTime(selectedEntry.endTime)}
							</span>
						</Box>
						<Box display="flex" flexDir="column">
							<strong>Event Details</strong>
							<span>{selectedEntry.description}</span>
						</Box>
					</Box>
				</Modal>
			)}
		</PageWrapper>
	);
};
