import { type FormEventHandler, useState } from "react";
import { z } from "zod";
import { Navigate } from "react-router-dom";
import { Button, ErrorAlert, TextInput, Select } from "@components";
import { type UserProfile, createUserProfile } from "@services/utils";
import { useAuth, useNotification } from "@providers";
import { routes } from "@utils";
import { levelsOfStudy, ages, schools, countryCodes } from "@data";

const formValidationSchema = z.object({
    id: z.string(),
    firstName: z
        .string()
        .min(1, "First name must contain at least 1 character(s)"),
    lastName: z
        .string()
        .min(1, "Last name must contain at least 1 character(s)"),
    email: z.string().email(),
    countryOfResidence: z.string().length(2),
    emailVerified: z.boolean(),
    phone: z
        .string()
        .regex(
            /^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/,
            "Invalid Phone Number"
        ),
    school: z.string().min(1),
    levelOfStudy: z.string().min(1),
    age: z.number().min(13, "Age must be 13+"),
    discord: z.string().min(1),
});

export const CompleteProfilePage = () => {
    const { currentUser, userProfile, refreshProfile } = useAuth();

    if (!currentUser) return null;

    if (userProfile) return <Navigate to={routes.profile} />;

    const [selectedCountry, setSelectedCountry] = useState("CA");
    const [formValues, setFormValues] = useState<UserProfile>({
        id: currentUser.uid,
        firstName: "",
        lastName: "",
        email: currentUser.email ?? "",
        countryOfResidence: selectedCountry,
        emailVerified: currentUser.emailVerified,
        phone: "",
        school: "",
        levelOfStudy: "",
        age: 13,
        discord: "",
    });
    const [formErrors, setFormErrors] = useState<string[]>([]);

    const { showNotification } = useNotification();

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        const results = await formValidationSchema.spa(formValues);

        if (results.success) {
            await createUserProfile(results.data);
            showNotification({
                title: "Profile Completed!",
                message: "You will be redirect to your portal now!",
            });
            await refreshProfile();
        } else {
            setFormErrors(results.error.issues.map((i) => i.message));
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <p className="text-xl font-semibold">
                    All fields are required.
                </p>
                {formErrors.length > 0 && <ErrorAlert errors={formErrors} />}
                <form onSubmit={handleSubmit}>
                    <div className="px-4 py-6 sm:p-8">
                        <div className="sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <TextInput
                                    label="First name"
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    autoComplete="given-name"
                                    placeholder="Steven"
                                    value={formValues.firstName}
                                    onChange={(e) =>
                                        setFormValues((c) => ({
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
                                    value={formValues.lastName}
                                    onChange={(e) =>
                                        setFormValues((c) => ({
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
                                        setFormValues((c) => ({
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
                                    value={formValues.email}
                                    onChange={(e) =>
                                        setFormValues((c) => ({
                                            ...c,
                                            email: e.target.value,
                                        }))
                                    }
                                    disabled={!!currentUser.email}
                                    required
                                />
                            </div>

                            <div className="col-span-6">
                                <TextInput
                                    label="Phone Number"
                                    id="phone-number"
                                    placeholder="+1 (999) 999-9999"
                                    name="phone"
                                    value={formValues.phone}
                                    type="tel"
                                    onChange={(e) =>
                                        setFormValues((c) => ({
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
                                    initialValue={
                                        schools.find(
                                            (val) =>
                                                val ===
                                                "Wilfrid Laurier University"
                                        )!
                                    }
                                    onChange={(school) =>
                                        setFormValues((c) => ({
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
                                    initialValue={levelsOfStudy[0]}
                                    onChange={(opt) =>
                                        setFormValues((c) => ({
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
                                        setFormValues((c) => ({
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
                                    label="Discord"
                                    id="discord"
                                    placeholder="@username or username#1234"
                                    onChange={(e) =>
                                        setFormValues((c) => ({
                                            ...c,
                                            discord: e.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {/* just a separator line */}
                    <div className="h-0.5 bg-gray-300 my-6"></div>
                    <div className="flex items-center justify-end px-4 py-4 sm:px-8">
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
