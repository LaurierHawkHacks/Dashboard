import { FormEventHandler, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/hooks";
import { routes } from "@/navigation/constants";
import {
    TextInput,
    Select,
    Button,
    ErrorAlert,
    MultiSelect,
    Steps,
} from "@components";
import { Profile } from "@/components/forms/Profile";
import { hackerAppFormInputs } from "@/components/forms/hackerApplication";
import type {
    ApplicationInputKeys,
    ApplicationData,
} from "@/components/forms/types";
import type { Step } from "@/components/types";
import { defaultApplication } from "@/components/forms/defaults";

const defaultSteps: Step[] = [
    { position: 1, name: "Basic profile", status: "current" },
    { position: 2, name: "I want to participate as a...", status: "upcoming" },
    { position: 3, name: "Application", status: "upcoming" },
    { position: 4, name: "Final checks", status: "upcoming" },
];

export const ApplicationPage = () => {
    // TODO: save steps in firebase to save progress
    const [steps, setSteps] = useState(defaultSteps);
    const [activeStep, setActiveStep] = useState(0); // index
    const [errors, setErrors] = useState<string[]>([]);
    const { currentUser, userProfile } = useAuth();
    // we start with the default user profile

    if (!currentUser) return <Navigate to={routes.login} />;

    const [application, setApplication] = useState<ApplicationData>(() => {
        let app = defaultApplication;
        if (userProfile) app = { ...app, ...userProfile };
        return app;
    });

    const handleChange = (
        name: ApplicationInputKeys,
        data: string | string[]
    ) => {
        // @ts-ignore the "name" key is controlled by the keyof typing, restricts having undefined keys, so disable is ok
        application[name] = data;
        setApplication({ ...application });
    };

    const clearErrors = () => setErrors([]);

    const nextStep = () => {
        clearErrors();

        if (activeStep < steps.length) {
            // validate step form
            setSteps((s) => {
                s[activeStep].status = "complete";
                s[activeStep + 1].status = "current";
                return s;
            });
            setActiveStep((s) => s + 1);
        }
    };

    const prevStep = () => {
        clearErrors();

        if (activeStep > 0) {
            setSteps((s) => {
                s[activeStep].status = "upcoming";
                s[activeStep - 1].status = "current";
                return s;
            });
            setActiveStep((s) => s - 1);
        }
    };

    const submitApp: FormEventHandler = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <nav aria-label="Application progress">
                <Steps steps={steps} />
            </nav>
            {errors.length > 0 ? (
                <div className="my-8">
                    <ErrorAlert errors={errors} />
                </div>
            ) : null}
            <form onSubmit={submitApp} className="mt-12">
                <div className="">
                    <div
                        className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
                            activeStep !== 0 ? " hidden sm:hidden" : ""
                        }`}
                    >
                        <p className="sm:col-span-full">
                            Make sure the information is correct.
                        </p>
                        <Profile profile={application} handler={handleChange} />
                    </div>
                    <div
                        className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
                            activeStep !== 1 ? " hidden sm:hidden" : ""
                        }`}
                    >
                        <div className="sm:col-span-full">
                            <Select
                                label="Role"
                                options={["Hacker", "Mentor", "Volunteer"]}
                                initialValue="Hacker"
                                onChange={(opt) =>
                                    handleChange("participatingAs", opt)
                                }
                            />
                        </div>
                    </div>
                    <div
                        className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
                            activeStep !== 2 ? " hidden sm:hidden" : ""
                        }`}
                    >
                        {hackerAppFormInputs.map((input) => (
                            <div
                                key={input.props.label}
                                className="sm:col-span-full"
                            >
                                {input.type === "text" ? (
                                    <TextInput
                                        {...input.props}
                                        value={
                                            application[input.name] as string
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                input.name,
                                                e.target.value
                                            )
                                        }
                                    />
                                ) : input.type === "select" ? (
                                    <Select
                                        {...input.props}
                                        onChange={(opt) =>
                                            handleChange(input.name, opt)
                                        }
                                    />
                                ) : input.type === "multiselect" ? (
                                    <MultiSelect
                                        {...input.props}
                                        onChange={(opts) =>
                                            handleChange(input.name, opts)
                                        }
                                    />
                                ) : null}
                            </div>
                        ))}
                    </div>
                    <div
                        className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
                            activeStep !== 3 ? " hidden sm:hidden" : ""
                        }`}
                    >
                        <div className="sm:col-span-full">
                            <h3>
                                All checkboxes with an{" "}
                                <span className="font-bold">asterisk</span> are{" "}
                                <span className="font-bold">required</span>.
                            </h3>
                        </div>
                        <div className="sm:col-span-full flex items-start gap-x-2">
                            <input type="checkbox" required name="check-1" />
                            <p>
                                {
                                    "* I have read and agree to the HawkHacks Code of Conduct."
                                }
                                <a className="ml-2 text-sky-600 underline">
                                    (TBD)
                                </a>
                            </p>
                        </div>
                        <div className="sm:col-span-full flex items-start gap-x-2">
                            <input type="checkbox" required name="check-2" />
                            <p>
                                {
                                    "* I have read and agree to abide by the Wilfrid Laurier University Code of Conduct during the hackathon."
                                }
                                <a className="ml-2 text-sky-600 underline">
                                    (TBD)
                                </a>
                            </p>
                        </div>
                        <div className="sm:col-span-full flex items-start gap-x-2">
                            <input type="checkbox" required name="check-3" />
                            <p>
                                * I have read and agree to the
                                <a
                                    className="ml-2 text-sky-600 underline"
                                    href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
                                >
                                    {" "}
                                    MLH Code of Conduct
                                </a>
                                .
                            </p>
                        </div>
                        <div className="sm:col-span-full flex items-start gap-x-2">
                            <input type="checkbox" required name="check-4" />
                            <p>
                                * I authorize you to share my
                                application/registration information with Major
                                League Hacking for event administration,
                                ranking, and MLH administration in line with the
                                <a
                                    className="text-sky-600 underline"
                                    href="https://mlh.io/privacy"
                                >
                                    {" "}
                                    MLH Privacy Policy
                                </a>
                                . I further agree to the terms of both the
                                <a
                                    className="text-sky-600 underline"
                                    href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md)and"
                                >
                                    {" "}
                                    MLH Contest Terms and Conditions
                                </a>
                                .
                            </p>
                        </div>
                        <div className="sm:col-span-full flex items-start gap-x-2">
                            <input type="checkbox" name="check-5" />
                            <p>
                                I authorize MLH to send me occasional emails
                                about relevant events, career opportunities, and
                                community announcements.
                            </p>
                        </div>
                    </div>
                </div>
                {/* just a separator line */}
                <div className="h-0.5 bg-gray-300 my-6"></div>
                <div className="flex items-center justify-between px-4 py-4 sm:px-8">
                    <Button disabled={activeStep === 0} onClick={prevStep}>
                        Back
                    </Button>
                    <Button
                        type={
                            activeStep === steps.length - 1
                                ? "submit"
                                : "button"
                        }
                        onClick={
                            activeStep === steps.length - 1
                                ? console.log
                                : nextStep
                        }
                    >
                        {activeStep === steps.length - 1 ? "Submit" : "Next"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
