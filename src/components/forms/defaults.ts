import type { UserProfile } from "@/services/utils/types";
import type { ApplicationData } from "@/components/forms/types";

export const defaultProfile: UserProfile = {
    firstName: "",
    lastName: "",
    phone: "",
    school: "",
    levelOfStudy: "",
    age: "",
    discord: "",
    countryOfResidence: "",
    city: "",
    major: [],
};

export const defaultApplication: ApplicationData = {
    ...defaultProfile,

    major: [],
    gender: "",
    pronouns: [],
    sexuality: "",
    race: "",
    diets: [],
    allergies: [],
    interests: [],
    hackathonExperience: "",
    programmingLanguages: [],
    participatingAs: "",
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
