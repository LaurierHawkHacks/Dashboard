import { useState, useRef } from "react";
import { sendEmailVerification } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "@services";
import { useAuth } from "@providers";
import { Button } from "@components";
import { routes } from "@utils";

export const VerifyEmailPage = () => {
    // 60 seconds timeout before the user can send the next email verification
    const [resendSeconds, setResendSeconds] = useState(0);
    // -9999 random number to init the ref, this will hold the id for the time interval
    const resendEmailCountdownRef = useRef<number>(-9999);
    const { logout, reloadUser, currentUser } = useAuth();

    const startCountdown = () => {
        resendEmailCountdownRef.current = window.setInterval(() => {
            setResendSeconds((seconds) => {
                if (seconds > 0) {
                    return seconds - 1;
                } else {
                    window.clearInterval(resendEmailCountdownRef.current);
                    return 0;
                }
            });
        }, 1000);
    };

    if (currentUser && currentUser.emailVerified)
        return <Navigate to={routes.profile} />;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-10">
                <p className="text-2xl">
                    Please check your email inbox from us to verify your
                    account.
                </p>
                <p className="mt-4 text-xl text-gray-700">
                    Current Account Email:
                    <span className="ml-2">
                        {currentUser && currentUser.email
                            ? currentUser.email
                            : "N/A"}
                    </span>
                </p>
                <Button intent="secondary" className="mt-4" onClick={logout}>
                    Log Out
                </Button>
            </div>
            <div className="mt-12 sm:flex sm:justify-end gap-4">
                <div className="space-x-4">
                    <Button
                        intent="secondary"
                        onClick={() => {
                            if (resendSeconds <= 0 && auth.currentUser) {
                                sendEmailVerification(auth.currentUser);
                                setResendSeconds(60);
                                startCountdown();
                            }
                        }}
                        disabled={resendSeconds > 0}
                    >
                        {resendSeconds <= 0
                            ? "Resend Email Verification"
                            : `${resendSeconds}s Left Before Resend`}
                    </Button>
                    <Button onClick={reloadUser}>Check Email</Button>
                </div>
            </div>
        </div>
    );
};
