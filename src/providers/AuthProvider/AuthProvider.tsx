import { toaster } from "@/components/ui/toaster";
import { auth } from "@/services/firebase";
import { verifyGitHubEmail } from "@/services/firebase/user";
import {
	type User,
	createUserWithEmailAndPassword,
	getRedirectResult,
	sendEmailVerification,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signInWithPopup,
	signInWithRedirect,
	signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { FirebaseError } from "firebase/app";
import { AuthContext } from "./context";
import type { ProviderName, UserWithClaims } from "./types";
import {
	getNotificationByAuthErrCode,
	getProvider,
	isMobile,
	validateUser,
} from "./utils";

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<UserWithClaims | null>(null);
	const [isLoadingInitialAuthState, setIsLoadingInitialAuthState] =
		useState(true);
	const [isLoadingSignUp, setIsLoadingSignUp] = useState(false);

	const completeLoginProcess = async (user: User) => {
		// check if user has a profile in firestore
		const userWithRole = await validateUser(user);
		// make one ui update instead of two due to async function
		flushSync(() => {
			setCurrentUser(userWithRole);
		});
	};

	const login = async (email: string, password: string) => {
		try {
			const { user } = await signInWithEmailAndPassword(auth, email, password);
			await completeLoginProcess(user);
		} catch (error) {
			if (error instanceof FirebaseError) {
				toaster.error(getNotificationByAuthErrCode(error.code));
			}
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			toaster.error({
				title: "Oh no! Can't log out!",
				description:
					"Please try again after refreshing the page. If problem continues just don't leave, please T.T",
			});
		}
	};

	const createAccount = async (email: string, password: string) => {
		try {
			const { user } = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			await sendEmailVerification(user);
			await completeLoginProcess(user);
		} catch (error) {
			if (error instanceof FirebaseError) {
				toaster.error(getNotificationByAuthErrCode(error.code));
			}
		}
	};

	const resetPassword = async (email: string) => {
		try {
			await sendPasswordResetEmail(auth, email);
			toaster.success({
				title: "Password reset email sent",
				description: "Please check your inbox for reset instructions.",
			});
		} catch (error: unknown) {
			toaster.error({
				title: "Oops! Something went wrong",
				description: "Password could not be reset.",
			});
			console.error(error);
		}
	};

	const loginWithProvider = async (name: ProviderName) => {
		try {
			const provider = getProvider(name);
			if (!provider) throw new Error("Invalid provider name");

			if (isMobile()) {
				// Use redirect sign-in for mobile devices
				await signInWithRedirect(auth, provider);
			} else {
				// Use popup sign-in for PCs
				// @ts-ignore _tokenResponse is being used as a work around for bug github signin but email shows unverified.
				const { user, providerId, _tokenResponse } = await signInWithPopup(
					auth,
					provider,
				);

				if (providerId && /github/i.test(providerId) && !user.emailVerified) {
					setIsLoadingSignUp(true);
					const { oauthAccessToken } = _tokenResponse as {
						oauthAccessToken: string;
					};
					const verified = await verifyGitHubEmail(
						oauthAccessToken,
						user.email as string,
					);

					if (verified) {
						// interval set to wait email metadata gets properly updated in our user metadata after manual verification
						// takes about 1s
						let interval = 0;
						interval = window.setInterval(async () => {
							if (!auth.currentUser) {
								window.clearInterval(interval);
								setIsLoadingSignUp(false);
							}
							if (!auth.currentUser?.emailVerified) {
								await reloadUser();
							} else {
								window.clearInterval(interval);
								setIsLoadingSignUp(false);
							}
						}, 1000);
					} else {
						setIsLoadingSignUp(false);
						toaster.error({
							title: "Error Verifying Email",
							description:
								"Please log out and log in again. If problem persists, please contact us in our Discord support channel.",
						});
					}
				}
			}
		} catch (error) {
			console.error(error);
			if (
				error instanceof FirebaseError &&
				error.code === "auth/account-exists-with-different-credential"
			) {
				toaster.error({
					title: "Oops! Something went wrong.",
					description:
						"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
				});
			} else {
				toaster.error({
					title: "Oops! Something went wrong.",
					description: "Please try again later.",
				});
				console.error(error);
			}
		}
	};

	const reloadUser = async () => {
		if (auth.currentUser) {
			await auth.currentUser.reload();
			const userWithRole = await validateUser(auth.currentUser);
			setCurrentUser(userWithRole);
		}
	};

	useEffect(() => {
		const unsub = auth.onAuthStateChanged(async (user) => {
			if (user) {
				await completeLoginProcess(user);
			} else {
				setCurrentUser(null);
			}
			setIsLoadingInitialAuthState(false);
		});

		// Handle redirect result
		const handleRedirectResult = async () => {
			const result = await getRedirectResult(auth);
			if (result) {
				await completeLoginProcess(result.user);
			}
		};

		if (isMobile()) {
			handleRedirectResult();
		}

		return unsub;
	}, []);

	return (
		<AuthContext.Provider
			value={{
				isLoading: isLoadingInitialAuthState || isLoadingSignUp,
				currentUser,
				login,
				logout,
				createAccount,
				resetPassword,
				loginWithProvider,
				reloadUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
