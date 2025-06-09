import { Card, LoadingAnimation, PageWrapper } from "@/components";
import { useTicketData } from "@/hooks/use-ticket-data";
import { type UserWithClaims, useAuth } from "@/providers";
import { getResume } from "@/services/firebase/files";
import { Alert, Button } from "@chakra-ui/react";
import { Navigate, useParams } from "react-router-dom";

interface ViewTicketProps {
	ticketId: string;
	currentUser: UserWithClaims;
}

function ViewTicket(props: ViewTicketProps) {
	const ticketDataQuery = useTicketData(props.ticketId);

	if (ticketDataQuery.isLoading) {
		return <LoadingAnimation />;
	}

	if (ticketDataQuery.error) {
		return (
			<Alert.Root status="error">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Error loading ticket data</Alert.Title>
					<Alert.Description>{ticketDataQuery.error.message}</Alert.Description>
				</Alert.Content>
			</Alert.Root>
		);
	}

	if (!ticketDataQuery.data) {
		throw new Error("Ticket data not found");
	}

	const ticketData = ticketDataQuery.data;

	const showResume =
		!ticketData.resumeVisibility ||
		ticketData.resumeVisibility === "Public" ||
		(ticketData.resumeVisibility === "Sponsors Only" &&
			props.currentUser.type === "sponsor");

	return (
		<div>
			<div className="flex items-center gap-10">
				<h1 className="font-bold text-2xl">
					{`${ticketData.firstName} ${ticketData.lastName}`}
				</h1>
				<p>{ticketData.pronouns}</p>
			</div>
			<div className="flex flex-col max-w-md gap-5 mt-12">
				{ticketData.instagram && (
					<Card title="Instagram">{ticketData.instagram}</Card>
				)}
				{ticketData.github && <Card title="Github">{ticketData.github}</Card>}
				{ticketData.linkedin && (
					<Card title="LinkedIn">{ticketData.linkedin}</Card>
				)}
				{ticketData.discord && (
					<Card title="Discord">{ticketData.discord}</Card>
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
		</div>
	);
}

export const ViewTicketPage = () => {
	const { ticketId } = useParams();
	const { currentUser } = useAuth();

	if (!ticketId) return <Navigate to="/not-found" />;

	if (!currentUser) return <LoadingAnimation />;

	// give the app a chance to decide what to display
	return (
		<PageWrapper title="View Ticket" subTitle="Some good thing here">
			{ticketId ? (
				<ViewTicket ticketId={ticketId} currentUser={currentUser} />
			) : (
				<Alert.Root status="error">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>Ticket id required</Alert.Title>
						<Alert.Description>
							Ticket ID is required to view a ticket.
						</Alert.Description>
					</Alert.Content>
				</Alert.Root>
			)}
		</PageWrapper>
	);
};
