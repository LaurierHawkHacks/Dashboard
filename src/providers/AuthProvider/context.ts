import { createContext } from "react";
import type { AuthContextValue } from "./types";

export const AuthContext = createContext<AuthContextValue>({
	isLoading: true,
	currentUser: null,
	login: async () => {},
	logout: async () => {},
	createAccount: async () => {},
	resetPassword: async () => {},
	loginWithProvider: async () => {},
	reloadUser: async () => {},
});
