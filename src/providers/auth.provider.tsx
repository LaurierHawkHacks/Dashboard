import { createContext, useState, useContext, useEffect } from "react";
import { flushSync } from "react-dom";
import {
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    sendEmailVerification,
    sendPasswordResetEmail,
    GithubAuthProvider,
    GoogleAuthProvider,
} from "firebase/auth";
import type { User, AuthProvider as OAuthProvider } from "firebase/auth";
import { auth } from "@services";
import {
    useNotification,
    type NotificationOptions,
} from "./notification.provider";
import { type UserProfile, getUserProfile } from "@services/utils";

export interface UserWithRole extends User {
    hawkAdmin: boolean;
}

export type ProviderName = "github" | "google";

export type AuthMethod = "none" | "credentials" | ProviderName;

export type AuthContextValue = {
    currentUser: UserWithRole | null;
    userProfile: UserProfile | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
    loginWithProvider: (name: ProviderName) => Promise<void>;
    reloadUser: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    userProfile: null,
    login: async () => {},
    logout: async () => {},
    createAccount: async () => {},
    loginWithProvider: async () => {},
    reloadUser: async () => {},
    refreshProfile: async () => {},
    sendPasswordReset: async () => {},
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

function getProvider(provider: ProviderName): OAuthProvider | undefined {
    if (provider === "google") return googleProvider;
    if (provider === "github") return githubProvider;
}

function getNotificationByAuthErrCode(code: string): NotificationOptions {
    if (code === "auth/email-already-in-use") {
        return {
            title: "Email In Use",
            message:
                "If you forgot your password, click on 'forgot password' to recover it!",
        };
    }

    // default notification message
    return {
        title: "Oops! Something went wrong",
        message: "Please try again later.",
    };
}

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { showNotification } = useNotification();

    const completeLoginProcess = async (user: User) => {
        // check if user has a profile in firestore
        const profile = await getUserProfile(user.uid);
        const userWithRole = await validateUserRole(user);
        // make one ui update instead of two due to async function
        flushSync(() => {
            setCurrentUser(userWithRole);
            setUserProfile(profile);
        });
    };

    const sendPasswordReset = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            showNotification({
                title: "Reset Email Sent",
                message: "Check your email to reset your password.",
            });
        } catch (error: any) {
            showNotification({
                title: "Error Sending Reset Email",
                message: error.message || "Could not send reset email. Try again later.",
            });
        }
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
            // TODO: should use notification system to show an error message to user
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
                    "Pleas try again after refreshing the page. If problem continues just don't leave, pleas T.T",
            });
            console.error(error);
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
            /* eslint-disable-next-line */
        } catch (error: any) {
            showNotification(getNotificationByAuthErrCode(error.code));
        }
    };

    const loginWithProvider = async (name: ProviderName) => {
        try {
            const provider = getProvider(name);
            if (!provider) throw new Error("Invalid provider name");

            const { user } = await signInWithPopup(auth, provider);
            await completeLoginProcess(user);
            /* eslint-disable-next-line */
        } catch (error: any) {
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
            }
        });

        return unsub;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                userProfile,
                login,
                logout,
                createAccount,
                loginWithProvider,
                reloadUser,
                refreshProfile,
                sendPasswordReset,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
