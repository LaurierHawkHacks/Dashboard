import { createContext, useState, useContext } from "react";
import { app } from "@services/firebase";
import { Auth, User, getAuth, signOut } from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const auth = getAuth(app);

    const login = (user: User) => {
        setCurrentUser(user);
    };

    const logout = async (authObject: Auth = auth) => {
        try {
            await signOut(authObject);
        } catch (error) {
            console.error(error);
        }

        setCurrentUser(null);
    };

    auth.onAuthStateChanged((currentUser) => {
        if (!currentUser) {
            logout(auth);
        } else {
            login(currentUser);
        }
    });

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
