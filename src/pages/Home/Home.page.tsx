import { GoldenHawk, IpadKidHawks } from "@/assets";
import { Card, Accordion, SocialIcons } from "@components";
import { faqs, sponsors } from "@data";

const HomePage = () => {
    const Sponsors = sponsors.map((sponsor, i) => {
        return (
            <a key={i} href={sponsor.link}>
                <img
                    className="w-[4.875rem] lg:w-[6.865rem] aspect-[5/2] object-contain"
                    src={sponsor.image}
                    alt={sponsor.name}
                />
            </a>
        );
    });

    return (
        <section className="homepage grid gap-4">
            <div className="grid xl:grid-cols-12 gap-4">
                <Card
                    title="What is HawkHacks?"
                    className="about xl:col-span-7"
                >
                    <div className="flex text-[#333] text-sm">
                        <p className="max-w-[37.5rem]">
                            HawkHacks came out of a desire to give everyone an
                            equal opportunity to get into tech, whether that be
                            programming, networking, researching, learning, or
                            teaching.
                            <br />
                            <br />
                            Join hundreds of students across Canada (and across
                            the world) in a 36 hour period of exploration,
                            creativity, and learning!
                            <br />
                            <br />
                            Remember, you don’t have to be a pro to participate
                            - show up with ten years or ten minutes of
                            experience (oh yeah, and a great attitute too!)
                        </p>
                        <img
                            className="hidden sm:block md:hidden lg:block -translate-y-4"
                            src={GoldenHawk}
                            alt=""
                        />
                    </div>
                </Card>

                <Card
                    title="Important Information"
                    className="infos xl:col-span-5"
                >
                    <div className="text-[#333] text-sm">
                        <div className="dates grid grid-cols-2 gap-4">
                            <div className="grid-item space-x-5">
                                <span className="badge bg-[#FFEEE4] px-[14px] py-[6px] rounded-2xl">
                                    When?
                                </span>
                                <span className="">Date - Date!</span>
                            </div>
                            <div className="grid-item space-x-5">
                                <span className="badge bg-[#FFEEE4] px-[14px] py-[6px] rounded-2xl">
                                    When?
                                </span>
                                <span className="">Date - Date!</span>
                            </div>
                            <div className="grid-item space-x-5">
                                <span className="badge bg-[#FFEEE4] px-[14px] py-[6px] rounded-2xl">
                                    When?
                                </span>
                                <span className="">Date - Date!</span>
                            </div>
                            <div className="grid-item space-x-5">
                                <span className="badge bg-[#FFEEE4] px-[14px] py-[6px] rounded-2xl">
                                    When?
                                </span>
                                <span className="">Date - Date!</span>
                            </div>
                        </div>
                        <p className="mt-6">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Dicta amet dolore voluptatum quos vel facilis
                            similique sed commodi quas eius, officia id quaerat
                            facere deserunt ullam error consequuntur ea modi.
                        </p>
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
                            for any help or support, and please be sure to join
                            the HawkHacks Discord community!
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
                            Here are some of our top sponsors that we like to
                            thank:
                        </p>

                        <div className="sponsors flex flex-wrap gap-x-4 gap-y-2 p-4">
                            {Sponsors}
                        </div>

                        <a
                            className="mt-auto hover:underline"
                            href="https://hawkhacks.ca/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Check out all our sponsors ✨
                        </a>
                    </div>
                </Card>
            </div>

            <Card title="Free Bbt" className="freeBbt">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
                quasi quo minima corrupti consequuntur dolores nulla, excepturi
                exercitationem quibusdam consectetur culpa ratione architecto
                qui a. Magni asperiores ea vel possimus?
            </Card>

            <Card title="Sponsors' Products" className="sponsorsProducts">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nulla
                reprehenderit eius temporibus corrupti eveniet impedit
                voluptatem ducimus explicabo, aspernatur ratione nobis dolores
                dolorem, atque, eaque ad mollitia quam tempore ex.
            </Card>

            <Card title="FAQ" className="faq">
                <Accordion faqs={faqs} />
            </Card>
        </section>
    );
};

export { HomePage };
