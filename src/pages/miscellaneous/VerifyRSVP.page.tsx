import { Button, LoadingAnimation } from "@/components";
import { useAuth } from "@/providers/auth.provider";
import { verifyRSVP } from "@/services/utils";
import { useNotification } from "@/providers/notification.provider";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { rsvpText } from "@/data";
import { InfoCallout } from "@/components/InfoCallout/InfoCallout";
import {
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { firestore } from "@/services/firebase";
import { SpotDoc } from "@/services/utils/types";
import { isAfter } from "date-fns";

function ordinalSuffix(i: number) {
    const j = i % 10;
    const k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

export const VerifyRSVP = () => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [agreedToParticipate, setAgreedToParticipate] = useState(false);
    const [willAttend, setWillAttend] = useState(false);
    const [rsvpLimitReached, setRsvpLimitReached] = useState(true);
    const { showNotification } = useNotification();
    const { currentUser, reloadUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const timeoutRef = useRef<number | null>(null);
    const [spotAvailable, setSpotAvailable] = useState(false);
    const [inWaitlist, setInWaitlist] = useState(false);
    const [expiredSpot, setExpiredSpot] = useState(false);
    const [refreshRSVPStatus, setRefreshRSVPStatus] = useState(false);
    const [waitlistPos, setWaitlistPos] = useState(0);

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
                    message: message ?? "",
                });
            }
        }
        setRefreshRSVPStatus(!refreshRSVPStatus);
    };

    // const join = async () => {
    //     setIsLoading(true);
    //     try {
    //         const res = await joinWaitlist();
    //         if (res.status === 200) {
    //             setRsvpLimitReached(true);
    //             setInWaitlist(true);
    //             setExpiredSpot(false);
    //         } else {
    //             showNotification({
    //                 title: "Error joining waitlist",
    //                 message: res.message,
    //             });
    //         }
    //     } catch (error) {
    //         showNotification({
    //             title: "Error joining waitlist",
    //             message: (error as Error).message,
    //         });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    useEffect(() => {
        if (currentUser && currentUser.rsvpVerified) navigate("/");
    }, [currentUser, navigate]);

    useEffect(() => {
        if (!currentUser || currentUser.rsvpVerified) return;
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsLoading(false), 5000); // 5s timeout

        (async () => {
            try {
                const q = query(
                    collection(firestore, "spots"),
                    where("uid", "==", currentUser.uid),
                    orderBy("expiresAt", "desc")
                );
                const waitlistQ = query(
                    collection(firestore, "waitlist"),
                    orderBy("joinAt", "asc")
                );
                const [snap, waitSnap] = await Promise.allSettled([
                    getDocs(q),
                    getDocs(waitlistQ),
                ]);
                if (snap.status === "fulfilled") {
                    const canRSVP = snap.value.size > 0;
                    const data = snap.value.docs[0]?.data() as SpotDoc;
                    if (data && isAfter(new Date(), data.expiresAt.toDate())) {
                        setSpotAvailable(false);
                        setRsvpLimitReached(true);
                        setExpiredSpot(true);
                    } else {
                        setSpotAvailable(canRSVP);
                        setRsvpLimitReached(!canRSVP);
                    }
                } else {
                    console.error(snap.reason);
                }

                if (waitSnap.status === "fulfilled") {
                    let inWaitlist = false;
                    let position = 1;
                    for (const doc of waitSnap.value.docs) {
                        const data = doc.data();
                        if (data.uid === currentUser.uid) {
                            inWaitlist = true;
                            break;
                        }
                        position += 1;
                    }
                    setInWaitlist(inWaitlist);
                    setWaitlistPos(position);
                } else {
                    console.error(waitSnap.reason);
                }
                if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [currentUser, refreshRSVPStatus]);

    useEffect(() => {
        if (!currentUser || currentUser.rsvpVerified || !inWaitlist) return;
        // listen to real time changes
        const q = query(
            collection(firestore, "spots"),
            where("uid", "==", currentUser.uid)
        );
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs[0]?.data() as SpotDoc;
            if (!data) return;
            if (isAfter(data.expiresAt.toDate(), new Date())) {
                setRsvpLimitReached(false);
                setSpotAvailable(true);
            }
        });

        // listen to waitlist position
        const unsubWaitlist = onSnapshot(
            collection(firestore, "waitlist"),
            (snap) => {
                let posDiff = 0;
                snap.docChanges().forEach((change) => {
                    if (change.type === "removed") {
                        posDiff += 1;
                    }
                });
                setWaitlistPos((curr) => curr - posDiff);
            }
        );
        return () => {
            unsub();
            unsubWaitlist();
        };
    }, [currentUser, inWaitlist]);

    if (isLoading) return <LoadingAnimation />;

    return (
        <>
            {isVerifying ? (
                <LoadingAnimation text="Loading . . ." />
            ) : (
                <div className="pt-12 flex justify-center items-center flex-col gap-6">
                    {rsvpLimitReached ? (
                        <div className="text-center space-y-4 max-w-2xl mx-auto">
                            {inWaitlist && !spotAvailable && (
                                <div className="flex justify-center flex-col">
                                    <InfoCallout text="Thanks for joining the waitlist. Once there is an available spot, you will receive an email. You can always come back to here to check." />
                                </div>
                            )}
                            {expiredSpot && (
                                <div className="flex justify-center">
                                    <InfoCallout text="Your spot has expired. Please join the waitlist again." />
                                </div>
                            )}
                            {!inWaitlist && (
                                <>
                                    <p className="text-lg font-bold text-red-500">
                                        RSVP Limit Reached
                                    </p>
                                    <p className="text-gray-700">
                                        Sorry, but the RSVP limit has been
                                        reached.
                                        {/* <br /> */}
                                        {/* Join the waitlist incase someone revokes */}
                                        {/* their RSVP! */}
                                    </p>
                                </>
                            )}
                            {inWaitlist && (
                                <>
                                    <p className="font-bold">
                                        You are {ordinalSuffix(waitlistPos)} in
                                        line.
                                    </p>
                                    <p>
                                        Once you receive your email, you&apos;ll
                                        have{" "}
                                        <span className="font-bold">
                                            24 hours to RSVP
                                        </span>{" "}
                                        before we move on to the next person in
                                        line. Keep checking this page for your
                                        live spot on the waitlist to ensure you
                                        don&apos;t miss it -{" "}
                                        <span className="font-bold">
                                            you will not get another chance.
                                        </span>
                                    </p>
                                </>
                            )}
                            <p className="text-gray-700">
                                If you have any questions or concerns, please
                                reach out to us in our tech support channel on
                                Discord.
                            </p>
                            {/* {!inWaitlist && ( */}
                            {/*     <Button */}
                            {/*         onClick={join} */}
                            {/*         disabled={isLoading || inWaitlist} */}
                            {/*     > */}
                            {/*         Join waitlist */}
                            {/*     </Button> */}
                            {/* )} */}
                        </div>
                    ) : (
                        <>
                            {spotAvailable && (
                                <>
                                    <InfoCallout text="There is an empty spot for you! Please RSVP within 24 hours to secure the spot." />
                                    <p className="text-lg font-bold">
                                        Please verify your RSVP to get access to
                                        the rest of the dashboard!
                                    </p>
                                    <div className="flex flex-col items-start max-w-3xl">
                                        <div>
                                            <label className="inline-flex items-center gap-3 mt-3">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        agreedToParticipate
                                                    }
                                                    onChange={(e) =>
                                                        setAgreedToParticipate(
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="form-checkbox h-5 w-5 text-gray-600"
                                                />
                                                <span className="ml-2 text-gray-700 cursor-pointer">
                                                    I have read the content
                                                    below and agree to
                                                    participate in the event
                                                    using my free will and good
                                                    judgment.
                                                </span>
                                            </label>

                                            <div className="border border-blueGreen p-2 my-8 flex flex-col gap-2 text-gray-500 max-w-3xl max-h-72 overflow-y-scroll">
                                                {rsvpText.map(
                                                    (content, index) => {
                                                        return (
                                                            <p key={index}>
                                                                {content}
                                                            </p>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                        <label className="inline-flex items-center gap-3 mt-3">
                                            <input
                                                type="checkbox"
                                                checked={willAttend}
                                                onChange={(e) =>
                                                    setWillAttend(
                                                        e.target.checked
                                                    )
                                                }
                                                className="form-checkbox h-5 w-5 text-gray-600"
                                            />
                                            <span className="ml-2 text-gray-700">
                                                I confirm that I will be
                                                attending HawkHacks{" "}
                                                <span className="font-bold uppercase underline">
                                                    in person
                                                </span>{" "}
                                                from May 17th to May 19th. I
                                                will try to be on the premises
                                                for the vast majority for the
                                                duration of the event.
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
                        </>
                    )}
                </div>
            )}
        </>
    );
};
