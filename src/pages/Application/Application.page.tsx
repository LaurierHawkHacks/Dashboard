import { FormEventHandler, useState, FC } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@providers";
import { routes } from "@utils";
import type { UserProfile } from "@services/utils";
import { Button, TextInput, Select } from "@components";
import { levelsOfStudy, ages, schools, countryCodes } from "@data";

type StepStatus = "complete" | "current" | "upcoming";

interface Step {
    position: number;
    name: string;
    status: StepStatus;
}

const defaultSteps: Step[] = [
    { position: 1, name: "Basic profile", status: "current" },
    { position: 2, name: "I want to participate as a...", status: "upcoming" },
    { position: 3, name: "Application", status: "upcoming" },
    { position: 4, name: "Final checks", status: "upcoming" },
];

export const Steps = ({ steps }: { steps: Step[] }) => {
    return (
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
            {steps.map((step) => (
                <li key={step.position} className="md:flex-1">
                    {step.status === "complete" || step.status === "current" ? (
                        <button
                            className="w-full flex flex-col border-l-4 border-tbrand py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                            aria-current="step"
                        >
                            <span className="text-left text-sm font-medium text-tbrand">
                                {`Step ${step.position}`}
                            </span>
                            <span className="text-left text-sm font-medium">
                                {step.name}
                            </span>
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full flex flex-col border-l-4 border-gray-200 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                        >
                            <span className="text-left text-sm font-medium text-gray-500">
                                {`Step ${step.position}`}
                            </span>
                            <span className="text-left text-sm font-medium">
                                {step.name}
                            </span>
                        </button>
                    )}
                </li>
            ))}
        </ol>
    );
};

export interface ProfileStepProps {
    profile: UserProfile | null;
}

export const ProfileStep: FC<ProfileStepProps> = ({ profile }) => {
    if (!profile) return <div>No profile</div>;
    return (
        <>
        </>
    );
};

export const ApplicationPage = () => {
    // TODO: save steps in firebase to save progress
    const [steps, setSteps] = useState(defaultSteps);
    const [activeStep, setActiveSetp] = useState(0); // index
    const { currentUser, userProfile } = useAuth();
    // we start with the default user profile
    const [profile, setProfile] = useState(userProfile ?? {
        firstName: "",
        lastName: "",
        email: "",
        emailVerified: false,
        id: "",
        phone: "",
        school: "",
        levelOfStudy: "",
        countryOfResidence: "",
        age: 0,
        discord: "",
    });

    if (!currentUser) return <Navigate to={routes.login} />;

    const submitApplication: FormEventHandler = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <nav aria-label="Application progress">
                <Steps steps={steps} />
            </nav>
            <form onSubmit={submitApplication}>
                <div className="px-4 py-6 sm:p-8">
                    <div className="sm:grid max-w-2xl mx-auto space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6">
                        {
                            activeStep === 0 ? (
                                <>
                                    <div className="sm:col-span-3">
                                        <TextInput
                                            id="profile-first-name"
                                            label="First name"
                                            type="text"
                                            value={profile.firstName}
                                    onChange={(e) =>
                                        setProfile((c) => ({
                                            ...c,
                                            firstName: e.target.value,
                                        }))
                                    }
                                        />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <TextInput
                                            id="profile-last-name"
                                            label="Last name"
                                            type="text"
                                            value={profile.lastName}
                                    onChange={(e) =>
                                        setProfile((c) => ({
                                            ...c,
                                            firstName: e.target.value,
                                        }))
                                    }
                                        />
                                    </div>
                            <div className="sm:col-span-2">
                                <Select
                                    label="Age"
                                    options={ages}
                                    initialValue={profile.age?.toString() ?? "18"}
                                    onChange={(opt) => {
                                        setProfile((c) => ({
                                            ...c,
                                            age: opt === "50+" ? 50 : parseInt(opt),
                                        }));
                                    }}
                                />
                            </div>

                            <div className="sm:col-span-4">
                                <TextInput
                                    label="Email address"
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) =>
                                        setProfile((c) => ({
                                            ...c,
                                            email: e.target.value,
                                        }))
                                    }
                                    disabled={!!currentUser.email}
                                    required
                                />
                            </div>

                            <div className="col-span-6">
                                <TextInput
                                    label="Phone Number"
                                    id="phone-number"
                                    placeholder="+1 (999) 999-9999"
                                    name="phone"
                                    value={profile.phone}
                                    type="tel"
                                    onChange={(e) =>
                                        setProfile((c) => ({
                                            ...c,
                                            phone: e.target.value,
                                        }))
                                    }
                                    required
                                />
                            </div>

                            <div className="col-span-3">
                                <Select
                                    label="School"
                                    options={schools}
                                    initialValue={
                                        schools.find(
                                            (val) =>
                                                val ===
                                                "Wilfrid Laurier University"
                                        )!
                                    }
                                    onChange={(school) =>
                                        setProfile((c) => ({
                                            ...c,
                                            school: school,
                                        }))
                                    }
                                />
                            </div>
                            <div className="col-span-3">
                                <Select
                                    label="Level of Study"
                                    options={levelsOfStudy}
                                    initialValue={levelsOfStudy[0]}
                                    onChange={(opt) =>
                                        setProfile((c) => ({
                                            ...c,
                                            levelOfStudy: opt,
                                        }))
                                    }
                                />
                            </div>

                            <div className="sm:col-span-4">
                                <Select
                                    label="Country"
                                    options={countryCodes}
                                    onChange={(opt) => {
                                        setProfile((c) => ({
                                            ...c,
                                            countryOfResidence: opt,
                                        }));
                                        // setSelectedCountry(opt);
                                    }}
                                    initialValue={"CA"}
                                />
                            </div>

                            <div className="sm:col-span-full">
                                <TextInput
                                    label="Discord"
                                    id="discord"
                                    placeholder="@username or username#1234"
                                    onChange={(e) =>
                                        setProfile((c) => ({
                                            ...c,
                                            discord: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                                </>
                            ) : null
                        }
                    </div>
                </div>
                <div className="h-0.5 bg-gray-300 my-6"></div>
                <div className="flex items-center justify-end px-4 py-4 sm:px-8">
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </div>
    );
};
