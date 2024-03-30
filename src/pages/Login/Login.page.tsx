import { FormEventHandler, useState } from "react";
import { flushSync } from "react-dom";
import { z } from "zod";
import { Navigate, useSearchParams } from "react-router-dom";
import { Button, TextInput } from "@components";
import { useAuth } from "@providers";
import type { ProviderName } from "@providers";
import { routes } from "@utils";
import { GithubLogo, GoogleLogo } from "@assets";

const emailParser = z.string().email();

const authProviders: { name: ProviderName; logo: string }[] = [
    { name: "github", logo: GithubLogo },
    { name: "google", logo: GoogleLogo },
];

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [isInvalidEmail, setIsInvalidEmail] = useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = useState(false);
    const [passwordErrMsg, setPasswordErrMsg] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [isResetPassword, setIsResetPassword] = useState(false);

    const { login, createAccount, loginWithProvider, currentUser, sendPasswordReset } = useAuth();

    const toggleForm = () => {
        setIsResetPassword(false);
        setConfirmPass("");
        setPassword("");
        setIsLogin(!isLogin);
    };

    const toggleResetPassword = () => {
        setIsResetPassword(!isResetPassword);
    };

    const handleForgotPassword = async () => {
        if (email) {
            await sendPasswordReset(email);
            toggleResetPassword();
        } else {
            setIsInvalidEmail(true);
        }
    };

    const handlerSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        if (isResetPassword) {
            handleForgotPassword();
            return;
        }
        const emailResult = emailParser.safeParse(email);
        if (!emailResult.success) {
            setIsInvalidEmail(true);
            return;
        } else if (isInvalidEmail) {
            setIsInvalidEmail(false);
        }
        if (!isLogin) {
            if (password !== confirmPass) {
                setIsInvalidPassword(true);
                setPasswordErrMsg("The passwords do not match!");
                return;
            }
            if (password.length < 8 || confirmPass.length < 8) {
                setIsInvalidPassword(true);
                setPasswordErrMsg("Password must be longer than 8 characters!");
                return;
            }
        } else if (isInvalidPassword) {
            setIsInvalidPassword(false);
        }
        if (isLogin) await login(email, password);
        else {
            await createAccount(email, password);
            flushSync(() => {
                setIsLogin(true);
                setPassword("");
                setConfirmPass("");
            });
        }
    };

    if (currentUser !== null) {
        if (currentUser.hawkAdmin) {
            return <Navigate to={routes.admin} />;
        }
        const from = searchParams.get("from");
        return <Navigate to={from ?? routes.profile} />;
    }

    return (
        <div className="font-medium absolute inset-0 bg-gradient-to-r from-deepPurple/20 via-deepGold/20 via-50% to-stonePurple/20 flex justify-center items-center min-h-screen before:absolute before:inset-0 before:bg-[#EBCACC] before:-z-10">
            <div className="mx-auto max-w-2xl px-4 sm:px-6 md:px-8">
                <h1 className="text-3xl sm:text-5xl text-charcoalBlack font-body font-bold">
                    HawkHacks Hacker Portal
                </h1>
                <div className="h-6" />
                <div>
                    <h2 className="font-normal text-xl text-charcoalBlack">
                        {isResetPassword ? "Reset Password" : isLogin ? "Log In" : "Create Account"}
                    </h2>
                    <div className="w-full">
                        <form
                            onSubmit={handlerSubmit}
                            className="mt-6 space-y-6"
                            aria-label={isResetPassword ? "Reset password form" : "Authentication form"}
                        >
                            <TextInput
                                label="Email"
                                id="email"
                                type="email"
                                placeholder="awesome@hawkhack.ca"
                                className="bg-peachWhite"
                                value={email}
                                invalid={isInvalidEmail}
                                description={isInvalidEmail ? "Invalid email!" : ""}
                                onChange={({ target: { value } }) => setEmail(value)}
                                required
                            />
                            {!isResetPassword && (
                                <>
                                    <TextInput
                                        label="Password"
                                        id="password"
                                        type="password"
                                        placeholder="************"
                                        minLength={isLogin ? 0 : 8}
                                        value={password}
                                        invalid={!isLogin && isInvalidPassword}
                                        onChange={({ target: { value } }) => setPassword(value)}
                                        required
                                    />
                                    {!isLogin && (
                                        <TextInput
                                            label="Confirm Password:"
                                            id="confirmPassword"
                                            type="password"
                                            minLength={8}
                                            value={confirmPass}
                                            invalid={isInvalidPassword}
                                            description={passwordErrMsg}
                                            onChange={({ target: { value } }) => setConfirmPass(value)}
                                            required
                                        />
                                    )}
                                </>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-b from-tbrand to-tbrand-hover"
                            >
                                {isResetPassword ? "Send Reset Email" : isLogin ? "Log In" : "Create Account"}
                            </Button>
                        </form>
                        {!isResetPassword && (
                            <p className="mt-6 text-center text-charcoalBlack font-medium">
                                {isLogin ? (
                                    <>
                                        Don't have an account?{" "}
                                        <button
                                            onClick={toggleForm}
                                            className="text-charcoalBlack font-bold underline hover:text-tbrand-hover"
                                        >
                                            Create Account
                                        </button>
                                        <br />
                                        Forgot your password?{" "}
                                        <button
                                            onClick={toggleResetPassword}
                                            className="text-charcoalBlack font-bold underline hover:text-tbrand-hover"
                                        >
                                            Reset Password
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={toggleForm}
                                        className="text-charcoalBlack font-bold underline hover:text-tbrand-hover"
                                    >
                                        Log In
                                    </button>
                                )}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
