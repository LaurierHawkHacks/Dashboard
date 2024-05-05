import { Button } from "@/components";
import { useAuth } from "@/providers/auth.provider";
import { verifyRSVP } from "@/services/utils";
import { useNotification } from "@/providers/notification.provider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { rsvpDropdown } from "@/data";

export const VerifyRSVP = () => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [agreedToParticipate, setAgreedToParticipate] = useState(false);
    const [willAttend, setWillAttend] = useState(false);
    const { showNotification } = useNotification();
    const { currentUser, reloadUser } = useAuth();
    const navigate = useNavigate();

    const verify = async () => {
        setIsVerifying(true);
        const confirmed = await verifyRSVP();
        if (!confirmed) {
            setIsVerifying(false);
            showNotification({
                title: "Error Verifying RSVP",
                message:
                    "Please send an email to hello@hawkhacks.ca for us to confirm it for you.",
            });
        } else {
            await reloadUser();
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.rsvpVerified) navigate("/");
    }, [currentUser, navigate]);

    return (
        <div className="pt-12 flex justify-center items-center flex-col gap-6">
            <p className="text-lg font-bold">
                Please verify your RSVP to get access to the rest of the
                dashboard!
            </p>
            <div className="flex flex-col items-start max-w-3xl">
                <div>
                    <label className="inline-flex items-center gap-3 mt-3">
                        <input
                            type="checkbox"
                            checked={agreedToParticipate}
                            onChange={(e) =>
                                setAgreedToParticipate(e.target.checked)
                            }
                            className="form-checkbox h-5 w-5 text-gray-600"
                        />
                        <span className="ml-2 text-gray-700 cursor-pointer">
                            I have read the content below and agree to
                            participate in the event using my free will and good
                            judgment. (Click this text to read)
                        </span>
                    </label>

                    <div className="border border-blueGreen p-2 my-8 flex flex-col gap-2 text-gray-500 max-w-3xl max-h-72 overflow-y-scroll">
                        {rsvpDropdown.map((content) => {
                            return <p>{content}</p>;
                        })}
                    </div>
                </div>
                <label className="inline-flex items-center gap-3 mt-3">
                    <input
                        type="checkbox"
                        checked={willAttend}
                        onChange={(e) => setWillAttend(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-gray-600"
                    />
                    <span className="ml-2 text-gray-700">
                        I confirm that I will be attending HawkHacks from May
                        17th to May 19th. I will try to be on the premises for
                        the vast majority for the duration of the event.
                    </span>
                </label>
            </div>
            <Button
                onClick={verify}
                disabled={isVerifying || !agreedToParticipate || !willAttend}
                className="mt-4  px-4 py-2 rounded disabled:bg-gray-300"
            >
                Verify
            </Button>
        </div>
    );
};
