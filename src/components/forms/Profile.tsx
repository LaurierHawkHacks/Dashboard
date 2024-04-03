import { z } from "zod";
import { TextInput, Select } from "@components";
import { ages, countryCodes, schools, levelsOfStudy } from "@data";

import type { UserProfile } from "@/services/utils/types";
import type { ApplicationInputKeys } from "@/components/forms/types";

export const formValidationSchema = z.object({
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
    age: z.number().min(13, "Age must be 13+"),
    discord: z.string().min(1, "Discord username is empty"),
});

export const Profile = ({
    profile,
    handler,
}: {
    profile: UserProfile;
    handler: (name: ApplicationInputKeys, data: string | string[]) => void;
}) => {
    return (
        <>
            <div className="sm:col-span-3">
                <TextInput
                    label="First name"
                    type="text"
                    id="firstName"
                    autoComplete="given-name"
                    placeholder="Steven"
                    value={profile.firstName}
                    onChange={(e) => handler("firstName", e.target.value)}
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <TextInput
                    label="Last name"
                    type="text"
                    id="lastName"
                    autoComplete="family-name"
                    placeholder="Wu"
                    value={profile.lastName}
                    onChange={(e) => handler("lastName", e.target.value)}
                    required
                />
            </div>

            <div className="sm:col-span-3">
                <Select
                    label="Age"
                    options={ages}
                    initialValue={profile.age}
                    onChange={(opt) => handler("age", opt)}
                    name="age"
                />
            </div>

            <div className="sm:col-span-3">
                <Select
                    label="Country"
                    options={countryCodes}
                    initialValue={profile.countryOfResidence}
                    onChange={(opt) => handler("countryOfResidence", opt)}
                    name="country"
                />
            </div>

            <div className="sm:col-span-full">
                <TextInput
                    label="Email address"
                    id="email"
                    type="email"
                    placeholder="awesome@mail.com"
                    value={profile.email}
                    onChange={(e) => handler("email", e.target.value)}
                    disabled={!!profile.email}
                    required
                />
            </div>

            <div className="col-span-6">
                <TextInput
                    label="Phone Number"
                    id="phone-number"
                    placeholder="+1 (999) 999-9999"
                    value={profile.phone}
                    onChange={(e) => handler("phone", e.target.value)}
                    required
                />
            </div>

            <div className="col-span-3">
                <Select
                    label="School"
                    options={schools}
                    initialValue={profile.school}
                    onChange={(opt) => handler("school", opt)}
                />
            </div>
            <div className="col-span-3">
                <Select
                    label="Level of Study"
                    options={levelsOfStudy}
                    initialValue={profile.levelOfStudy}
                    onChange={(opt) => handler("levelOfStudy", opt)}
                />
            </div>

            <div className="sm:col-span-full">
                <TextInput
                    label="Discord username"
                    id="discord"
                    placeholder="@username or username#1234"
                    value={profile.discord}
                    onChange={(e) => handler("discord", e.target.value)}
                />
            </div>
        </>
    );
};
