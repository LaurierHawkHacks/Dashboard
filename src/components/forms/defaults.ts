import type { ApplicationData } from "@/components/forms/types";

export const defaultApplication: ApplicationData = {
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

    gender: "",
    pronouns: [],
    sexuality: "",
    race: "",
    diets: [],
    allergies: [],
    interests: [],
    hackathonExperience: "",
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

    linkedinUrl: "",
    githubUrl: "",
    personalWebsiteUrl: "",
};
