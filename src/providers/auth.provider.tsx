import { createContext, useState, useContext, useEffect } from "react";
import { flushSync } from "react-dom";
import {
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithRedirect,
    signInWithPopup,
    sendEmailVerification,
    sendPasswordResetEmail,
    getRedirectResult,
    GithubAuthProvider,
    GoogleAuthProvider,
    OAuthProvider,
} from "firebase/auth";
import { auth } from "@/services/firebase";
import { useNotification } from "@/providers/notification.provider";
import {
    getUserApplications,
    getUserProfile,
    verifyGitHubEmail,
} from "@/services/utils";
import { LoadingAnimation } from "@/components";

import type { User, AuthProvider as FirebaseAuthProvider } from "firebase/auth";
import type { UserProfile } from "@/services/utils/types";
import type { NotificationOptions } from "@/providers/types";
import type { ApplicationData } from "@/components/forms/types";

export interface UserWithRole extends User {
    hawkAdmin: boolean;
}

export type ProviderName = "github" | "google" | "apple";

export type AuthMethod = "none" | "credentials" | ProviderName;

export type AuthContextValue = {
    currentUser: UserWithRole | null;
    userProfile: UserProfile | null;
    userApp: ApplicationData | null | undefined;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    loginWithProvider: (name: ProviderName) => Promise<void>;
    reloadUser: () => Promise<void>;
    refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    userProfile: null,
    userApp: null,
    login: async () => {},
    logout: async () => {},
    createAccount: async () => {},
    resetPassword: async () => {},
    loginWithProvider: async () => {},
    reloadUser: async () => {},
    refreshProfile: async () => {},
});

/**
 * Validates given user for admin authorization.
 * Return object adds `hawkAdmin` boolean field.
 */
async function validateUserRole(user: User): Promise<UserWithRole> {
    const { claims } = await user.getIdTokenResult();
    return {
        ...user,
        hawkAdmin: Boolean(claims.admin),
    };
}

const githubProvider = new GithubAuthProvider();
// scope for user profile data and email
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

function getProvider(provider: ProviderName): FirebaseAuthProvider {
    switch (provider) {
        case "google":
            return new GoogleAuthProvider();
        case "github":
            return new GithubAuthProvider();
        case "apple":
            return new OAuthProvider("apple.com");
        default:
            throw new Error("Unsupported provider");
    }
}

function getNotificationByAuthErrCode(code: string): NotificationOptions {
    switch (code) {
        case "auth/email-already-in-use":
            return {
                title: "Email In Use",
                message:
                    "If you forgot your password, click on 'forgot password' to recover it!",
            };
        default:
            return {
                title: "Oops! Something went wrong",
                message: "Please try again later.",
            };
    }
}

function isMobile() {
    const regex =
        /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    // use undefined to know its at initial state (just mounted) and null if there is no application
    const [userApp, setUserApp] = useState<ApplicationData | null | undefined>(
        undefined
    );
    const [isLoading, setIsLoading] = useState(false);
    const { showNotification } = useNotification();

    const completeLoginProcess = async (user: User) => {
        // check if user has a profile in firestore
        const profile = await getUserProfile(user.uid);
        const userWithRole = await validateUserRole(user);
        const app = (await getUserApplications(user.uid))[0] ?? null;
        // make one ui update instead of two due to async function
        flushSync(() => {
            setCurrentUser(userWithRole);
            setUserProfile(profile);
            setUserApp(app);
        });
    };

    const refreshProfile = async () => {
        if (!currentUser) return;

        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
    };

    const login = async (email: string, password: string) => {
        try {
            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            await completeLoginProcess(user);
            /* eslint-disable-next-line */
        } catch (error: any) {
            showNotification(getNotificationByAuthErrCode(error.code));
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            showNotification({
                title: "Oh no! Can't log out!",
                message:
                    "Please try again after refreshing the page. If problem continues just don't leave, please T.T",
            });
        }
    };

    const createAccount = async (email: string, password: string) => {
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await sendEmailVerification(user);
            await completeLoginProcess(user);
            /* eslint-disable-next-line */
        } catch (error: any) {
            showNotification(getNotificationByAuthErrCode(error.code));
        }
    };

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            showNotification({
                title: "Password reset email sent",
                message: "Please check your inbox for reset instructions.",
            });
        } catch (error: unknown) {
            showNotification({
                title: "Oops! Something went wrong",
                message: "Password could not be reset.",
            });
            console.error(error);
        }
    };

    const loginWithProvider = async (name: ProviderName) => {
        try {
            const provider = getProvider(name);
            if (!provider) throw new Error("Invalid provider name");

            if (isMobile()) {
                // Use redirect sign-in for mobile devices
                await signInWithRedirect(auth, provider);
            } else {
                // Use popup sign-in for PCs
                // @ts-ignore _tokenResponse is being used as a work around for bug github signin but email shows unverified.
                const { user, providerId, _tokenResponse } =
                    await signInWithPopup(auth, provider);

                if (
                    providerId &&
                    /github/i.test(providerId) &&
                    !user.emailVerified
                ) {
                    setIsLoading(true);
                    const { oauthAccessToken } = _tokenResponse as {
                        oauthAccessToken: string;
                    };
                    const verified = await verifyGitHubEmail(
                        oauthAccessToken,
                        user.email as string
                    );

                    if (verified) {
                        // interval set to wait email metadata gets properly updated in our user metadata after manual verification
                        // takes about 1s
                        let interval = 0;
                        interval = window.setInterval(async () => {
                            if (!auth.currentUser) {
                                window.clearInterval(interval);
                                setIsLoading(false);
                            }
                            if (!auth.currentUser?.emailVerified) {
                                await reloadUser();
                            } else {
                                window.clearInterval(interval);
                                setIsLoading(false);
                            }
                        }, 1000);
                    } else {
                        showNotification({
                            title: "Error Verifying Email",
                            message:
                                "Please log out and log in again. If problem persists, please contact us via email: 'development@hawkhacks.ca'",
                        });
                    }
                }
            }
            /* eslint-disable-next-line */
        } catch (error: any) {
            console.error(error);
            if (
                error.code === "auth/account-exists-with-different-credential"
            ) {
                showNotification({
                    title: "Oops! Something went wrong.",
                    message:
                        "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
                });
            } else {
                showNotification({
                    title: "Oops! Something went wrong.",
                    message: "Please try again later.",
                });
                console.error(error);
            }
        }
    };

    const reloadUser = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload();
            if (auth.currentUser.emailVerified) {
                const userWithRole = await validateUserRole(auth.currentUser);
                setCurrentUser(userWithRole);
            } else {
                showNotification({
                    title: "Email Not Verified",
                    message:
                        "It seems that the email has not been verified yet. If you already did, please wait to resend the email.",
                });
            }
        }
    };

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(async (user) => {
            if (user) {
                await completeLoginProcess(user);
            } else {
                setCurrentUser(null);
                setUserProfile(null);
                setUserApp(null);
            }
        });

        // Handle redirect result
        const handleRedirectResult = async () => {
            const result = await getRedirectResult(auth);
            if (result) {
                await completeLoginProcess(result.user);
            }
        };

        if (isMobile()) {
            handleRedirectResult();
        }

        return unsub;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                userProfile,
                userApp,
                login,
                logout,
                createAccount,
                resetPassword,
                loginWithProvider,
                reloadUser,
                refreshProfile,
            }}
        >
            {isLoading ? <LoadingAnimation /> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
