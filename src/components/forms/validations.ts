import { ages } from "@/data";
import { z } from "zod";

export const profileFormValidation = z.object({
    firstName: z
        .string()
        .min(1, "First name must contain at least 1 character(s)"),
    lastName: z
        .string()
        .min(1, "Last name must contain at least 1 character(s)"),
    email: z.string().email(),
    countryOfResidence: z.string().length(2),
    emailVerified: z.boolean(),
    phone: z.string().min(1, "Phone number is empty"),
    school: z.string().min(1, "School is empty"),
    levelOfStudy: z.string().min(1, "Level of study is empty"),
    age: z.string().refine((val) => ages.includes(val)),
    discord: z.string().min(1, "Discord username is empty"),
});

export const hackerAppFormValidation = z.object({
    major: z
        .string()
        .array()
        .min(
            1,
            "Please select a major. If your major is not in the options, please type the major in the input field."
        ),
    gender: z.string().transform((val) => val ?? "Prefer not to answer"),
    pronouns: z
        .string()
        .array()
        .transform((val) => (val.length > 0 ? val : ["Prefer not to answer"])),
    sexuality: z.string().transform((val) => val ?? "Prefer not to answer"),
    race: z.string().transform((val) => val ?? "Prefer not to answer"),
    diets: z
        .string()
        .array()
        .transform((val) => (val.length > 0 ? val : ["None"])),
    allergies: z.string().array(),
    shirtSizes: z
        .string()
        .array()
        .min(1, "Please select at least 1 shirt size."),
    interests: z
        .string()
        .array()
        .min(1, "Please choose at least one interest."),
    hackathonExperience: z.string(),
    programmingLanguages: z.string().array(),
    participatingAs: z
        .string()
        .refine((val) => ["Hacker", "Mentor", "Volunteer"].includes(val)),
    applicantId: z.string(),
    agreedToHawkHacksCoC: z.boolean(),
    agreedToWLUCoC: z.boolean(),
    agreedToMLHCoC: z.boolean(),
    agreetToMLHToCAndPrivacyPolicy: z.boolean(),
    agreedToReceiveEmailsFromMLH: z.boolean(),
});
