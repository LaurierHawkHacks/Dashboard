import { createContext, useState, useContext, useEffect } from "react";
import { auth } from "@services";
import {
    User,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { GoogleLogin, GoogleLogout, GoogleLoginResponse } from "react-google-login";

export type UserWithRole = User & { hawkAdmin: boolean };

interface GoogleLoginResponseWithCredential extends GoogleLoginResponse {
  credential: string;
}

type GoogleLoginResponseUnion = GoogleLoginResponse | GoogleLoginResponseWithCredential;

type AuthContextValue = {
    currentUser: UserWithRole | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    createAccount: (email: string, password: string) => Promise<void>;
    loginWithGoogle: (response: GoogleLoginResponseUnion) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    login: async () => {},
    logout: async () => {},
    createAccount: async () => {},
    loginWithGoogle: async () => {},
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

    const loginWithGoogle = async (response: GoogleLoginResponseUnion) => {
        if ("credential" in response) {
            const credential = GoogleAuthProvider.credential(response.credential);
            try {
                const { user } = await signInWithPopup(auth, credential);
                setCurrentUser(await validateUserRole(user));
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("Google login response is missing credential");
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
                loginWithGoogle
            }}
        >
            {children}
            <GoogleLogin
                clientId="587778980690-d0vll2ts3ubnofb21kre5r3qb6959hfo.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={(response) => loginWithGoogle(response as GoogleLoginResponseUnion)}
                cookiePolicy={"single_host_origin"}
            />
            <GoogleLogout
                clientId="587778980690-d0vll2ts3ubnofb21kre5r3qb6959hfo.apps.googleusercontent.com"
                buttonText="Sign out"
                onLogoutSuccess={logout}
            />
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
