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
    removeMembers,
    updateTeamName,
} from "@/services/utils/teams";
import { type TeamData } from "@/services/utils/types";
import { type FormEventHandler, useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
    PencilIcon,
    PlusCircleIcon,
    XCircleIcon as XCircleOutlineIcon,
} from "@heroicons/react/24/outline";
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
    const [openTeammatesDialog, setOpenTeammatesDialog] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState("");
    // holds ths emails of the members to be removed
    const [toBeRemovedTeammates, setToBeRemovedTeammates] = useState<string[]>(
        []
    );
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
                    setTeamName("");
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

    const closeTeammatesDialog = () => {
        if (disableAllActions) return;
        setOpenTeammatesDialog(false);
        setToBeRemovedTeammates([]);
    };

    const sendInvitation = async () => {
        // do not allow to send another invitation to someone who is already in the team
        if (team && team.members.some((m) => m.email === email)) return;
        setDisableAllActions(true);
        try {
            const { status, data } = await inviteMember(email);
            if (status === 201 && data && team) {
                const newTeam = { ...team };
                newTeam.members.push(data);
                setTeam(newTeam);
                setEmail("");
                showNotification({
                    title: "Invitation Sent!",
                    message: "",
                });
            } else if (status === 404) {
                showNotification({
                    title: "Error Sending Invitation",
                    message:
                        "This email doesn't match our records of accepted hackers. Make sure you've typed their email correctly, and that they've already RSVP'd.",
                });
            } else {
                showNotification({
                    title: "Error Sending Invitation",
                    message: "Please try again later.",
                });
            }
        } catch (e) {
            showNotification({
                title: "Error Sending Invitation",
                message: `Please try again later. (${(e as Error).message})`,
            });
        } finally {
            setDisableAllActions(false);
        }
    };

    const handleDeleteTeam = async () => {
        try {
            setDisableAllActions(true);
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
                    setConfirmDelete("");
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
        } else {
            setInvalidTeamName(true);
        }
    };

    const handleRemoveTeammates = async () => {
        if (toBeRemovedTeammates.length < 1) {
            // just close the dialog
            closeTeammatesDialog();
            return;
        }

        try {
            setDisableAllActions(true);
            const res = await removeMembers(toBeRemovedTeammates);
            if (res.status === 200) {
                showNotification({
                    title: "Successfully removed teammate(s)",
                    message: "",
                });
                // set new team members list
                if (team) {
                    const newTeam = { ...team };
                    newTeam.members = team!.members.filter(
                        (m) => !toBeRemovedTeammates.includes(m.email)
                    );
                    setTeam(newTeam);
                }
                closeTeammatesDialog();
            } else {
                showNotification({
                    title: "Oh no... Something went wrong",
                    message: res.message,
                });
            }
        } catch (e) {
            showNotification({
                title: "Error Removing Teammates",
                message: (e as Error).message,
            });
        } finally {
            setDisableAllActions(false);
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
                setTeam(res.data);
                if (loadingTimeoutRef.current !== null)
                    window.clearTimeout(loadingTimeoutRef.current);
                setIsLoading(false);
            } catch {
                showNotification({
                    title: "Could not get team",
                    message:
                        "Yikes, something went wrong. Try again later; if the error continues, shoot us a message on our Discord tech-support channel.",
                });
            }
        })();
    }, []);

    if (isLoading) return <LoadingAnimation />;

    if (!team)
        return (
            <div className="space-y-4">
                <div className="w-fit text-lg space-y-2">
                    <InfoCallout text="It looks like you are not enrolled in a team. Create one below, or enroll in an existing team by receiving an invitation from the team owner." />
                </div>
                <div className="max-w-lg p-4 shadow-basic rounded-lg">
                    <form className="mt-6 space-y-4" onSubmit={submitNewTeam}>
                        <TextInput
                            label="Team Name"
                            id="team-name-input"
                            description={
                                invalidTeamName
                                    ? "The entered team name is not valid."
                                    : !isTeamNameTaken
                                    ? "Enter an awesome team name."
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
                <div className="flex gap-4 flex-col sm:flex-row md:flex-col lg:flex-row lg:min-h-[20rem] [&>div]:p-5 [&>div]:rounded-lg [&>div]:shadow-basic lg:[&>div]:flex-auto">
                    <div className="w-full lg:max-w-sm h-fit">
                        <div className="relative">
                            <h3 className="font-bold">
                                {team.isOwner
                                    ? "Add Teammates"
                                    : "My Teammates"}
                            </h3>
                            {/* members length has to be less than 3 because the logged in user is not in the list */}
                            {team.isOwner && team.members.length < 3 && (
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
                        <hr className="h-[1px] bg-gray-200 my-4" />
                        <ul className="space-y-4">
                            {team &&
                                team.members.length > 0 &&
                                team.members.map((m) => (
                                    <li
                                        key={m.email}
                                        className="p-4 shadow-basic rounded-lg relative"
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
                        {team && team.isOwner && (
                            <div className="mt-8 flex items-center justify-end">
                                <Button
                                    onClick={() => setOpenTeammatesDialog(true)}
                                >
                                    Edit Team
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="w-full h-fit lg:max-w-[30rem]">
                        <div className="relative">
                            <h3 className="font-bold">Team Name</h3>
                            {team.isOwner && (
                                <button
                                    aria-label="edit team name"
                                    className="absolute group right-2 top-1/2 -translate-y-1/2"
                                    onClick={() =>
                                        setIsEditingTeamName(!isEditingTeamName)
                                    }
                                >
                                    {!isEditingTeamName && (
                                        <PencilIcon className="w-7 h-7 text-charcoalBlack/70 transition group-hover:text-charcoalBlack" />
                                    )}
                                    {isEditingTeamName && (
                                        <XCircleOutlineIcon className="w-8 h-8 text-charcoalBlack/70 transition group-hover:text-charcoalBlack" />
                                    )}
                                </button>
                            )}
                        </div>
                        {/* separator */}
                        <div className="h-[1px] bg-gray-200 my-4"></div>
                        <div className="relative">
                            {!isEditingTeamName && team && (
                                <p>{team.teamName}</p>
                            )}
                            {isEditingTeamName && team && team.isOwner && (
                                <>
                                    <TextInput
                                        label="Edit Team Name"
                                        srLabel
                                        id="edit-team-name-input"
                                        value={teamName}
                                        onChange={(e) => {
                                            setInvalidTeamName(false);
                                            setIsTeamNameTaken(false);
                                            setTeamName(e.target.value);
                                            debounce(e.target.value);
                                        }}
                                        placeholder="Awesome Team Name Here!"
                                        description={
                                            invalidTeamName
                                                ? "The entered team name is not valid."
                                                : !isTeamNameTaken
                                                ? ""
                                                : "The team name has been taken. Please choose another one."
                                        }
                                        invalid={
                                            invalidTeamName || isTeamNameTaken
                                        }
                                    />
                                    <div className="flex items-center justify-end">
                                        <Button
                                            onClick={handleTeamNameUpdate}
                                            className="mt-8"
                                        >
                                            Confirm
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {team && team.isOwner && (
                    <div className="shadow-basic p-4 max-w-xl rounded-lg mt-8">
                        <div className="space-y-4">
                            <h3 className="font-bold">Delete Team?</h3>
                            <p>Are you sure you want to delete your team?</p>
                            <p>Retype your team name to confirm deleteion.</p>
                        </div>
                        <TextInput
                            label="Confirm Delete Team"
                            id="confirm-delete-team-input"
                            placeholder="Team name"
                            srLabel
                            value={confirmDelete}
                            onChange={(e) => setConfirmDelete(e.target.value)}
                        />
                        <div className="mt-3 flex items-center justify-end">
                            <Button
                                disabled={confirmDelete !== team?.teamName}
                                intent="danger"
                                onClick={handleDeleteTeam}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                )}
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
                        disabled={
                            disableAllActions ||
                            team.members.some((m) => m.email === email)
                        }
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
            <Modal
                open={openTeammatesDialog}
                onClose={closeTeammatesDialog}
                title="Edit Team"
                subTitle="Manage your teammates!"
            >
                <ul className="space-y-4">
                    {team &&
                        team.members.length > 0 &&
                        team.members
                            .filter(
                                (m) => !toBeRemovedTeammates.includes(m.email)
                            )
                            .map((m) => (
                                <li
                                    key={m.email}
                                    className="p-4 shadow-basic rounded-lg relative"
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
                                    <button
                                        onClick={() =>
                                            setToBeRemovedTeammates([
                                                ...toBeRemovedTeammates,
                                                m.email,
                                            ])
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 group"
                                    >
                                        <XCircleOutlineIcon className="w-8 h-8 text-charcoalBlack/70 transition group-hover:text-charcoalBlack" />
                                    </button>
                                </li>
                            ))}
                </ul>
                <div className="mt-8 flex items-center justify-center">
                    <Button
                        disabled={
                            toBeRemovedTeammates.length < 1 || disableAllActions
                        }
                        className="px-14"
                        onClick={handleRemoveTeammates}
                    >
                        Done
                    </Button>
                </div>
            </Modal>
        </>
    );
};
