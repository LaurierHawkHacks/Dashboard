import type { UserProfile } from "@/services/utils/types";
import type {
    HackerApplicationData,
    ApplicationData,
} from "@/components/forms/types";

export const defaultProfile: UserProfile = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    emailVerified: true,
    phone: "",
    school: "Wilfrid Laurier University",
    levelOfStudy: "Undergraduate University (3+ years)",
    age: "18",
    discord: "",
    countryOfResidence: "CA",
};

export const defaultHackerApp: HackerApplicationData = {
    major: [],
    gender: "Prefer not to answer",
    pronouns: [],
    sexuality: "Prefer not to answer",
    race: "Prefer not to answer",
    diets: [],
    allergies: [],
    shirtSizes: [],
    interests: [],
    hackathonExperience: "1",
    programmingLanguages: [],
    participatingAs: "Hacker",
    applicantId: "",
    agreedToMLHCoC: false,
    agreedToWLUCoC: false,
    agreedToHawkHacksCoC: false,
    agreedToReceiveEmailsFromMLH: false,
    agreetToMLHToCAndPrivacyPolicy: false,
};

export const defaultApplication: ApplicationData = {
    ...defaultProfile,
    ...defaultHackerApp,
};
