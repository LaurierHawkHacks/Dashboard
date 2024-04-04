import {
    majorsList,
    genders,
    allergies,
    shirtSizes,
    programmingLanguages,
    pronouns,
    diets,
    sexualityList,
    races,
    interests,
    hackathonExps,
} from "@data";
import type { FormInput } from "./types";

export const hackerAppFormInputs: FormInput[] = [
    {
        type: "multiselect",
        props: {
            label: "Major/Field of Study",
            options: majorsList,
            allowCustomValue: true,
            required: true,
        },
        name: "major",
    },
    {
        type: "select",
        props: {
            label: "Gender",
            initialValue: "Prefer not to answer",
            options: genders,
            allowCustomValue: true,
            required: true,
        },
        name: "gender",
    },
    {
        type: "multiselect",
        props: {
            label: "Pronouns",
            options: pronouns,
            initialValues: ["Prefer not to answer"],
            allowCustomValue: true,
            required: true,
        },
        name: "pronouns",
    },
    {
        type: "select",
        props: {
            label: "Sexuality",
            initialValue: "Prefer not to answer",
            options: sexualityList,
            allowCustomValue: true,
            required: true,
        },
        name: "sexuality",
    },
    {
        type: "select",
        props: {
            label: "Race/Ethnicity",
            initialValue: "Prefer not to answer",
            options: races,
            allowCustomValue: true,
            required: true,
        },
        name: "race",
    },
    {
        type: "multiselect",
        props: {
            label: "Dietry Restrictions",
            initialValues: ["None"],
            options: diets,
            allowCustomValue: true,
            required: true,
        },
        name: "diets",
    },
    {
        type: "multiselect",
        props: {
            label: "Please specify your allergies",
            initialValues: ["None"],
            options: allergies,
            allowCustomValue: true,
            required: true,
        },
        name: "allergies",
    },
    {
        type: "multiselect",
        props: {
            label: "T-Shirt Size",
            options: shirtSizes,
            required: true,
        },
        name: "shirtSizes",
    },
    {
        type: "multiselect",
        props: {
            label: "Interests",
            options: interests,
            allowCustomValue: true,
            required: true,
        },
        name: "interests",
    },
    {
        type: "select",
        props: {
            label: "Previous Hackathon Experience",
            initialValue: "This is my first hackathon",
            options: hackathonExps,
            required: true,
        },
        name: "hackathonExperience",
    },
    {
        type: "multiselect",
        props: {
            label: "Preferred Programming Languages",
            options: programmingLanguages,
            allowCustomValue: true,
        },
        name: "programmingLanguages",
    },
];
