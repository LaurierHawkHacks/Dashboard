import { createContext, useState, useContext, useEffect } from "react";
import { User, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@services";

type AuthContextValue = {
    currentUser: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
    currentUser: null,
    login: async () => {},
    logout: async () => {},
});

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const nav = useNavigate();

    const login = async (email: string, password: string) => {
        const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        setCurrentUser(user);
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
        } finally {
            setCurrentUser(null);
            nav("/admin/login", { replace: true });
        }
    };

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                logout();
            }
        });

        return unsub;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
