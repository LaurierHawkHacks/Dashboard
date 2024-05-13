import { GoldenHawk, IpadKidHawks } from "@/assets";
import { Card, Accordion, SocialIcons, Button, Modal } from "@components";
import { faqs, sponsors, importantDateTimes } from "@data";
import { useAuth } from "@/providers/auth.provider";
import { useState } from "react";
import { useNotification } from "@/providers/notification.provider";
import { withdrawRSVP } from "@/services/utils";

const ImportantInfoBlocks = importantDateTimes.map((importantDateTime, i) => {
    const entries = Object.entries(importantDateTime.events);
    const timeBlocks = entries.map(([title, time], i) => {
        return (
            <div key={i} className="flex-item flex flex-col gap-2 items-center">
                <span className="badge bg-[#FFEEE4] px-[14px] py-[6px] rounded-2xl">
                    {title}
                </span>
                <div>{time}</div>
            </div>
        );
    });

    return (
        <div className="dates grid gap-4  p-2 border rounded-lg" key={i}>
            <span className="max-w-fit">
                <b className="!text-base">{importantDateTime.date}</b>
                <div className="text-xs">{importantDateTime.label}</div>
            </span>
            <div className="flex flex-wrap gap-4">{timeBlocks}</div>
        </div>
    );
});

const Sponsors = sponsors.map((sponsor, i) => {
    return (
        <a
            key={i}
            href={sponsor.link}
            target="_blank"
            rel="noopener noreferrer"
        >
            <img
                className="w-[4.875rem] lg:w-[6.865rem] aspect-[5/2] object-contain transition duration-200 hover:scale-105"
                src={sponsor.image}
                alt={sponsor.name}
            />
        </a>
    );
});

const HomePage = () => {
    const { currentUser, logout } = useAuth();
    const [disableAllActions, setDisableAllActions] = useState(false);
    const [openDismissRSVPWarning, setOpenWithdrawRSVP] = useState(false);
    const { showNotification } = useNotification();

    const withdraw = async () => {
        setDisableAllActions(true);
        try {
            const res = await withdrawRSVP();
            if (res.status === 200) {
                showNotification({
                    title: "Your RSVP has been withdrawn",
                    message: "",
                });
                // remove lingering claims
                await logout();
            } else {
                showNotification({
                    title: "Looks like something went wrong",
                    message: `Please contact us in our Discord support channel. (${res.message})`,
                });
            }
        } catch (error) {
            showNotification({
                title: "Error Withdrawing RSVP",
                message: (error as Error).message,
            });
        }
        setDisableAllActions(false);
    };

    return (
        <>
            <section className="homepage grid gap-4">
                <div className="grid xl:grid-cols-12 gap-4">
                    <Card
                        title="What is HawkHacks?"
                        className="about xl:col-span-7"
                    >
                        <div className="flex text-[#333] text-sm">
                            <p className="max-w-[37.5rem]">
                                HawkHacks came out of a desire to give everyone
                                an equal opportunity to get into tech, whether
                                that be programming, networking, researching,
                                learning, or teaching.
                                <br />
                                <br />
                                Join hundreds of students across Canada (and
                                across the world) in a 36 hour period of
                                exploration, creativity, and learning!
                                <br />
                                <br />
                                Remember, you don’t have to be a pro to
                                participate - show up with ten years or ten
                                minutes of experience (oh yeah, and a great
                                attitute too!)
                            </p>
                            <img
                                className="hidden sm:block md:hidden lg:block -translate-y-4"
                                src={GoldenHawk}
                                alt=""
                            />
                        </div>
                    </Card>

                <Card title="RSVP Status" className="xl:col-span-5">
                    <span className="flex flex-col gap-2">
                        <p className="text-lg">
                            RSVP status:{" "}
                            <span className="font-bold">
                                {currentUser?.rsvpVerified
                                    ? "RSVP'd"
                                    : "Not RSVP'd"}
                                <span className="capitalize">{` (${currentUser?.type})`}</span>
                            </span>
                        </p>
                    </span>
                        <Button
                            onClick={() =>
                                !disableAllActions && setOpenWithdrawRSVP(true)
                            }
                            intent="secondary"
                            className="rounded-lg mt-4 border-gray-300"
                        >
                            Not able to make it?
                        </Button>
                </Card>

                    <Card
                        title="Important Information"
                        className="infos xl:col-span-5"
                    >
                        <div className="text-[#333] text-sm space-y-6">
                            {ImportantInfoBlocks}
                        </div>
                    </Card>

                    <Card
                        title="Need help? Contact us!"
                        className="contacts xl:col-span-5"
                    >
                        <div className="flex gap-2">
                            <p className="text-[#333] text-sm lg:max-w-[37.5rem]">
                                Reach out at{" "}
                                <a href="mailto:hello@hawkhacks.ca">
                                    hello@hawkhacks.ca
                                </a>{" "}
                                for any help or support, and please be sure to
                                join the HawkHacks Discord community!
                            </p>
                            <img
                                className="hidden sm:block"
                                src={IpadKidHawks}
                                alt=""
                            />
                        </div>

                        <SocialIcons className="mt-8" />
                    </Card>

                    <Card
                        title="Our Sponsors"
                        className="grid sponsors xl:col-span-7"
                    >
                        <div className="text-[#333] text-sm">
                            <p>
                                Thank you to all our sponsors! Without them,
                                HawkHacks could not have happened!
                                <br />
                                <br />
                                Here are some of our top sponsors that we like
                                to thank:
                            </p>

                            <div className="sponsors flex flex-wrap gap-x-4 gap-y-2 p-4">
                                {Sponsors}
                            </div>

                            <a
                                className="mt-auto hover:underline font-bold"
                                href="https://hawkhacks.ca/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Check out all our sponsors! ✨
                            </a>
                        </div>
                    </Card>
                </div>

                <Card title="FAQ" className="faq">
                    <Accordion faqs={faqs} />
                </Card>
            </section>
            <Modal
                title="Withdraw RSVP!"
                subTitle="You will have to get into the waitlist to RSVP again."
                open={openDismissRSVPWarning}
                onClose={() => !disableAllActions && setOpenWithdrawRSVP(false)}
            >
                <div className="flex gap-4 justify-center">
                    <Button
                        intent="secondary"
                        disabled={disableAllActions}
                        onClick={() => setOpenWithdrawRSVP(false)}
                    >
                        cancel
                    </Button>
                    <Button
                        onClick={() => withdraw()}
                        disabled={disableAllActions}
                        intent="danger"
                    >
                        Withdraw
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export { HomePage };
