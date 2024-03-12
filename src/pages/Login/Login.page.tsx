import { FormEventHandler, useState } from "react";
import { z } from "zod";
import { Navigate } from "react-router-dom";
import { Button, TextInput } from "@components";
import { useAuth } from "@providers";
import { routes } from "@utils";
import { GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogin } from "react-google-login";

// TODO: add providers, not just basic email/password

// email validation with zod, double guard just in case someone changes the input type in html
const emailParser = z.string().email();

export const LoginPage = () => {
    // input elements value fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    // controls to set invalid styles for input fields
    const [isInvalidEmail, setIsInvalidEmail] = useState(false);
    const [isInvalidPassword, setIsInvalidPassword] = useState(false);

    // custom password err msg, can also be done for email but it shouldn't really need any msgs.
    const [passwordErrMsg, setPasswordErrMsg] = useState("");

    // control auth flow and form state to show correct title, toggle button
    const [isLogin, setIsLogin] = useState(true);

    const { login, createAccount, currentUser } = useAuth();

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleGoogleLoginSuccess = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log("Google authentication successful:", response);
    };

    const handleGoogleLoginFailure = (error: Error) => {
        console.error("Google authentication failed:", error);
    };

    const handlerSubmit: FormEventHandler = (e) => {
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

        if (isLogin) login(email, password);
        else createAccount(email, password);
    };

    const toggleForm = () => {
        setConfirmPass("");
        setPassword("");
        setIsLogin(!isLogin);
    };

    // leverage access to current user to decide whether we need to proceed rendering page
    if (currentUser !== null) {
        if (currentUser.hawkAdmin) {
            return <Navigate to={routes.admin} />;
        }
        return <Navigate to={routes.profile} />;
    }

    return (
        <div className="font-medium mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-b from-tbrand to-tbrand-highlight">
                    HawkHacks Hacker Portal
                </h1>
                <div className="h-6" />
                <div>
                    <h2 className="font-bold text-3xl text-tbrand">
                        {isLogin ? "Log In" : "Create Account"}
                    </h2>
                    <form
                        onSubmit={handlerSubmit}
                        className="mt-6 space-y-6"
                        aria-label="Authentication form"
                    >
                        <TextInput
                            label="Email:"
                            id="email"
                            type="email"
                            placeholder="awesome@hawkhack.ca"
                            value={email}
                            invalid={isInvalidEmail}
                            description={isInvalidEmail ? "Invalid email!" : ""}
                            onChange={({ target: { value } }) =>
                                setEmail(value)
                            }
                            required
                        />
                        <TextInput
                            label="Password:"
                            id="password"
                            type="password"
                            minLength={isLogin ? 0 : 8}
                            value={password}
                            invalid={!isLogin && isInvalidPassword}
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
                                minLength={8}
                                value={confirmPass}
                                invalid={isInvalidPassword}
                                description={passwordErrMsg}
                                onChange={({ target: { value } }) =>
                                    setConfirmPass(value)
                                }
                                required
                            />
                        )}
                        <Button type="submit">
                            {isLogin ? "Log In" : "Create Account"}
                        </Button>
                        <GoogleLogin
                            clientId={googleClientId}
                            buttonText="Sign in with Google"
                            onSuccess={handleGoogleLoginSuccess}
                            onFailure={handleGoogleLoginFailure}
                            cookiePolicy={"single_host_origin"}
                        />
                    </form>
                    <p className="mt-6 text-[#32848C]">
                        Does not have an account yet?{" "}
                        <button
                            className="text-tbrand underline hover:text-tbrand-hover"
                            onClick={toggleForm}
                        >
                            {isLogin ? "Create Account" : "Log In"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};
