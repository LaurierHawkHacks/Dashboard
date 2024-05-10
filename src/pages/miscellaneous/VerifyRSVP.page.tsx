import { Button, LoadingAnimation } from "@/components";
import { useAuth } from "@/providers/auth.provider";
import { verifyRSVP } from "@/services/utils";
import { useNotification } from "@/providers/notification.provider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { rsvpText } from "@/data";

export const VerifyRSVP = () => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [agreedToParticipate, setAgreedToParticipate] = useState(false);
    const [willAttend, setWillAttend] = useState(false);
    const [rsvpLimitReached, setRsvpLimitReached] = useState(false);
    const { showNotification } = useNotification();
    const { currentUser, reloadUser } = useAuth();
    const navigate = useNavigate();

    const verify = async () => {
        setIsVerifying(true);
        const { status, verified, message } = await verifyRSVP();
        if (status === 200 && verified) {
            await reloadUser();
            setIsVerifying(false);
        } else {
            setIsVerifying(false);
            if (status === 400 && message === "RSVP limit reached.") {
                setRsvpLimitReached(true);
            } else {
                showNotification({
                    title: "Error Verifying RSVP",
                    message:
                        "Please reach out to us in our tech support channel on Discord.",
                });
            }
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.rsvpVerified) navigate("/");
    }, [currentUser, navigate]);

    return (
        <>
            {isVerifying ? (
                <LoadingAnimation text="Loading . . ." />
            ) : (
                <div className="pt-12 flex justify-center items-center flex-col gap-6">
                    {rsvpLimitReached ? (
                        <div className="text-center">
                            <p className="text-lg font-bold text-red-500">
                                RSVP Limit Reached
                            </p>
                            <p className="text-gray-700 mt-2">
                                {
                                    "We're sorry, but the RSVP limit has been reached. If you have any questions or concerns, please reach out to us in our tech support channel on Discord."
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-lg font-bold">
                                Please verify your RSVP to get access to the
                                rest of the dashboard!
                            </p>
                            <div className="flex flex-col items-start max-w-3xl">
                                <div>
                                    <label className="inline-flex items-center gap-3 mt-3">
                                        <input
                                            type="checkbox"
                                            checked={agreedToParticipate}
                                            onChange={(e) =>
                                                setAgreedToParticipate(
                                                    e.target.checked
                                                )
                                            }
                                            className="form-checkbox h-5 w-5 text-gray-600"
                                        />
                                        <span className="ml-2 text-gray-700 cursor-pointer">
                                            I have read the content below and
                                            agree to participate in the event
                                            using my free will and good
                                            judgment.
                                        </span>
                                    </label>

                                    <div className="border border-blueGreen p-2 my-8 flex flex-col gap-2 text-gray-500 max-w-3xl max-h-72 overflow-y-scroll">
                                        {rsvpText.map((content, index) => {
                                            return <p key={index}>{content}</p>;
                                        })}
                                    </div>
                                </div>
                                <label className="inline-flex items-center gap-3 mt-3">
                                    <input
                                        type="checkbox"
                                        checked={willAttend}
                                        onChange={(e) =>
                                            setWillAttend(e.target.checked)
                                        }
                                        className="form-checkbox h-5 w-5 text-gray-600"
                                    />
                                    <span className="ml-2 text-gray-700">
                                        I confirm that I will be attending
                                        HawkHacks from May 17th to May 19th. I
                                        will try to be on the premises for the
                                        vast majority for the duration of the
                                        event.
                                    </span>
                                </label>
                            </div>

                            <Button
                                onClick={verify}
                                disabled={
                                    isVerifying ||
                                    !agreedToParticipate ||
                                    !willAttend
                                }
                            >
                                Verify
                            </Button>

                            <p className="text-gray-800 mt-2">
                                Having trouble? Get help in our{" "}
                                <a
                                    href="https://discord.com/invite/GxwvFEn9TB"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-600 font-bold underline"
                                >
                                    Discord
                                </a>{" "}
                                support channel.
                            </p>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

