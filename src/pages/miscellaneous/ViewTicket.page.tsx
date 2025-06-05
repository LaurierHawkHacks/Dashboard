import { LoadingAnimation, PageWrapper } from "@/components";
import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/providers";
import { getResume } from "@/services/firebase/files";
import { getTicketData } from "@/services/firebase/ticket";
import type { TicketData } from "@/services/firebase/types";
import { Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

type TicketDataKey = keyof TicketData;

const socialKeys: TicketDataKey[] = [
	"instagram",
	"github",
	"linkedin",
	"discord",
];

export const ViewTicketPage = () => {
	const [isLoading, setIsLoading] = useState(true);
	const { ticketId } = useParams();
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const timeoutRef = useRef<number | null>(null);
	const [ticketData, setTicketData] = useState<TicketData | null>(null);
	const [showResume, setShowResume] = useState(false);

	useEffect(() => {
		if (!ticketId) return;
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		timeoutRef.current = window.setTimeout(() => setIsLoading(false), 1500);

		(async () => {
			if (
				currentUser &&
				(currentUser.hawkAdmin ||
					(currentUser.type === "volunteer" && currentUser.rsvpVerified))
			) {
				if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
				navigate(`/admin/ticket/${ticketId}`);
			} else {
				if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
				// fetch user ticket data
				const res = await getTicketData(ticketId);
				if (res.status === 200) {
					setTicketData(res.data);
					setShowResume(
						!res.data.resumeVisibility ||
							res.data.resumeVisibility === "Public" ||
							(res.data.resumeVisibility === "Sponsors Only" &&
								currentUser !== null &&
								currentUser.type === "sponsor"),
					);
				} else {
					toaster.error({
						title: "Failed to load ticket",
						description: res.message,
					});
				}
				setIsLoading(false);
			}
		})();

		return () => {
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		};
	}, [currentUser, ticketId]);

	if (!ticketId) return <Navigate to="/not-found" />;

	if (isLoading) return <LoadingAnimation />;

	if (!ticketData) return <Navigate to="/not-found" />;

	// give the app a chance to decide what to display
	return (
		<PageWrapper title="View Ticket" subTitle="Some good thing here">
			<div className="flex items-center gap-10">
				<h1 className="font-bold text-2xl">
					{`${ticketData.firstName} ${ticketData.lastName}`}
				</h1>
				<p>{ticketData.pronouns}</p>
			</div>
			<div className="flex flex-col max-w-md gap-5 mt-12">
				{socialKeys.map((key) =>
					ticketData[key] ? (
						<div
							className="bg-white shadow-md p-4 rounded-xl flex flex-col"
							key={key}
						>
							<div className="mb-2 flex justify-between items-center">
								<p className="flex-1 capitalize">{key}</p>
							</div>
							<p>{ticketData[key]}</p>
						</div>
					) : null,
				)}
				{ticketData.resumeRef && showResume && (
					<div className="bg-white shadow-md p-4 rounded-xl flex flex-col">
						<div className="mb-2 flex justify-between items-center">
							<p className="flex-1 capitalize">Resume</p>
						</div>
						<div>
							<Button
								onClick={() => {
									getResume(ticketData.resumeRef);
								}}
							>
								Download
							</Button>
						</div>
					</div>
				)}
			</div>
		</PageWrapper>
	);
};
