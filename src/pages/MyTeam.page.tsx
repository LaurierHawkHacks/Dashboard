import { Button, LoadingAnimation, TextInput } from "@/components";
import { InfoCallout } from "@/components/InfoCallout/InfoCallout";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuth } from "@/providers/auth.provider";
import { useNotification } from "@/providers/notification.provider";
import {
    createTeam,
    getTeamByUser,
    isTeamNameAvailable,
} from "@/services/utils/teams";
import type { TeamData } from "@/services/utils/types";
import { type FirebaseError } from "firebase/app";
import { type FormEventHandler, useEffect, useRef, useState } from "react";
import { z } from "zod";

type SearchTeamNameFn = (name: string) => Promise<void>;

export const MyTeamPage = () => {
    const [team, setTeam] = useState<TeamData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [teamName, setTeamName] = useState("");
    const [isTeamNameTaken, setIsTeamNameTaken] = useState(false);
    const [invalidTeamName, setInvalidTeamName] = useState(false);
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
            // try to create the new team
            try {
                const res = await createTeam(teamName);
                if (res.status === 201) {
                    showNotification({
                        title: "Team Created!",
                        message:
                            "Awesome, it looks like your team has been created successfully! Start inviting hackers into your team!",
                    });
                    setTeam(res.data);
                } else {
                    showNotification({
                        title: "It looks like something went wrong",
                        message: res.message,
                    });
                }
            } catch (e) {
                showNotification({
                    title: "Oh Uh! Error Creating Team",
                    message: (e as FirebaseError).message,
                });
            }
        } else {
            setInvalidTeamName(true);
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
            <div>
                <div className="mx-auto max-w-lg">
                    <div className="text-lg space-y-2">
                        <InfoCallout text="It looks like you are not in any team yet. You can create a team now. If you wish to join an existing team, the owner of the team can send you an invitation." />
                    </div>
                    <form className="mt-6 space-y-4" onSubmit={submitNewTeam}>
                        <TextInput
                            label="Team Name"
                            id="team-name-input"
                            description={
                                invalidTeamName
                                    ? "The entered team name is not valid."
                                    : !isTeamNameTaken
                                    ? "Enter awesome team name."
                                    : "The team name has been taken. Please choose another one."
                            }
                            invalid={invalidTeamName || isTeamNameTaken}
                            required
                            value={teamName}
                            onChange={(e) => {
                                setInvalidTeamName(false);
                                setTeamName(e.target.value);
                                debounce(e.target.value);
                            }}
                        />
                        <Button type="submit">Create Team!</Button>
                    </form>
                </div>
            </div>
        );

    return (
        <div>
            <div className="mx-auto max-w-lg">
                {/* team information */}
                <div className="text-lg">
                    <p className="font-bold">Team Name:</p>
                    <p>{team.teamName}</p>
                </div>
            </div>
        </div>
    );
};
