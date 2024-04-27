import { LoadingAnimation } from "@/components";
import { validateTeamInvitation } from "@/services/utils/teams";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const JoinTeamPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { invitationId } = useParams();

    // use the intivationId to validate the join team request
    useEffect(() => {
        if (!invitationId) return;
        (async () => {
            // validate by calling the cloud function 'validateTeamInvitation'
            try {
                const data = await validateTeamInvitation(invitationId);

                if (data.status !== 200) {
                    setError(new Error(data.message));
                }
            } catch (e) {
                setError(e as Error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [invitationId]);

    if (isLoading) {
        return <LoadingAnimation text="Joining team..." />;
    }

    if (error) {
        return (
            <div>
                <h1>Oh no... something went wrong</h1>
                <p>Please try again later or get a new team invitation.</p>
                <p>{error.message}</p>
            </div>
        );
    }

    return <p>joined!</p>;
};
