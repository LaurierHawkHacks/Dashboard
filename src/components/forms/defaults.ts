import type { UserProfile } from "@services/utils";
import type { HackerApplicationData, ApplicationData } from "./types";

export const defaultProfile: UserProfile = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    emailVerified: false,
    phone: "",
    school: "Wilfrid Laurier University",
    levelOfStudy: "Undergraduate University (3+ years)",
    age: "18",
    discord: "",
    countryOfResidence: "CA",
};

export const defaultHackerApp: HackerApplicationData = {
    major: "",
    gender: "",
    pronouns: [],
    sexuality: "",
    race: "",
    diets: [],
    allergies: [],
    shirtSizes: [],
    interests: [],
    hackathonExperience: "1",
    programmingLanguages: [],
    participatingAs: "Hacker",
};

export const defaultApplication: ApplicationData = {
    ...defaultProfile,
    ...defaultHackerApp,
};
