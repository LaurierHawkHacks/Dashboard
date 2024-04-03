import { FormEventHandler, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@providers";
import { routes } from "@utils";
import type { UserProfile } from "@services/utils";
import {
    TextInput,
    Select,
    Button,
    ErrorAlert,
    MultiSelect,
} from "@components";
import { schools, levelsOfStudy, countryCodes, ages, majorsList } from "@data";

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

const defaultProfile: UserProfile = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    emailVerified: false,
    phone: "",
    school: "Wilfrid Laurier University",
    levelOfStudy: "Undergraduate University (3+ years)",
    age: 13,
    discord: "",
    countryOfResidence: "CA",
};

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

const Profile = ({ profile }: { profile: UserProfile }) => {
    return (
        <>
            <div className="sm:col-span-3">
                <TextInput
                    label="First name"
                    type="text"
                    name="firstName"
                    id="firstName"
                    autoComplete="given-name"
                    placeholder="Steven"
                    defaultValue={profile.firstName}
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <TextInput
                    label="Last name"
                    type="text"
                    name="lastName"
                    id="lastName"
                    autoComplete="family-name"
                    placeholder="Wu"
                    defaultValue={profile.lastName}
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <Select
                    label="Age"
                    options={ages}
                    initialValue={profile.age.toString()}
                    name="age"
                />
            </div>

            <div className="sm:col-span-3">
                <Select
                    label="Country"
                    options={countryCodes}
                    initialValue={profile.countryOfResidence ?? "CA"}
                    name="country"
                />
            </div>

            <div className="sm:col-span-full">
                <TextInput
                    label="Email address"
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={profile.email ?? ""}
                    disabled={!!profile?.email}
                    required
                />
            </div>

            <div className="col-span-6">
                <TextInput
                    label="Phone Number"
                    id="phone-number"
                    placeholder="+1 (999) 999-9999"
                    name="phone"
                    defaultValue={profile.phone}
                    type="tel"
                    required
                />
            </div>

            <div className="col-span-3">
                <Select
                    label="School"
                    options={schools}
                    initialValue={profile.school}
                    name="school"
                />
            </div>
            <div className="col-span-3">
                <Select
                    label="Level of Study"
                    options={levelsOfStudy}
                    initialValue={profile.levelOfStudy}
                    name="level-of-study"
                />
            </div>

            <div className="sm:col-span-full">
                <TextInput
                    label="Discord username"
                    id="discord"
                    placeholder="@username or username#1234"
                    defaultValue={profile.discord}
                    name="discord"
                />
            </div>
        </>
    );
};

export const ParticipateAsStep = () => {
    return (
        <>
            <div className="sm:col-span-full">
                <Select
                    label="Role"
                    options={["Hacker", "Mentor", "Volunteer"]}
                    initialValue="Hacker"
                    name="participate-as"
                />
            </div>
        </>
    );
};

