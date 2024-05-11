import { Button, LoadingAnimation } from "@/components";
import { useAuth } from "@/providers/auth.provider";
import { useNotification } from "@/providers/notification.provider";
import { useAvailableRoutes } from "@/providers/routes.provider";
import {
    checkInvitation,
    rejectInvitation,
    validateTeamInvitation,
} from "@/services/utils/teams";
import { Invitation } from "@/services/utils/types";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export const JoinTeamPage = () => {
    const [disableButtons, setDisableButtons] = useState(false);
    const { invitationId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { paths: routes } = useAvailableRoutes();
    const { currentUser } = useAuth();
    const [invitationData, setInvitationData] = useState<Invitation | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(true);

    const accept = async () => {
        if (!invitationId) return;
        try {
            setDisableButtons(true);
            const res = await validateTeamInvitation(invitationId);
            if (res.status === 200) {
                showNotification({
                    title: "Joined Team",
                    message: "Hope you have a blast with your new team!",
                });
                navigate(routes.myTeam);
            } else {
                showNotification({
                    title: "Error Joining Team",
                    message: res.message,
                });
                setDisableButtons(false);
            }
        } catch (e) {
            showNotification({
                title: "Error Joining Team",
                message: (e as Error).message,
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
                showNotification({
                    title: "Team Inviation Rejected",
                    message: "",
                });
                navigate(routes.myTeam);
            } else {
                showNotification({
                    title: "Error Rejecting Invitation",
                    message: res.message,
                });
                setDisableButtons(false);
            }
        } catch (e) {
            showNotification({
                title: "Error Rejecting Invitation",
                message: (e as Error).message,
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
                    showNotification({
                        title: "Error",
                        message:
                            "Please make sure you this link from an invitation or request a new one.",
                    });
                }
            } catch {
                showNotification({
                    title: "Error",
                    message:
                        "Please make sure you this link from an invitation or request a new one.",
                });
            } finally {
                setIsLoading(false);
            }
        })();
    }, [invitationId, currentUser]);

    if (isLoading) return <LoadingAnimation />;

    // return to home page
    if (!invitationId) return <Navigate to={routes.portal} />;

    if (!invitationData) return <Navigate to="/not-found" />;

    return (
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
                        <Button
                            disabled={disableButtons}
                            onClick={reject}
                            intent="secondary"
                        >
                            Reject
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
