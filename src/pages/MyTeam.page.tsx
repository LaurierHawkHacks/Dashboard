import { Button, LoadingAnimation, TextInput } from "@/components";
import { Dialog, Transition } from "@headlessui/react";
import { InfoCallout } from "@/components/InfoCallout/InfoCallout";
import { useDebounce } from "@/hooks/use-debounce";
import { useAuth } from "@/providers/auth.provider";
import { useNotification } from "@/providers/notification.provider";
import {
    createTeam,
    deleteTeam,
    getTeamByUser,
    inviteMembers,
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
import { CheckIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { flushSync } from "react-dom";

type SearchTeamNameFn = (name: string) => Promise<void>;

export const MyTeamPage = () => {
    const [team, setTeam] = useState<TeamData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [teamName, setTeamName] = useState("");
    const [isTeamNameTaken, setIsTeamNameTaken] = useState(false);
    const [invalidTeamName, setInvalidTeamName] = useState(false);
    const [openInviteDialog, setOpenInviteDialog] = useState(false);
    const [inviteEmails, setInviteEmails] = useState<string[]>([]);
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
        setInviteEmails([]);
    };

    const sendInvitations = async () => {
        setDisableAllActions(true);
        try {
            const res = await inviteMembers(inviteEmails);
            if (res.status === 200) {
                showNotification({
                    title: "Invitations Sent!",
                    message: "",
                });
                setOpenInviteDialog(false);
                setInviteEmails([]);
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
                    setInviteEmails([]);
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
                <div className="mx-auto max-w-lg">
                    {/* team information */}
                    <div className="text-lg flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold">Team Name:</p>
                                {!isEditingTeamName && (
                                    <>
                                        <p>{team.teamName}</p>
                                    </>
                                )}
                                {team.isOwner && isEditingTeamName && (
                                    <TextInput
                                        label="Team Name"
                                        srLabel
                                        id="team-name-input"
                                        description={
                                            invalidTeamName
                                                ? "The entered team name is not valid."
                                                : !isTeamNameTaken
                                                ? "You have until May 16th 23:59:59 to edit the team name."
                                                : "The team name has been taken. Please choose anther one."
                                        }
                                        value={teamName}
                                        invalid={
                                            invalidTeamName || isTeamNameTaken
                                        }
                                        onChange={(e) => {
                                            setTeamName(e.target.value);
                                            setInvalidTeamName(false);
                                            debounce(e.target.value);
                                        }}
                                        disabled={disableAllActions}
                                    />
                                )}
                            </div>
                            {team.isOwner && !isEditingTeamName && (
                                <button
                                    className="group"
                                    aria-label="Edit team name"
                                    disabled={disableAllActions}
                                    onClick={() => setIsEditingTeamName(true)}
                                >
                                    <PencilIcon className="w-6 h-6 text-gray-300 transition group-hover:text-blue-500" />
                                </button>
                            )}
                            {team.isOwner && isEditingTeamName && (
                                <div>
                                    <button
                                        className="group"
                                        aria-label="Cancel edit team name"
                                        disabled={disableAllActions}
                                        onClick={() => {
                                            setTeamName("");
                                            setIsEditingTeamName(false);
                                            setInvalidTeamName(false);
                                            setIsTeamNameTaken(false);
                                        }}
                                    >
                                        <XMarkIcon className="w-6 h-6 text-gray-300 transition group-hover:text-red-600" />
                                    </button>
                                    <button
                                        className="group ml-2"
                                        aria-label="Cancel edit team name"
                                        disabled={disableAllActions}
                                        onClick={handleTeamNameUpdate}
                                    >
                                        <CheckIcon className="w-6 h-6 text-green-500 transition group-hover:text-green-600" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="flex items-center justify-between">
                                <p className="font-bold">Team Members:</p>
                                <Button
                                    className="p-2"
                                    onClick={() => {
                                        setOpenInviteDialog(true);
                                    }}
                                >
                                    Invite
                                </Button>
                            </div>
                            <ul>
                                {team.members.map((member) => (
                                    <li
                                        key={
                                            member.email +
                                            member.firstName +
                                            member.lastName
                                        }
                                        onClick={() => {
                                            console.log(member);
                                        }}
                                    >
                                        <p>{member.firstName}</p>
                                        <p>{member.lastName}</p>
                                        <p>{member.email}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* render delete team btn */}
                    {team.isOwner && (
                        <Button intent="danger" onClick={handleDeleteTeam}>
                            Delete Team
                        </Button>
                    )}
                </div>
            </div>
            <Transition appear show={openInviteDialog} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={closeInviteDialog}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>Invite Hackers</span>
                                            <button onClick={closeInviteDialog}>
                                                <XMarkIcon className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </Dialog.Title>
                                    <div className="mt-4">
                                        <TextInput
                                            label="Email"
                                            description={
                                                invalidEmailMsg ||
                                                "Enter the email of the person you want to invite into your team."
                                            }
                                            id="invite-email"
                                            type="email"
                                            invalid={!!invalidEmailMsg}
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    const res = z
                                                        .string()
                                                        .email()
                                                        .safeParse(
                                                            (
                                                                e.target as HTMLInputElement
                                                            ).value
                                                        );
                                                    if (res.success) {
                                                        if (
                                                            !inviteEmails.includes(
                                                                res.data
                                                            )
                                                        ) {
                                                            setInviteEmails([
                                                                ...inviteEmails,
                                                                res.data,
                                                            ]);
                                                            setEmail("");
                                                        } else {
                                                            setInvalidEmailMsg(
                                                                "This email has already been added to the list."
                                                            );
                                                        }
                                                    } else {
                                                        setInvalidEmailMsg(
                                                            "The email entered is not a valid email."
                                                        );
                                                    }
                                                } else {
                                                    if (invalidEmailMsg)
                                                        setInvalidEmailMsg("");
                                                }
                                            }}
                                        />
                                        <ul>
                                            {inviteEmails.map((email) => (
                                                <li
                                                    key={email}
                                                    className="relative py-2"
                                                >
                                                    <span className="font-medium">
                                                        {email}
                                                    </span>
                                                    <button className="group p-1 absolute right-0 top-1/2 -translate-y-1/2 rounded transition hover:bg-black/5">
                                                        <XMarkIcon className="w-6 h-6 transition text-charcoalBlack/70 group-hover:text-charcoalBlack" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                        <div className="h-8"></div>
                                        <Button
                                            disabled={
                                                disableAllActions ||
                                                inviteEmails.length < 1
                                            }
                                            type="button"
                                            onClick={sendInvitations}
                                        >
                                            Send Invitation
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};