export const HackerApplication = () => {
    const [diet, setDiet] = useState<string[]>([]);
    return (
        <>
            <div className="sm:col-span-full">
                <MultiSelect
                    label="Major/Field of Study"
                    options={majorsList}
                    name="major"
                    allowCustomValue
                />
            </div>

            <div className="sm:col-span-full">
                <Select
                    label="Gender"
                    options={[
                        "Man",
                        "Woman",
                        "Non-Binary",
                        "Transgender",
                        "Two-Spirit",
                        "Prefer not to answer",
                    ]}
                    initialValue=""
                    name="gender"
                    allowCustomValue
                />
            </div>

            <div className="sm:col-span-full">
                <MultiSelect
                    label="Pronouns"
                    options={[
                        "She/Her",
                        "He/Him",
                        "They/Them",
                        "Prefer not to answer",
                    ]}
                    name="pronouns"
                    allowCustomValue
                />
            </div>

            <div className="sm:col-span-full">
                <Select
                    label="Sexuality"
                    options={[
                        "Heterosexual or straight",
                        "Gay or lesbian",
                        "Bisexual",
                        "Prefer not to answer",
                    ]}
                    initialValue=""
                    name="pronouns"
                    allowCustomValue
                />
            </div>

            <div className="sm:col-span-full">
                <Select
                    label="Race/Ethnicity"
                    options={[
                        "Asian Indian",
                        "Black or African",
                        "Chinese",
                        "Filipino",
                        "Guamanian or Chamorro",
                        "Hispanic/Latino/Spanish Origin",
                        "Japanese",
                        "Korean",
                        "Middle Eastern",
                        "Native America or Alaskan Native",
                        "Native Hawaiian",
                        "Samoan",
                        "Vietnamese",
                        "White",
                        "Prefer not to answer",
                    ]}
                    initialValue=""
                    name="race-ethnicity"
                    allowCustomValue
                />
            </div>

            <div className="sm:col-span-full">
                <MultiSelect
                    label="Dietry Restrictions"
                    options={[
                        "None",
                        "Vegetarian",
                        "Celiac Disease",
                        "Allergies",
                        "Kosher",
                        "Halal",
                    ]}
                    name="dietry-restrictions"
                    initialValues={["None"]}
                    onChange={setDiet}
                    allowCustomValue
                />
                {diet.includes("Allergies") ? (
                    <div className="mt-4">
                        <MultiSelect
                            label="Please specify your allergies"
                            name="specifc-allergies"
                            options={[
                                "Milk",
                                "Egg",
                                "Peanuts",
                                "Soy",
                                "Wheat",
                                "Tree Nuts (almonds, walnuts, hazelnuts, cashews, pistachios, Brazil nuts, etc...)",
                                "Shellfish",
                                "Fish",
                                "Sesame",
                            ]}
                            allowCustomValue
                        />
                    </div>
                ) : null}
            </div>

            <div className="sm:col-span-full">
                <MultiSelect
                    label="T-Shirt Size"
                    name="tshirt-size"
                    options={["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]}
                />
            </div>

            <div className="sm:col-span-full">
                <MultiSelect
                    label="Interests"
                    name="interests"
                    options={[
                        "Web3, Crypto, and Blockchain",
                        "Distributed and Parallel Computing",
                        "Frontend Engineering",
                        "Backend Engineering",
                        "Full-stack Engineering",
                        "Data Sciene",
                        "Robotics",
                        "AR/VR Technology",
                        "Embedded Systems",
                        "Game Development",
                        "DevOps & Infrastructure Engineering",
                        "Artificial Intelligence (AI)",
                        "Human-Computer Interface (HCI)",
                        "Networking",
                        "Mobile Development",
                    ]}
                    allowCustomValue
                />
            </div>

            <div className="sm:col-span-full">
                <Select
                    label="Previous Hackathon Experience"
                    name="hackathon-exp"
                    options={[
                        "This is my first hackathon",
                        "1",
                        "2",
                        "3",
                        "4+",
                    ]}
                    initialValue="This is my first hackathon"
                />
            </div>

            <div className="sm:col-span-full">
                <MultiSelect
                    label="Preferred Programming Languages"
                    name="programming-lang"
                    options={[
                        "C",
                        "C++",
                        "C#",
                        "Python",
                        "Java",
                        "Rust",
                        "Golang",
                        "JavaScript",
                        "TypeScript",
                        "Ruby",
                        "New to programming",
                        "Not sure",
                    ]}
                    allowCustomValue
                />
            </div>
        </>
    );
};

const FinalChecks = () => {
    return (
        <>
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
                    <a className="ml-2 text-sky-600 underline">(TBD)</a>
                </p>
            </div>
            <div className="sm:col-span-full flex items-start gap-x-2">
                <input type="checkbox" required name="check-2" />
                <p>
                    {
                        "* I have read and agree to abide by the Wilfrid Laurier University Code of Conduct during the hackathon."
                    }
                    <a className="ml-2 text-sky-600 underline">(TBD)</a>
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
                    * I authorize you to share my application/registration
                    information with Major League Hacking for event
                    administration, ranking, and MLH administration in line with
                    the
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
                    I authorize MLH to send me occasional emails about relevant
                    events, career opportunities, and community announcements.
                </p>
            </div>
        </>
    );
};

export const ApplicationPage = () => {
    // TODO: save steps in firebase to save progress
    const [steps, setSteps] = useState(defaultSteps);
    const [activeStep, setActiveStep] = useState(0); // index
    const [errors, setErrors] = useState<string[]>([]);
    const { currentUser, userProfile } = useAuth();
    // we start with the default user profile

    if (!currentUser) return <Navigate to={routes.login} />;

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
        console.log(e.target["country"]);
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
                        <Profile profile={userProfile ?? defaultProfile} />
                    </div>
                    <div
                        className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
                            activeStep !== 1 ? " hidden sm:hidden" : ""
                        }`}
                    >
                        <ParticipateAsStep />
                    </div>
                    <div
                        className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
                            activeStep !== 2 ? " hidden sm:hidden" : ""
                        }`}
                    >
                        <HackerApplication />
                    </div>
                    <div
                        className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
                            activeStep !== 3 ? " hidden sm:hidden" : ""
                        }`}
                    >
                        <FinalChecks />
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
                        disabled={activeStep === steps.length - 1}
                    >
                        {activeStep === steps.length - 1 ? "Submit" : "Next"}
                    </Button>
                </div>
            </form>
        </div>
    );
};
