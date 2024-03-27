import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "@services";
import {
    User,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
    type AuthProvider as OAuthProvider,
} from "firebase/auth";
import { useNotification } from "./notification.provider";

export type UserWithRole = User & { hawkAdmin: boolean };

export type ProviderName = "github" | "google";

export type AuthContextValue = {
    currentUser: UserWithRole | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
    loginWithProvider: (name: ProviderName) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    login: async () => {},
    logout: async () => {},
    createAccount: async () => {},
    loginWithProvider: async () => {},
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

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);

    const { showNotification } = useNotification();

    const login = async (email: string, password: string) => {
        try {
            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            setCurrentUser(await validateUserRole(user));
        } catch (error) {
            showNotification({
                title: "Oh no! Login problems!?",
                message:
                    "Pleas try again later. If problem continues, contact us via insert_email_here",
            });
            console.error(error);
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
        } finally {
            setCurrentUser(null);
        }
    };

    const createAccount = async (email: string, password: string) => {
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            setCurrentUser(await validateUserRole(user));
        } catch (error) {
            showNotification({
                title: "Account not created",
                message:
                    "Pleas try again later. If problem continues, contact us via insert_email_here",
            });
            console.error(error);
        }
    };

    const loginWithProvider = async (name: ProviderName) => {
        try {
            const provider = getProvider(name);
            if (!provider) throw new Error("Invalid provider name");

            const results = await signInWithPopup(auth, provider);
            if (results) {
                // NOTE: just in case we want to use this for the future
                // results.token // github access token to access github api
                setCurrentUser(await validateUserRole(results.user));
            } else {
                console.warn("login with provider: results is null");
            }
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

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setCurrentUser(await validateUserRole(user));
            } else {
                logout();
            }
        });

        return unsub;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                login,
                logout,
                createAccount,
                loginWithProvider,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
