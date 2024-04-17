import { Button } from "@/components";
import { useAuth } from "@/providers/auth.provider";
import { useNotification } from "@/providers/notification.provider";
import { verifyRSVP } from "@/services/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const VerifyRSVP = () => {
    const [isVerifying, setIsVerifying] = useState(false);
    const { showNotification } = useNotification();
    const { currentUser, reloadUser } = useAuth();
    const navigate = useNavigate();

    const verify = async () => {
        setIsVerifying(true);
        const confirmed = await verifyRSVP();
        if (!confirmed) {
            setIsVerifying(false);
            showNotification({
                title: "Error Verifying RSVP",
                message:
                    "Please send an email to hello@hawkhacks.ca for us to confirm it for you.",
            });
        } else {
            await reloadUser();
        }
    };

    useEffect(() => {
        // we only want to navigate out of the current page if user rsvp was successfully
        // verified and has been populated in our database
        if (currentUser && currentUser.rsvpVerified) navigate("/");
    }, [currentUser]);

    return (
        <div className="pt-12 flex justify-center items-center flex-col gap-6">
            <p className="text-lg font-bold">
                Please verify your RSVP to get access to the rest of the
                dashboard!
            </p>
            <Button
                onClick={verify}
                disabled={isVerifying}
                className="font-bold"
            >
                Verify
            </Button>
        </div>
    );
};
