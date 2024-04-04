import type { UserProfile } from "@/services/utils/types";
import type {
    TextInputProps,
    SelectProps,
    MultiSelectProps,
} from "@/components/types";

export interface HackerApplicationData {
    major: string[];
    gender: string;
    pronouns: string[];
    sexuality: string;
    race: string;
    diets: string[];
    allergies: string[];
    shirtSizes: string[];
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
}

export type ApplicationData = UserProfile & HackerApplicationData;

export type ApplicationInputKeys = keyof ApplicationData;

export interface TextFormInput {
    type: "text";
    props: TextInputProps;
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

export type FormInput = TextFormInput | SelectFormInput | MultiSelectFormInput;
