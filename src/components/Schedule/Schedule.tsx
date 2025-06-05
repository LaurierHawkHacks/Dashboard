import {
	Box,
	Grid,
	GridItem,
	Tabs,
	useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

const SCHEDULE_SIZE = "2880px";
const DESKTOP_GRID_ITEM_HEIGHT = "100px";
const DESKTOP_TIME_INDICATOR_HEIGHT = "32px";

interface ScheduleRootProps {
	defaultValue?: string;
	children: React.ReactNode;
}

export function ScheduleRoot(props: ScheduleRootProps) {
	return (
		<Tabs.Root
			display="flex"
			flexDirection="column"
			flex="1"
			minH="0"
			lazyMount
			{...props}
		/>
	);
}

export function ScheduleTabList(props: React.PropsWithChildren) {
	return <Tabs.List display="flex" bg="white" {...props} />;
}

interface ScheduleTabTriggerProps {
	value: string;
	children: React.ReactNode;
}

export function ScheduleTabTrigger(props: ScheduleTabTriggerProps) {
	return (
		<Tabs.Trigger flex="1" display="flex" justifyContent="center" {...props} />
	);
}

interface ScheduleContentProps {
	value: string;
	children: React.ReactNode;
}

export function ScheduleTabContent(props: ScheduleContentProps) {
	return (
		<Tabs.Content
			display="flex"
			flexDirection="column"
			flex="1"
			minH="0"
			paddingTop={{ base: "0", md: "4" }}
			{...props}
		/>
	);
}

interface ScheduleGridProps {
	children: React.ReactNode;
	dayDate: Date;
}

// The schedule grid is 24 hours long, from 12:00 AM to 12:00 AM the next day
// Each hour is divided into 60 minutes, so there are 24*60=1440 columns in total
export function ScheduleGrid(props: ScheduleGridProps) {
	return (
		<Box
			w="100%"
			overflowX="auto"
			overflowY={{ base: "auto", md: "hidden" }}
			minH="0"
			flex={{ base: "1", md: "none" }}
		>
			<Grid
				width={{ base: "auto", md: SCHEDULE_SIZE }}
				height={{ base: SCHEDULE_SIZE, md: "auto" }}
				templateColumns={{ base: "70px", md: "repeat(1440, 1fr)" }}
				templateRows={{
					base: "repeat(1440, 1fr)",
					md: DESKTOP_TIME_INDICATOR_HEIGHT,
				}}
				gridAutoFlow={{ base: "column", md: "row" }}
				gridAutoRows={{ base: "unset", md: DESKTOP_GRID_ITEM_HEIGHT }}
				gridAutoColumns={{ base: "minmax(100px, 300px)", md: "unset" }}
				position="relative"
			>
				<ScheduleTimeIndicator>12:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>1:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>2:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>3:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>4:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>5:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>6:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>7:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>8:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>9:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>10:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>11:00 AM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>12:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>1:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>2:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>3:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>4:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>5:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>6:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>7:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>8:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>9:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>10:00 PM</ScheduleTimeIndicator>
				<ScheduleTimeIndicator>11:00 PM</ScheduleTimeIndicator>

				<ScheduleCurrentTimeLine dayDate={props.dayDate} />

				{/* Mobile - Horizontal grid lines for time */}
				{Array.from({ length: 24 }, (_, i) => (
					<ScheduleGridTimeLine
						key={i}
						visibility={{ base: "visible", md: "hidden" }}
						gridRow={i * 60 + 1}
					/>
				))}

				{/* Desktop - Horizontal grid lines for streams (rows) */}
				<ScheduleGridStreamContainer
					visibility={{ base: "hidden", md: "visible" }}
				>
					{Array.from({ length: 24 }, (_, i) => (
						<ScheduleGridStreamLine key={i} />
					))}
				</ScheduleGridStreamContainer>
				{props.children}
			</Grid>
		</Box>
	);
}

function ScheduleTimeIndicator({ children }: { children: React.ReactNode }) {
	return (
		<GridItem
			colSpan={{ base: "auto", md: 60 }}
			rowSpan={{ base: 60, md: "auto" }}
			fontSize={{ base: "sm", md: "unset" }}
			letterSpacing="tight"
			ml={{ base: "4px", md: "0" }}
		>
			{children}
		</GridItem>
	);
}

function ScheduleCurrentTimeLine({ dayDate }: { dayDate: Date }) {
	const [shouldShow, setShouldShow] = useState(false);
	const [progressPercentage, setProgressPercentage] = useState(0);

	const TICK_INTERVAL = 10000; // 10 seconds

	useEffect(() => {
		const dayStart = new Date(dayDate);
		dayStart.setHours(0, 0, 0, 0);
		const dayEnd = new Date(dayDate);
		dayEnd.setHours(24, 0, 0, 0);

		function tick() {
			const now = new Date();
			const nextShouldShow = now >= dayStart && now < dayEnd;
			setShouldShow(nextShouldShow);

			if (!nextShouldShow) return;

			const totalDuration = dayEnd.getTime() - dayStart.getTime();
			const currentDuration = now.getTime() - dayStart.getTime();
			setProgressPercentage((currentDuration / totalDuration) * 100);
		}

		tick();
		const interval = setInterval(tick, TICK_INTERVAL);
		return () => clearInterval(interval);
	}, [dayDate]);

	if (!shouldShow) return null;

	return (
		<Box
			position="absolute"
			// Swaps between horizontal and vertical lines based on the breakpoint
			top={{ base: `${progressPercentage}%`, md: "0" }}
			left={{ base: "0", md: `${progressPercentage}%` }}
			height={{ base: "auto", md: "100%" }}
			width={{ base: "100%", md: "auto" }}
			border="1px"
			borderColor="red.500"
			borderStyle="solid"
			opacity={0.8}
			zIndex={1}
		/>
	);
}

function ScheduleGridTimeLine(props: React.ComponentProps<typeof GridItem>) {
	return (
		<GridItem
			position="absolute"
			left="0"
			right="0"
			height="1px"
			bg="gray.subtle"
			zIndex={-1}
			{...props}
		/>
	);
}

export function ScheduleGridStreamContainer(
	props: React.ComponentProps<typeof Box>,
) {
	return (
		<Box
			position="absolute"
			top={DESKTOP_TIME_INDICATOR_HEIGHT}
			left="0"
			right="0"
			display="flex"
			flexDir="column"
			zIndex={-1}
			{...props}
		/>
	);
}

export function ScheduleGridStreamLine() {
	return (
		<Box
			borderTopWidth="1px"
			height={DESKTOP_GRID_ITEM_HEIGHT}
			borderColor="gray.subtle"
		/>
	);
}

export interface ScheduleGridItemProps {
	scrollIntoViewOnMount?: boolean;
	startTime: TimeType;
	endTime: TimeType;
	color: string;
	onClick: () => void;
	children: React.ReactNode;
}

export function ScheduleGridItem({
	scrollIntoViewOnMount = false,
	startTime,
	endTime,
	color = "teal",
	onClick,
	children,
}: ScheduleGridItemProps) {
	const itemRef = useRef<HTMLDivElement>(null);

	const breakpoint = useBreakpointValue(
		{ base: "base", md: "md" },
		{ ssr: false },
	);

	useEffect(() => {
		if (scrollIntoViewOnMount && itemRef.current) {
			itemRef.current.scrollIntoView({
				behavior: "instant",
				inline: breakpoint === "base" ? undefined : "start",
				block: breakpoint === "base" ? "start" : undefined,
			});
		}
	}, [scrollIntoViewOnMount, breakpoint]);

	return (
		<GridItem
			as="button"
			textAlign="left"
			onClick={onClick}
			ref={itemRef}
			colStart={{ md: scheduleColumnHelper(startTime) }}
			colEnd={{ md: scheduleColumnHelper(endTime) }}
			rowStart={{ base: scheduleColumnHelper(startTime), md: "auto" }}
			rowEnd={{ base: scheduleColumnHelper(endTime), md: "auto" }}
			mb="4px"
			mr="4px"
			color={`${color}.contrast`}
			bg={`${color}.fg`}
			borderRadius="md"
			p={2}
			fontSize="sm"
			display="flex"
			flexDir="column"
			scrollMargin={8}
			textWrap="nowrap"
			overflow="hidden"
			textOverflow="ellipsis"
		>
			{children}
		</GridItem>
	);
}

type TimeType = `${number}:${number}`;

function scheduleColumnHelper(time: TimeType): number {
	const [hour, minute] = time.split(":").map(Number);
	const col = hour * 60 + minute;
	return col + 1; // CSS Grid is 1-indexed
}

export function format12HourTime(time: TimeType): string {
	const [hour, minute] = time.split(":").map(Number);
	const period = hour >= 12 ? "PM" : "AM";
	const formattedHour = hour % 12 || 12; // Convert to 12-hour format
	const formattedMinute = minute.toString().padStart(2, "0");
	return `${formattedHour}:${formattedMinute} ${period}`;
}
