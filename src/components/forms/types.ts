import type {
    TextInputProps,
    SelectProps,
    MultiSelectProps,
} from "@/components/types";
import { TextAreaProps } from "../TextArea/TextArea";

export interface HackerApplicationData {
    firstName: string;
    lastName: string;
    phone: string;
    school: string;
    levelOfStudy: string;
    countryOfResidence: string;
    city: string;
    age: string;
    discord: string;
    major: string[];
    gender: string;
    pronouns: string[];
    sexuality: string;
    race: string;
    diets: string[];
    allergies: string[];
    interests: string[];
    hackathonExperience: string;
    programmingLanguages: string[];
    participatingAs: "Hacker" | "Mentor" | "Volunteer";
    applicantId: string;
    agreedToHawkHacksCoC: boolean;
    agreedToWLUCoC: boolean;
    agreedToMLHCoC: boolean;
    agreetToMLHToCAndPrivacyPolicy: boolean;
    agreedToReceiveEmailsFromMLH: boolean;
    applicationStatus?: "pending" | "rejected" | "accepted";
    accepted?: boolean;
    referralSources: string[];
    describeSalt: string;
    generalResumeRef: string;
}

export interface HackerSpecificAppData {
    reasonToBeInHawkHacks: string;
    revolutionizingTechnology: string;
}

export interface MentorSpecificAppData {
    mentorExperience: string;
    linkedinUrl: string;
    githubUrl: string;
    personalWebsiteUrl: string;
    mentorResumeRef: string;
    reasonToBeMentor: string;
}

export interface VolunteerSpecificAppData {
    volunteerExperience: string;
    reasonToBeVolunteer: string;
    excitedToVolunteerFor: string;
}

export type ApplicationData = HackerApplicationData &
    HackerSpecificAppData &
    MentorSpecificAppData &
    VolunteerSpecificAppData;

export type ApplicationInputKeys = keyof ApplicationData;

export interface TextFormInput {
    type: "text";
    props: TextInputProps;
    name: ApplicationInputKeys;
}

export interface TextAreaFormInput {
    type: "textarea";
    props: TextAreaProps;
    name: ApplicationInputKeys;
}

export interface SelectFormInput {
    type: "select";
    props: SelectProps;
    name: ApplicationInputKeys;
}

export interface MultiSelectFormInput {
    type: "multiselect";
    props: MultiSelectProps;
    name: ApplicationInputKeys;
}

export type FormInput =
    | TextFormInput
    | SelectFormInput
    | MultiSelectFormInput
    | TextAreaFormInput;
