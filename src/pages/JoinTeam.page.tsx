import { Button } from "@/components";
import { useNotification } from "@/providers/notification.provider";
import { useAvailableRoutes } from "@/providers/routes.provider";
import {
    rejectInvitation,
    validateTeamInvitation,
} from "@/services/utils/teams";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export const JoinTeamPage = () => {
    const [disableButtons, setDisableButtons] = useState(false);
    const { invitationId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { paths: routes } = useAvailableRoutes();

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

    // return to home page
    if (!invitationId) return <Navigate to={routes.portal} />;

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="space-y-6">
                <h1 className="block text-lg font-bold text-center">
                    Invitation to join team!
                </h1>
                <div className="flex items-center justify-between gap-4">
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
    );
};
