import { Button, LoadingAnimation, TextInput } from "@/components";
import { InfoCallout } from "@/components/InfoCallout/InfoCallout";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuth } from "@/providers/auth.provider";
import { useNotification } from "@/providers/notification.provider";
import {
    createTeam,
    deleteTeam,
    getTeamByUser,
    inviteMember,
    isTeamNameAvailable,
    updateTeamName,
} from "@/services/utils/teams";
import type { TeamData } from "@/services/utils/types";
import {
    type FormEventHandler,
    Fragment,
    useEffect,
    useRef,
    useState,
} from "react";
import { z } from "zod";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { flushSync } from "react-dom";
import {
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";
import { Modal } from "@/components/Modal";

type SearchTeamNameFn = (name: string) => Promise<void>;

export const MyTeamPage = () => {
    const [team, setTeam] = useState<TeamData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [teamName, setTeamName] = useState("");
    const [isTeamNameTaken, setIsTeamNameTaken] = useState(false);
    const [invalidTeamName, setInvalidTeamName] = useState(false);
    const [openInviteDialog, setOpenInviteDialog] = useState(false);
    const [invalidEmailMsg, setInvalidEmailMsg] = useState("");
    const [email, setEmail] = useState("");
    const [disableAllActions, setDisableAllActions] = useState(false);
    const [isEditingTeamName, setIsEditingTeamName] = useState(false);
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
                    message: `Please try again later. (${
                        (e as Error).message
                    })`,
                });
            }
        } else {
            setInvalidTeamName(true);
        }
    };

    const closeInviteDialog = () => {
        // do not close dialog if disableAllActions invitations
        if (disableAllActions) return;
        setOpenInviteDialog(false);
        setEmail("");
    };

    const sendInvitation = async () => {
        setDisableAllActions(true);
        try {
            const res = await inviteMember(email);
            if (res.status === 201) {
                showNotification({
                    title: "Invitations Sent!",
                    message: "",
                });
                setEmail("");
            }
        } catch (e) {
            showNotification({
                title: "Error Sending Invitations",
                message: `Please try again later. (${(e as Error).message})`,
            });
        } finally {
            setDisableAllActions(false);
        }
    };

    const handleDeleteTeam = async () => {
        setDisableAllActions(true);
        try {
            const res = await deleteTeam();
            if (res.status === 200) {
                showNotification({
                    title: "Team Deleted!",
                    message: "Feel free to create a new team!",
                });
                flushSync(() => {
                    // reset all states
                    setTeam(null);
                    setTeamName("");
                    setEmail("");
                });
            } else {
                showNotification({
                    title: "Oh no... Something went wrong",
                    message: res.message,
                });
            }
        } catch (e) {
            showNotification({
                title: "Error Deleting Team",
                message: `Please try again later. (${(e as Error).message})`,
            });
        } finally {
            setDisableAllActions(false);
        }
    };

    const handleTeamNameUpdate = async () => {
        const res = await z.string().min(1).safeParseAsync(teamName);
        if (res.success) {
            setDisableAllActions(true);
            try {
                const res = await updateTeamName(teamName);
                if (res.status === 200) {
                    showNotification({
                        title: "Team Name Updated!",
                        message:
                            "You have until May 16th to change the team name again.",
                    });
                    // want to set the new team name in the team object
                    setTeam((t) => (t ? { ...t, teamName } : null));
                    setTeamName("");
                    setIsEditingTeamName(false);
                    setInvalidTeamName(false);
                    setIsTeamNameTaken(false);
                } else {
                    showNotification({
                        title: "Oh no... Something went wrong.",
                        message: res.message,
                    });
                }
            } catch (e) {
                showNotification({
                    title: "Error Updating Team Name",
                    message: `Please try again later. (${
                        (e as Error).message
                    })`,
                });
            } finally {
                setDisableAllActions(false);
            }
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
                const res = await getTeamByUser();
                console.log(res);
                setTeam(res.data);
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
            <div className="space-y-4">
                <div className="text-lg space-y-2">
                    <InfoCallout text="It looks like you are not in any team yet. You can create a team now. If you wish to join an existing team, the owner of the team can send you an invitation." />
                </div>
                <div className="mx-auto max-w-lg p-4 shadow-basic rounded">
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
                        <Button type="submit">Create Team</Button>
                    </form>
                </div>
            </div>
        );

    return (
        <>
            <div>
                <div className="flex gap-4">
                    <div className="flex-1 w-full lg:flex-auto lg:max-w-sm p-4 rounded shadow-basic">
                        <div className="relative">
                            <h3 className="font-bold">
                                {team.isOwner
                                    ? "Add Teammates"
                                    : "My Teammates"}
                            </h3>
                            {team.isOwner && (
                                <button
                                    aria-label="add teammates"
                                    className="absolute group right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setOpenInviteDialog(true)}
                                >
                                    <PlusCircleIcon className="w-8 h-8 text-charcoalBlack/70 transition group-hover:text-charcoalBlack" />
                                </button>
                            )}
                        </div>
                        {/* separator */}
                        <div className="h-[1px] bg-gray-200 my-4"></div>
                        <ul>
                            {team &&
                                team.members.length > 0 &&
                                team.members.map((m) => (
                                    <li
                                        key={m.email}
                                        className="p-4 shadow-basic rounded relative"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                <span>{m.firstName}</span>{" "}
                                                <span>{m.lastName}</span>
                                            </p>
                                            <p className="text-gray-500">
                                                {m.email}
                                            </p>
                                        </div>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            {m.status === "accepted" && (
                                                <CheckCircleIcon className="w-8 h-8 text-tbrand" />
                                            )}
                                            {m.status === "pending" && (
                                                <ClockIcon className="w-8 h-8 text-yellow-500" />
                                            )}
                                            {m.status === "rejected" && (
                                                <XCircleIcon className="w-8 h-8 text-red-500" />
                                            )}
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
            <Modal
                open={openInviteDialog}
                onClose={closeInviteDialog}
                title="Invite a teammate"
                subTitle="Send a team invitation via email!"
            >
                <TextInput
                    required
                    label="Email"
                    description={invalidEmailMsg}
                    id="invite-email"
                    type="email"
                    srLabel
                    placeholder="name@email.com"
                    invalid={!!invalidEmailMsg}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            const res = z
                                .string()
                                .email()
                                .safeParse(
                                    (e.target as HTMLInputElement).value
                                );
                            if (res.success) {
                                sendInvitation();
                            } else {
                                setInvalidEmailMsg(
                                    "The email entered is not a valid email."
                                );
                            }
                        } else {
                            if (invalidEmailMsg) setInvalidEmailMsg("");
                        }
                    }}
                />
                <div className="h-12"></div>
                <div className="flex items-center justify-center">
                    <Button
                        disabled={disableAllActions}
                        type="button"
                        onClick={() => {
                            const res = z.string().email().safeParse(email);
                            if (res.success) {
                                sendInvitation();
                            } else {
                                setInvalidEmailMsg(
                                    "The email entered is not a valid email."
                                );
                            }
                        }}
                    >
                        Send Invitation
                    </Button>
                </div>
            </Modal>
        </>
    );
};
