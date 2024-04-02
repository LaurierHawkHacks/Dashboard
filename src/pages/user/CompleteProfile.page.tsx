import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ProfileForm, ErrorAlert } from "@components";
import { type UserProfile, createUserProfile } from "@services/utils";
import { useAuth, useNotification } from "@providers";
import { routes } from "@utils";

export const CompleteProfilePage = () => {
    const { currentUser, userProfile, refreshProfile } = useAuth();
    const [errors, setErrors] = useState<string[]>([]);

    if (!currentUser) return null;

    if (userProfile) return <Navigate to={routes.profile} />;

    const { showNotification } = useNotification();

    const handleSubmit = async (profile: UserProfile) => {
        await createUserProfile(profile);
        showNotification({
            title: "Profile Completed!",
            message: "You will be redirect to your portal now!",
        });
        await refreshProfile();
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
                <ProfileForm
                    submitText="Save Profile"
                    onSubmit={handleSubmit}
                    onError={(err) => {
                        setErrors(err.issues.map((i) => i.message));
                    }}
                />
            </div>
        </div>
    );
};
