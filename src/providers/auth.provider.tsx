import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "@services";
import {
    User,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";

export type UserWithRole = User & { hawkAdmin: boolean };

type AuthContextValue = {
    currentUser: UserWithRole | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    login: async () => {},
    logout: async () => {},
    createAccount: async () => {},
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
