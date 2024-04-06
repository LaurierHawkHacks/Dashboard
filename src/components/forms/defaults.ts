import type { UserProfile } from "@/services/utils/types";
import type { ApplicationData } from "@/components/forms/types";

export const defaultProfile: UserProfile = {
    firstName: "",
    lastName: "",
    phone: "",
    school: "Wilfrid Laurier University",
    levelOfStudy: "Undergraduate University (3+ years)",
    age: "18",
    discord: "",
    countryOfResidence: "Canada",
    city: "Waterloo",
};

export const defaultApplication: ApplicationData = {
    ...defaultProfile,

    major: [],
    gender: "Prefer not to answer",
    pronouns: [],
    sexuality: "Prefer not to answer",
    race: "Prefer not to answer",
    diets: [],
    allergies: [],
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
    referralSources: [],
    describeSalt: "",

    // hacker only
    reasonToBeInHawkHacks: "",
    revolutionizingTechnology: "",

    // mentor only
    mentorResumeUrl: "",
    mentorExperience: "",
    reasonToBeMentor: "",

    // volunteer only
    volunteerExperience: "",
    excitedToVolunteerFor: "",
    reasonToBeVolunteer: "",
};
