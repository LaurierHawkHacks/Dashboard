import { FormEventHandler, useState } from "react";
import { flushSync } from "react-dom";
import { z } from "zod";
import { Navigate, useSearchParams } from "react-router-dom";
import { Button, TextInput } from "@components";
import { useAuth } from "@/providers/hooks";
import type { ProviderName } from "@/providers/types";
import { GithubLogo, GoogleLogo, AppleLogo } from "@assets";
import { useAvailableRoutes } from "@/providers/routes.provider";

// email validation with zod, double guard just in case someone changes the input type in html
const emailParser = z.string().email();

const authProviders: { name: ProviderName; logo: string }[] = [
    { name: "github", logo: GithubLogo },
    { name: "google", logo: GoogleLogo },
    { name: "apple", logo: AppleLogo },
];

export const LoginPage = () => {
    // input elements value fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    // controls to set invalid styles for input fields
    const [isInvalidEmail, setIsInvalidEmail] = useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = useState(false);

    // control for password reset form
    const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);

    // custom password err msg, can also be done for email but it shouldn't really need any msgs.
    const [passwordErrMsg, setPasswordErrMsg] = useState("");

    // control auth flow and form state to show correct title, toggle button
    const [isLogin, setIsLogin] = useState(true);

    const {
        login,
        createAccount,
        resetPassword,
        loginWithProvider,
        currentUser,
    } = useAuth();

    const { paths: routes, userRoutes } = useAvailableRoutes();

    const [searchParams] = useSearchParams();

    const handlerSubmit: FormEventHandler = async (e) => {
        // prevent page refresh when form is submitted
        e.preventDefault();

        const emailResult = emailParser.safeParse(email);

        // email input validation
        if (!emailResult.success) {
            setIsInvalidEmail(true);
            return;
        } else if (isInvalidEmail) {
            // upon revalidation, if success, reset to normal styles
            setIsInvalidEmail(false);
        }

        // only check for matching password when creating a new account
        if (!isLogin) {
            // perform password input validation
            if (password !== confirmPass) {
                setIsInvalidPassword(true);
                setPasswordErrMsg("The passwords do not match!");
                return;
            }

            // double safe guard if someone disables the min length attribute in html
            const minPassLength = 8;
            if (
                password.length < minPassLength ||
                confirmPass.length < minPassLength
            ) {
                setIsInvalidPassword(true);
                setPasswordErrMsg("Password must be longer than 8 characters!");
                return;
            }
        } else if (isInvalidPassword) {
            // if is not a new account, but we have set invalid styles then reset to normal styles
            setIsInvalidPassword(false);
        }

        if (isLogin) {
            if (showResetPasswordForm) {
                await resetPassword(email);
                setShowResetPasswordForm(false);
                return;
            }
            await login(email, password);
        } else {
            await createAccount(email, password);
            flushSync(() => {
                setIsLogin(true);
                setPassword("");
                setConfirmPass("");
            });
        }
    };

    const toggleForm = () => {
        setConfirmPass("");
        setPassword("");
        setIsLogin(!isLogin);
    };

    const toggleResetPassword = () => {
        setShowResetPasswordForm(!showResetPasswordForm);
        setIsLogin(true);
        setPassword("");
        setConfirmPass("");
    };

    const handleReset: FormEventHandler = (e) => {
        e.preventDefault();
        resetPassword(email);
        toggleResetPassword();
    };

    // leverage access to current user to decide whether we need to proceed rendering page
    if (currentUser !== null) {
        if (currentUser.hawkAdmin) {
            return <Navigate to={routes.admin} />;
        }
        const from = searchParams.get("from");
        const available = userRoutes.some((r) => {
            // join team is globally available
            if (r.path && r.path.startsWith("/join-team")) return true;
            return r.path === from;
        });
        return (
            <Navigate
                to={from && from !== "/" && available ? from : routes.portal}
            />
        );
    }

    return (
        <div className="bg-dustStorm font-medium">
            <div className="py-4 flex justify-center items-center bg-gradient-to-r from-deepPurple/20 via-deepGold/20 via-50% to-stonePurple/20 min-h-screen">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 md:px-8">
                    <div>
                        <h1 className="text-center sm:text-left text-2xl sm:text-4xl text-charcoalBlack font-body font-bold">
                            {showResetPasswordForm
                                ? "Reset Password"
                                : isLogin
                                ? "Log into your account"
                                : "Create your account"}
                        </h1>
                        {!showResetPasswordForm ? (
                            <p className="text-charcoalBlack mt-2">
                                Join hundreds of students across Canada in a 36
                                hour period of exploration, creativity, and
                                learning!
                            </p>
                        ) : null}
                    </div>
                    <div className="h-8" />
                    <div>
                        {!showResetPasswordForm && (
                            <>
                                <div className="w-full">
                                    <form
                                        onSubmit={handlerSubmit}
                                        className="mt-6 space-y-6"
                                        aria-label="Authentication form"
                                    >
                                        <TextInput
                                            label="Email"
                                            id="email"
                                            type="email"
                                            placeholder="awesome@hawkhack.ca"
                                            className="py-4 px-5 rounded-lg"
                                            value={email}
                                            invalid={isInvalidEmail}
                                            description={
                                                isInvalidEmail
                                                    ? "Invalid email!"
                                                    : ""
                                            }
                                            onChange={({ target: { value } }) =>
                                                setEmail(value)
                                            }
                                            required
                                        />
                                        <TextInput
                                            label="Password"
                                            id="password"
                                            type="password"
                                            placeholder="your very awesome and secure password"
                                            className="py-4 px-5 rounded-lg"
                                            minLength={isLogin ? 0 : 8}
                                            value={password}
                                            invalid={
                                                !isLogin && isInvalidPassword
                                            }
                                            onChange={({ target: { value } }) =>
                                                setPassword(value)
                                            }
                                            required
                                        />
                                        {!isLogin && (
                                            <TextInput
                                                label="Confirm Password:"
                                                id="confirmPassword"
                                                type="password"
                                                className="py-4 px-5 rounded-lg"
                                                minLength={8}
                                                value={confirmPass}
                                                invalid={isInvalidPassword}
                                                description={passwordErrMsg}
                                                onChange={({
                                                    target: { value },
                                                }) => setConfirmPass(value)}
                                                required
                                            />
                                        )}
                                        {isLogin && (
                                            <div className="flex justify-end">
                                                <button
                                                    className="text-charcoalBlack font-bold underline hover:text-tbrand-hover"
                                                    type="button"
                                                    onClick={
                                                        toggleResetPassword
                                                    }
                                                >
                                                    Forgot Password
                                                </button>
                                            </div>
                                        )}
                                        {/* just a separator line */}
                                        <div className="bg-transparent"></div>
                                        <Button
                                            type="submit"
                                            className="rounded-lg w-full bg-gradient-to-b from-tbrand to-tbrand-hover"
                                        >
                                            {isLogin ? "Log In" : "Sign Up"}
                                        </Button>
                                    </form>
                                    <p className="mt-6 text-center text-charcoalBlack font-medium">
                                        <span>
                                            {isLogin
                                                ? "Don't have an account? "
                                                : "Already have an account? "}
                                        </span>
                                        <button
                                            className="text-charcoalBlack font-bold underline hover:text-tbrand-hover"
                                            onClick={toggleForm}
                                        >
                                            {isLogin ? "Sign Up" : "Log In"}
                                        </button>
                                    </p>
                                </div>
                                {/* just a separator line */}
                                <div className="h-0.5 bg-transparent my-6"></div>
                                <div>
                                    <div className="w-full space-y-4">
                                        {authProviders.map((provider) => (
                                            <Button
                                                key={provider.name}
                                                onClick={() =>
                                                    loginWithProvider(
                                                        provider.name
                                                    )
                                                }
                                                className="rounded-lg w-full bg-white capitalize text-gray-900 flex justify-center items-center gap-4 hover:bg-gray-100 active:bg-gray-200"
                                            >
                                                <img
                                                    src={provider.logo}
                                                    aria-hidden="true"
                                                    className="w-8 h-8"
                                                />
                                                {`continue with ${provider.name}`}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        {showResetPasswordForm && (
                            <div className="w-full">
                                <form onSubmit={handleReset}>
                                    <TextInput
                                        label="Email"
                                        id="resetEmail"
                                        type="email"
                                        placeholder="awesome@hawkhack.ca"
                                        className="py-4 px-5 rounded-lg"
                                        value={email}
                                        invalid={isInvalidEmail}
                                        description={
                                            isInvalidEmail
                                                ? "Invalid email!"
                                                : ""
                                        }
                                        onChange={({ target: { value } }) =>
                                            setEmail(value)
                                        }
                                        required
                                    />
                                    <Button
                                        type="submit"
                                        className="rounded-lg w-full bg-gradient-to-b from-tbrand to-tbrand-hover mt-2 my-8"
                                    >
                                        Reset Password
                                    </Button>
                                </form>
                                <button
                                    className="text-charcoalBlack font-bold underline hover:text-tbrand-hover"
                                    type="button"
                                    onClick={toggleResetPassword}
                                >
                                    Go Back
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
