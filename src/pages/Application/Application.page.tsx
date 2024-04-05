import { FormEventHandler, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { useAuth, useNotification } from "@/providers/hooks";
import { routes } from "@/navigation/constants";
import {
    TextInput,
    Select,
    Button,
    ErrorAlert,
    MultiSelect,
    Steps,
    LoadingAnimation,
} from "@components";
import { Profile } from "@/components/forms/Profile";
import { hackerAppFormInputs } from "@/components/forms/hackerApplication";
import type {
    ApplicationInputKeys,
    ApplicationData,
} from "@/components/forms/types";
import type { Step } from "@/components/types";
import { defaultApplication } from "@/components/forms/defaults";
import {
    hackerAppFormValidation,
    profileFormValidation,
} from "@/components/forms/validations";
import { getUserApplications, submitApplication } from "@/services/utils";

const defaultSteps: Step[] = [
    { position: 0, name: "Basic profile", status: "current" },
    { position: 1, name: "I want to participate as a...", status: "upcoming" },
    { position: 2, name: "Application", status: "upcoming" },
    { position: 3, name: "Final checks", status: "upcoming" },
];

const stepValidations = [
    profileFormValidation,
    z.object({
        participatingAs: z
            .string()
            .refine((val) => ["Hacker", "Mentor", "Volunteer"].includes(val)),
    }),
    hackerAppFormValidation,
];

export const ApplicationPage = () => {
    // TODO: save steps in firebase to save progress
    const [steps, setSteps] = useState(defaultSteps);
    const [activeStep, setActiveStep] = useState(0); // index
    const [errors, setErrors] = useState<string[]>([]);
    const { currentUser, userProfile } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(true); // default to true to prevent showing the form at first load
    const { showNotification } = useNotification();

    if (!currentUser) return <Navigate to={routes.login} />;

    // we start with the default user profile
    const [application, setApplication] = useState<ApplicationData>(() => {
        let app = defaultApplication;
        if (userProfile) app = { ...app, ...userProfile };
        return app;
    });

    const handleChange = (
        name: ApplicationInputKeys,
        data: string | string[] | boolean
    ) => {
        // @ts-ignore the "name" key is controlled by the keyof typing, restricts having undefined keys, so disable is ok
        application[name] = data;
        setApplication({ ...application });
    };

    const clearErrors = () => setErrors([]);

    const validate = () => {
        clearErrors();

        // allow going back in the final checks step
        if (activeStep === steps.length - 1) return true;

        // validate step form
        const validateFn = stepValidations[activeStep];

        const results = validateFn.safeParse(application);

        if (!results.success) {
            setErrors(results.error.issues.map((i) => i.message));
            return false;
        }

        return true;
    };

    const nextStep = () => {
        if (activeStep < steps.length) {
            if (!validate()) return;
            setSteps((s) => {
                s[activeStep].status = "complete";
                s[activeStep + 1].status = "current";
                return s;
            });
            setActiveStep((s) => s + 1);
        }
    };

    const prevStep = () => {
        if (activeStep > 0) {
            if (!validate()) return;
            setActiveStep((s) => s - 1);
        }
    };

    const jumpTo = (step: number) => {
        if (step > -1 && step < steps.length) {
            if (!validate()) return;
            setActiveStep(step);
        }
    };

    const submitApp: FormEventHandler = async (e) => {
        e.preventDefault();

        clearErrors();

        if (activeStep !== steps.length - 1) {
            nextStep();
            return;
        }

        const allRequiredChecked =
            // don't have the CoC for HH yet so we don't have to make it required for now
            // application.agreedToHawkHacksCoC &&
            application.agreedToWLUCoC &&
            application.agreedToMLHCoC &&
            application.agreetToMLHToCAndPrivacyPolicy;

        if (!allRequiredChecked) {
            setErrors([
                "Please read and check all the required boxes to proceed.",
            ]);
            return;
        }

        try {
            setIsSubmitting(true);
            await submitApplication(application);
            showNotification({
                title: "Application Submitted!",
                message:
                    "Thank you for applying! You'll received an update from us in your email shortly!",
            });
            setHasApplied(true);
        } catch (e) {
            showNotification({
                title: "Error Submitting Application",
                message: "Please retry later.",
            });
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const checkApp = async () => {
            const apps = await getUserApplications(currentUser.uid);
            if (apps.length) setHasApplied(true);
            else setHasApplied(false);
            setIsLoading(false);
        };
        checkApp();
    }, []);

    if (isLoading) return <LoadingAnimation />;

    if (hasApplied)
        return (
            <div>
                <p>Thank you for applying!</p>
                <p>
                    We will send you an email once your application has been
                    processed! Thank you for your patience.
                </p>
            </div>
        );

    return (
        <div>
            <nav aria-label="Application progress">
                <Steps steps={steps} onClick={jumpTo} />
            </nav>
            {errors.length > 0 ? (
                <div className="my-8">
                    <ErrorAlert errors={errors} />
                </div>
            ) : null}
            <h3 className="text-center my-8">
                All fields with an <span className="font-bold">asterisk</span>{" "}
                are <span className="font-bold">required</span>.
            </h3>
            <form onSubmit={submitApp} className="mt-12">
                <div className="">
                    <div
                        className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
                            activeStep !== 0 ? " hidden sm:hidden" : ""
                        }`}
                    >
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
                                required
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
                        {/* dont have the CoC yet */}
                        {/* <div className="sm:col-span-full flex items-start gap-x-2"> */}
                        {/*     <input */}
                        {/*         type="checkbox" */}
                        {/*         checked={application.agreedToHawkHacksCoC} */}
                        {/*         onChange={(e) => */}
                        {/*             handleChange( */}
                        {/*                 "agreedToHawkHacksCoC", */}
                        {/*                 e.target.checked */}
                        {/*             ) */}
                        {/*         } */}
                        {/*     /> */}
                        {/*     <p> */}
                        {/*         { */}
                        {/*             "* I have read and agree to the HawkHacks Code of Conduct." */}
                        {/*         } */}
                        {/*         <a className="ml-2 text-sky-600 underline"> */}
                        {/*             (TBD) */}
                        {/*         </a> */}
                        {/*     </p> */}
                        {/* </div> */}
                        <div className="sm:col-span-full flex items-start gap-x-2">
                            <input
                                type="checkbox"
                                checked={application.agreedToWLUCoC}
                                onChange={(e) =>
                                    handleChange(
                                        "agreedToWLUCoC",
                                        e.target.checked
                                    )
                                }
                            />
                            <p>
                                * I have read and agree to abide by the
                                <a
                                    href="https://www.wlu.ca/about/governance/assets/resources/12.3-non-academic-student-code-of-conduct.html"
                                    className="ml-2 text-sky-600 underline"
                                >
                                    Wilfrid Laurier University Code of Conduct
                                </a>{" "}
                                during the hackathon.
                            </p>
                        </div>
                        <div className="sm:col-span-full flex items-start gap-x-2">
                            <input
                                type="checkbox"
                                checked={application.agreedToMLHCoC}
                                onChange={(e) =>
                                    handleChange(
                                        "agreedToMLHCoC",
                                        e.target.checked
                                    )
                                }
                            />
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
                            <input
                                type="checkbox"
                                checked={
                                    application.agreetToMLHToCAndPrivacyPolicy
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "agreetToMLHToCAndPrivacyPolicy",
                                        e.target.checked
                                    )
                                }
                            />
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
                            <input
                                type="checkbox"
                                checked={
                                    application.agreedToReceiveEmailsFromMLH
                                }
                                onChange={(e) =>
                                    handleChange(
                                        "agreedToReceiveEmailsFromMLH",
                                        e.target.checked
                                    )
                                }
                            />
                            <p>
                                I authorize MLH to send me occasional emails
                                about relevant events, career opportunities, and
                                community announcements.
                            </p>
                        </div>
                    </div>
                </div>
                {/* adding some more white space between the last input field and the buttons */}
                <div className="h-12"></div>
                {/* just a separator line */}
                <div className="h-0.5 bg-gray-300 my-6"></div>
                <div>
                    {errors.length > 0 ? (
                        <p className="text-center text-red-600">
                            Oh no! It appears that the are errors in the form.
                        </p>
                    ) : null}
                </div>
                <div className="flex items-center justify-between px-4 py-4 sm:px-8">
                    <Button
                        disabled={activeStep === 0 || isSubmitting}
                        onClick={prevStep}
                        type="button"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Submitting..."
                            : activeStep === steps.length - 1
                            ? "Submit"
                            : "Next"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
