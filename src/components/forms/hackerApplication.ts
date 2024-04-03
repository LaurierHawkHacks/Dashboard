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
        },
        name: "major",
    },
    {
        type: "select",
        props: {
            label: "Gender",
            initialValue: "",
            options: genders,
            allowCustomValue: true,
        },
        name: "gender",
    },
    {
        type: "multiselect",
        props: {
            label: "Pronouns",
            options: pronouns,
            allowCustomValue: true,
        },
        name: "pronouns",
    },
    {
        type: "select",
        props: {
            label: "Sexuality",
            initialValue: "",
            options: sexualityList,
            allowCustomValue: true,
        },
        name: "sexuality",
    },
    {
        type: "select",
        props: {
            label: "Race/Ethnicity",
            initialValue: "",
            options: races,
            allowCustomValue: true,
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
        },
        name: "diets",
    },
    {
        type: "multiselect",
        props: {
            label: "Please specify your allergies",
            options: allergies,
            allowCustomValue: true,
        },
        name: "allergies",
    },
    {
        type: "multiselect",
        props: {
            label: "T-Shirt Size",
            options: shirtSizes,
        },
        name: "shirtSizes",
    },
    {
        type: "multiselect",
        props: {
            label: "Interests",
            options: interests,
            allowCustomValue: true,
        },
        name: "interests",
    },
    {
        type: "select",
        props: {
            label: "Previous Hackathon Experience",
            initialValue: "This is my first hackathon",
            options: hackathonExps,
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
