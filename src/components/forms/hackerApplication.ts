import {
    genders,
    allergies,
    programmingLanguages,
    pronouns,
    diets,
    sexualityList,
    races,
    interests,
    hackathonExps,
    mentorSpecificOptions,
    volunteerSpecificOptions,
} from "@data";
import type { FormInput } from "./types";

export const hackerAppFormInputs: FormInput[] = [
    {
        type: "select",
        props: {
            label: "What gender do you identify as?",
            initialValue: "",
            options: genders,
            allowCustomValue: true,
            required: true,
        },
        name: "gender",
    },
    {
        type: "select",
        props: {
            label: "What are your pronouns?",
            initialValue: "",
            options: pronouns,
            allowCustomValue: true,
            required: true,
        },
        name: "pronouns",
    },
    {
        type: "select",
        props: {
            label: "Please select any of the following that resonates with you:",
            initialValue: "",
            options: sexualityList,
            allowCustomValue: true,
            required: true,
        },
        name: "sexuality",
    },
    {
        type: "select",
        props: {
            label: "Which of the following best describes your racial or ethnic background?",
            initialValue: "",
            options: races,
            allowCustomValue: false,
            required: true,
        },
        name: "race",
    },
    {
        type: "multiselect",
        props: {
            label: "Do you have any dietary restrictions?",
            options: diets,
            allowCustomValue: true,
            required: true,
        },
        name: "diets",
    },
    {
        type: "multiselect",
        props: {
            label: "Are there any allergens you have that we should be aware of?",
            options: allergies,
            allowCustomValue: true,
            required: true,
        },
        name: "allergies",
    },
    {
        type: "multiselect",
        props: {
            label: "Which of the following fields interests you?",
            options: interests,
            allowCustomValue: true,
            required: true,
        },
        name: "interests",
    },
    {
        type: "select",
        props: {
            label: "How many Hackathons have you attended as a participant in the past?",
            initialValue: "",
            options: hackathonExps,
            required: true,
        },
        name: "hackathonExperience",
    },
    {
        type: "multiselect",
        props: {
            label: "What programming languages are you the most comfortable with or passionate about?",
            options: programmingLanguages,
            allowCustomValue: true,
        },
        name: "programmingLanguages",
    },
];

export const hackerSpecificForm: FormInput[] = [
    {
        type: "textarea",
        props: {
            id: "hacker-specific-q1",
            label: "Why do you want to participate at HawkHacks?",
            rows: 4,
            required: true,
        },
        name: "reasonToBeInHawkHacks",
    },
    {
        type: "textarea",
        props: {
            id: "hacker-specific-q2",
            label: "In a few sentences, what up-and-coming or revolutionizing technology are you most excited about?",
            rows: 4,
            required: true,
        },
        name: "revolutionizingTechnology",
    },
];

export const mentorSpecificForm: FormInput[] = [
    {
        type: "select",
        props: {
            label: "Have you mentored at previous hackathons before?",
            options: mentorSpecificOptions,
            initialValue: "",
            required: true,
        },
        name: "mentorExperience",
    },
    {
        type: "text",
        props: {
            label: "Do you have a LinkedIn profile? If so, please provide a link to your profile.",
            required: false,
            id: "linkedin-url",
            placeholder: "https://www.linkedin.com/in/john-smith",
        },
        name: "linkedinUrl",
    },
    {
        type: "text",
        props: {
            label: "Do you have a GitHub account? If so, please provide a link to your profile.",
            required: false,
            id: "github-url",
            placeholder: "https://github.com/SherRao",
        },
        name: "githubUrl",
    },
    {
        type: "text",
        props: {
            label: "Do you have a personal or other website you would like to include? If so, please provide a link.",
            required: false,
            id: "personal-website-url",
            placeholder: "https://hawkhacks.ca",
        },
        name: "personalWebsiteUrl",
    },
    {
        type: "textarea",
        props: {
            label: "Why do you want to be a mentor at HawkHacks?",
            required: true,
            rows: 4,
            id: "reason-to-be-mentor",
        },
        name: "reasonToBeMentor",
    },

    // TODO: add resume upload
];

export const volunteerSpecificForm: FormInput[] = [
    {
        type: "select",
        props: {
            label: "Have you volunteered at large-scale events before?",
            options: volunteerSpecificOptions,
            initialValue: "",
            required: true,
        },
        name: "volunteerExperience",
    },
    {
        type: "textarea",
        props: {
            label: "Why do you want to be a volunteer at HawkHacks?",
            rows: 4,
            id: "reason-to-be-volunteer",
            required: true,
        },
        name: "reasonToBeVolunteer",
    },
    {
        type: "textarea",
        props: {
            label: "In a couple of sentences, what would you be most excited about helping out with at HawkHacks and why?",
            rows: 4,
            id: "exicted-to-volunteer-for",
            required: true,
        },
        name: "excitedToVolunteerFor",
    },
];
