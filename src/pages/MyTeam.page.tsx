import { Button, LoadingAnimation, TextInput } from "@/components";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuth } from "@/providers/auth.provider";
import { useNotification } from "@/providers/notification.provider";
import { getTeamByUser, isTeamNameAvailable } from "@/services/utils/teams";
import type { TeamData } from "@/services/utils/types";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { z } from "zod";

type SearchTeamNameFn = (name: string) => Promise<void>;

export const MyTeamPage = () => {
    const [team, setTeam] = useState<TeamData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [teamName, setTeamName] = useState("");
    const [isTeamNameTaken, setIsTeamNameTaken] = useState(false);
    const { currentUser } = useAuth();
    const { showNotification } = useNotification();
    const debounce = useDebounce<SearchTeamNameFn, string>(
        async (name: string) => {
            if (!name) return;
            // search if team name is available
            setIsTeamNameTaken(!(await isTeamNameAvailable(name)));
        },
        250
    );
    const loadingTimeoutRef = useRef<number | null>(null);

    const submitNewTeam: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const res = await z.string().min(1).safeParseAsync(teamName);
        if (res.success) {
            // verify if
        }
    };

    useEffect(() => {
        if (loadingTimeoutRef.current !== null)
            window.clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = window.setTimeout(
            () => setIsLoading(false),
            1500
        );
        if (!currentUser) return;
        (async () => {
            try {
                setTeam(await getTeamByUser());
                if (loadingTimeoutRef.current !== null)
                    window.clearTimeout(loadingTimeoutRef.current);
                setIsLoading(false);
            } catch {
                showNotification({
                    title: "Could not get team",
                    message:
                        "Oh no... please try later and if this error persist, contact us in our Discord support channel.",
                });
            }
        })();
    }, []);

    if (isLoading) return <LoadingAnimation />;

    if (!team)
        return (
            <div className="relative">
                <div className="text-lg space-y-2">
                    <p>It looks like you are not in any team yet.</p>
                    <p>Enter a team name to create one!</p>
                    <p>You will be able to invite your teammates after!</p>
                </div>
                <form
                    className="mt-6 space-y-4 max-w-md"
                    onSubmit={submitNewTeam}
                >
                    <TextInput
                        label="Team Name"
                        id="team-name-input"
                        description={
                            !isTeamNameTaken
                                ? "The team name can NOT be edited later."
                                : "The team name has been taken. Please choose another one."
                        }
                        invalid={isTeamNameTaken}
                        required
                        value={teamName}
                        onChange={(e) => {
                            setTeamName(e.target.value);
                            debounce(e.target.value);
                        }}
                    />
                    <Button type="submit">Create Team!</Button>
                </form>
            </div>
        );
    return <div>Create a team</div>;
};
