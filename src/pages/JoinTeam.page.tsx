import { LoadingAnimation, PageWrapper } from "@/components";
import { toaster } from "@/components/ui/toaster";
import { paths } from "@/data/paths";
import { useAuth } from "@/providers";
import {
	checkInvitation,
	rejectInvitation,
	validateTeamInvitation,
} from "@/services/firebase/teams";
import type { Invitation } from "@/services/firebase/types";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export const JoinTeamPage = () => {
	const [disableButtons, setDisableButtons] = useState(false);
	const { invitationId } = useParams();
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const [invitationData, setInvitationData] = useState<Invitation | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const accept = async () => {
		if (!invitationId) return;
		try {
			setDisableButtons(true);
			const res = await validateTeamInvitation(invitationId);
			if (res.status === 200) {
				toaster.success({
					title: "Joined Team",
					description: "Hope you have a blast with your new team!",
				});
				navigate(paths.myTeam);
			} else {
				toaster.error({
					title: "Error Joining Team",
					description: res.message,
				});
				setDisableButtons(false);
			}
		} catch (e) {
			toaster.error({
				title: "Error Joining Team",
				description: (e as Error).message,
			});
			setDisableButtons(false);
		}
	};

	const reject = async () => {
		if (!invitationId) return;
		try {
			setDisableButtons(true);
			const res = await rejectInvitation(invitationId);
			if (res.status === 200) {
				toaster.success({
					title: "Team Inviation Rejected",
					description: "",
				});
				navigate(paths.myTeam);
			} else {
				toaster.error({
					title: "Error Rejecting Invitation",
					description: res.message,
				});
				setDisableButtons(false);
			}
		} catch (e) {
			toaster.error({
				title: "Error Rejecting Invitation",
				description: (e as Error).message,
			});
			setDisableButtons(false);
		}
	};

	useEffect(() => {
		if (!invitationId || !currentUser) return;

		(async () => {
			// check if invitation exists or not
			try {
				const data = await checkInvitation(invitationId);
				if (data.status === 200) {
					setInvitationData(data.data);
				} else if (data.status !== 404) {
					toaster.error({
						title: "Error",
						description:
							"Please make sure you this link from an invitation or request a new one.",
					});
				}
			} catch {
				toaster.error({
					title: "Error",
					description:
						"Please make sure you this link from an invitation or request a new one.",
				});
			} finally {
				setIsLoading(false);
			}
		})();
	}, [invitationId, currentUser]);

	if (isLoading) return <LoadingAnimation />;

	// return to home page
	if (!invitationId) return <Navigate to={paths.home} />;

	if (!invitationData) return <Navigate to="/not-found" />;

	return (
		<PageWrapper
			title="Join Team"
			subTitle="Awesome, it looks like you have found teammates!"
		>
			<div className="h-screen w-screen flex items-center justify-center">
				<div className="space-y-6">
					<h1 className="block text-lg font-bold text-center">
						{`${invitationData.owner} invited you to join ${invitationData.teamName}`}
					</h1>
					<div>
						<div className="mx-auto flex items-center justify-center gap-12 max-w-lg">
							<Button disabled={disableButtons} onClick={accept}>
								Accept
							</Button>
							<Button disabled={disableButtons} onClick={reject}>
								Reject
							</Button>
						</div>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
};
