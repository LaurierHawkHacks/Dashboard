import type { UserProfile } from "@services/utils";
import type { TextInputProps } from "../TextInput/TextInput";
import type { SelectProps } from "../Select/Select";
import type { MultiSelectProps } from "../MultiSelect/MultiSelect";

export interface HackerApplicationData {
    major: string;
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
