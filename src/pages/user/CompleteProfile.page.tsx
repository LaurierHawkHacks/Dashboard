import { FormEventHandler, useState } from "react";
import { Navigate } from "react-router-dom";
import { ErrorAlert, Button } from "@components";
import { createUserProfile } from "@/services/utils";
import { useAuth, useNotification } from "@/providers/hooks";
import { routes } from "@/navigation/constants";
import { Profile } from "@/components/forms/Profile";
import { profileFormValidation } from "@/components/forms/validations";
import { defaultProfile } from "@/components/forms/defaults";
import type { UserProfile } from "@/services/utils/types";

// TODO: refactor imports

export const CompleteProfilePage = () => {
    const { currentUser, userProfile, refreshProfile } = useAuth();

    if (!currentUser) return null;

    if (userProfile) return <Navigate to={routes.profile} />;

    const [errors, setErrors] = useState<string[]>([]);
    const { showNotification } = useNotification();
    const [controlledProfile, setControlledProfile] = useState<UserProfile>({
        ...defaultProfile,
        id: currentUser.uid,
        email: currentUser.email ?? "",
    });

    const handleChange = (name: keyof UserProfile, data: string | string[]) => {
        // @ts-ignore
        controlledProfile[name] = data;
        setControlledProfile({
            ...controlledProfile,
        });
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        if (!controlledProfile.id) return;
        const results = await profileFormValidation.spa(controlledProfile);

        if (results.success) {
            await createUserProfile(controlledProfile);
            showNotification({
                title: "Profile Completed!",
                message: "You will be redirect to your portal now!",
            });
            await refreshProfile();
        } else {
            setErrors(results.error.issues.map((i) => i.message));
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <p className="text-xl font-semibold">
                    All fields are required.
                </p>
                {errors.length > 0 && (
                    <div className="my-4">
                        <ErrorAlert errors={errors} />
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="sm:grid space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6">
                        <Profile
                            profile={controlledProfile}
                            handler={(name, data) =>
                                handleChange(name as keyof UserProfile, data)
                            }
                        />
                    </div>
                    {/* just a separator line */}
                    <div className="h-0.5 bg-gray-300 my-6"></div>
                    <div className="flex items-center justify-end">
                        <Button type="submit">Save</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
