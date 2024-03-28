import { type FormEventHandler, useState } from "react";
import { z } from "zod";
import { Navigate } from "react-router-dom";
import { Button, ErrorAlert, TextInput, Select } from "@components";
import { type UserProfile, createUserProfile } from "@services/utils";
import { useAuth, useNotification } from "@providers";
import { routes } from "@utils";
import { Option } from "../../components/Select/Select";

const countries: Option[] = [
    {
        label: "US",
        value: "us",
    },
    {
        label: "CA",
        value: "ca",
    },
];

const formValidationSchema = z.object({
    id: z.string(),
    firstName: z
        .string()
        .min(1, "First name must contain at least 1 character(s)"),
    lastName: z
        .string()
        .min(1, "Last name must contain at least 1 character(s)"),
    email: z.string().email(),
    countryOfResidence: z.string().min(2),
    emailVerified: z.boolean(),
    phone: z.string(),
    school: z.string(),
    levelOfStudy: z.string(),
});

export const CompleteProfilePage = () => {
    const { currentUser, userProfile, refreshProfile } = useAuth();

    if (!currentUser) return null;

    if (userProfile) return <Navigate to={routes.profile} />;

    const [selectedCountry, setSelectedCountry] = useState(countries[1]);
    const [formValues, setFormValues] = useState<UserProfile>({
        id: currentUser.uid,
        firstName: "",
        lastName: "",
        email: currentUser.email ?? "",
        countryOfResidence: selectedCountry.value,
        emailVerified: currentUser.emailVerified,
        phone: "",
        school: "",
        levelOfStudy: "",
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
                <h1 className="text-4xl font-semibold leading-7 text-transparent bg-clip-text bg-gradient-to-b from-tbrand to-tbrand-highlight mt-10">
                    Complete Your Profile
                </h1>
                {formErrors.length > 0 && <ErrorAlert errors={formErrors} />}
                <form onSubmit={handleSubmit}>
                    <div className="px-4 py-6 sm:p-8">
                        <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <TextInput
                                    label="First name"
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    autoComplete="given-name"
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

                            {!currentUser.email && (
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
                                        required
                                    />
                                </div>
                            )}

                            <div className="sm:col-span-4">
                                <div className="mt-2">
                                    <Select
                                        label="Country"
                                        options={countries}
                                        onChange={(opt) => {
                                            setFormValues((c) => ({
                                                ...c,
                                                countryOfResidence: opt.value,
                                            }));
                                            setSelectedCountry(opt);
                                        }}
                                        value={selectedCountry}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* just a separator line */}
                    <div className="h-0.5 bg-tbrand my-6"></div>
                    <div className="flex items-center justify-end px-4 py-4 sm:px-8">
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
