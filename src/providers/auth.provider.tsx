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
    sendEmailVerification,
    type AuthProvider as OAuthProvider,
} from "firebase/auth";

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

    const login = async (email: string, password: string) => {
        try {
            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            if (user.emailVerified) {
                setCurrentUser(await validateUserRole(user));
            } else {
            // Email is not verified, handle accordingly (e.g., show a notification or redirect to a verification page)
                console.log("Email not verified");
            }
        } catch (error) {
        // TODO: should use notification system to show an error message to user
            console.error(error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            // TODO: should use notification system to show an error message to user
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
            await sendEmailVerification(user);
            console.log("Verification email has been sent");
            // Email is not verified yet, handle accordingly (e.g., show a notification or redirect to a verification page)
            console.log("Email not verified");
        } catch (error) {
        // TODO: should use notification system to show an error message to user
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
                // TODO: handle situation that results returned as null
                console.warn("login with github: results is null");
            }
        } catch (error) {
            // TODO: should use notification system to show an error message to user
            console.error(error);
        }
    };

    useEffect(() => {
        const unsub = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userWithRole = await validateUserRole(user);
                if (userWithRole.emailVerified) {
                    setCurrentUser(userWithRole);
                } else {
                    console.log("Email not verified");
                }
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
