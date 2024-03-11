import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "@services";
import {
    User,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    OAuthProvider,
    signInWithPopup,
} from "firebase/auth";

export type UserWithRole = User & { hawkAdmin: boolean };

type AuthContextValue = {
    currentUser: UserWithRole | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
    loginWithGithub: () => Promise<void>;
    loginWithApple: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    login: async () => {},
    logout: async () => {},
    createAccount: async () => {},
    loginWithGithub: async () => {},
    loginWithApple: async () => {},
});

async function validateUserRole(user: User): Promise<UserWithRole> {
    const { claims } = await user.getIdTokenResult();
    return {
        ...user,
        hawkAdmin: Boolean(claims.admin),
    };
}

const githubProvider = new GithubAuthProvider();
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
            console.error(error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
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
            console.error(error);
        }
    };

    const loginWithGithub = async () => {
        try {
            const results = await signInWithPopup(auth, githubProvider);
            if (results) {
                setCurrentUser(await validateUserRole(results.user));
            } else {
                console.warn("login with github: results is null");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const loginWithApple = async () => {
        try {
            const appleProvider = new OAuthProvider("apple.com");
            const result = await signInWithPopup(auth, appleProvider);
            setCurrentUser(await validateUserRole(result.user));
        } catch (error) {
            console.error("Error logging in with Apple:", error);
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
                loginWithApple,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};