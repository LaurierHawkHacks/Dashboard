import { FC, FormEventHandler, useState } from "react";
import { ZodError, z } from "zod";
import { TextInput, Select, Button } from "@components";
import type { UserProfile } from "@services/utils";
import { useAuth } from "@providers";
import { levelsOfStudy, ages, schools, countryCodes } from "@data";

const defaultProfile: UserProfile = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    emailVerified: false,
    phone: "",
    school: "Wilfrid Laurier University",
    levelOfStudy: "Undergraduate University (3+ years)",
    age: 13,
    discord: "",
    countryOfResidence: "CA",
};

const formValidationSchema = z.object({
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

export interface ProfileFormProps {
    onSubmit: (profile: UserProfile) => void;
    onError?: (error: ZodError<UserProfile>) => void;
    submitText?: string;
}

export const ProfileForm: FC<ProfileFormProps> = ({
    onSubmit,
    onError,
    submitText = "Submit",
}) => {
    const [selectedCountry, setSelectedCountry] = useState("CA");
    const { userProfile } = useAuth();
    const [profile, setProfile] = useState<UserProfile>(
        userProfile ? { ...defaultProfile, ...userProfile } : defaultProfile
    );

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        if (!profile.id) return;
        const results = await formValidationSchema.spa(profile);
        if (results.success) {
            onSubmit(profile);
        } else {
            if (onError) onError(results.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <TextInput
                        label="First name"
                        type="text"
                        name="firstName"
                        id="firstName"
                        autoComplete="given-name"
                        placeholder="Steven"
                        value={profile.firstName}
                        onChange={(e) =>
                            setProfile((c) => ({
                                ...c,
                                firstName: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                <div className="sm:col-span-3">
                    <TextInput
                        label="Last name"
                        type="text"
                        name="lastName"
                        id="lastName"
                        autoComplete="family-name"
                        placeholder="Wu"
                        value={profile.lastName}
                        onChange={(e) =>
                            setProfile((c) => ({
                                ...c,
                                lastName: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                <div className="sm:col-span-2">
                    <Select
                        label="Age"
                        options={ages}
                        initialValue="18"
                        onChange={(opt) => {
                            if (opt === "50+") opt = "50";
                            setProfile((c) => ({
                                ...c,
                                age: parseInt(opt),
                            }));
                        }}
                    />
                </div>

                <div className="sm:col-span-4">
                    <TextInput
                        label="Email address"
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) =>
                            setProfile((c) => ({
                                ...c,
                                email: e.target.value,
                            }))
                        }
                        disabled={!!userProfile?.email}
                        required
                    />
                </div>

                <div className="col-span-6">
                    <TextInput
                        label="Phone Number"
                        id="phone-number"
                        placeholder="+1 (999) 999-9999"
                        name="phone"
                        value={profile.phone}
                        type="tel"
                        onChange={(e) =>
                            setProfile((c) => ({
                                ...c,
                                phone: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                <div className="col-span-3">
                    <Select
                        label="School"
                        options={schools}
                        initialValue={profile.school}
                        onChange={(school) =>
                            setProfile((c) => ({
                                ...c,
                                school: school,
                            }))
                        }
                    />
                </div>
                <div className="col-span-3">
                    <Select
                        label="Level of Study"
                        options={levelsOfStudy}
                        initialValue={profile.levelOfStudy}
                        onChange={(opt) =>
                            setProfile((c) => ({
                                ...c,
                                levelOfStudy: opt,
                            }))
                        }
                    />
                </div>

                <div className="sm:col-span-4">
                    <Select
                        label="Country"
                        options={countryCodes}
                        onChange={(opt) => {
                            setProfile((c) => ({
                                ...c,
                                countryOfResidence: opt,
                            }));
                            setSelectedCountry(opt);
                        }}
                        initialValue={selectedCountry}
                    />
                </div>

                <div className="sm:col-span-full">
                    <TextInput
                        label="Discord username"
                        id="discord"
                        placeholder="@username or username#1234"
                        value={profile.discord}
                        onChange={(e) =>
                            setProfile((c) => ({
                                ...c,
                                discord: e.target.value,
                            }))
                        }
                    />
                </div>
            </div>
            {/* just a separator line */}
            <div className="h-0.5 bg-gray-300 my-6"></div>
            <div className="flex items-center justify-end px-4 py-4 sm:px-8">
                <Button type="submit">{submitText}</Button>
            </div>
        </form>
    );
};
