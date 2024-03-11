import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "@services";
import {
    User,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    signInWithPopup,
} from "firebase/auth";

export type UserWithRole = User & { hawkAdmin: boolean };

type AuthContextValue = {
    currentUser: UserWithRole | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
    loginWithGithub: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    login: async () => {},
    logout: async () => {},
    createAccount: async () => {},
    loginWithGithub: async () => {},
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

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserWithRole | null>(null);

    const login = async (email: string, password: string) => {
        try {
            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            setCurrentUser(await validateUserRole(user));
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
            setCurrentUser(await validateUserRole(user));
        } catch (error) {
            // TODO: should use notification system to show an error message to user
            console.error(error);
        }
    };

    const loginWithGithub = async () => {
        // TODO: separate the calls into their own try/catch for granular error handling
        try {
            const results = await signInWithPopup(auth, githubProvider);
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
                loginWithGithub,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
