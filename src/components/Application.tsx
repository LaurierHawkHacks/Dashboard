import { FC } from "react";
import { ApplicationData } from "./forms/types";
import { Button } from "./Button/Button";
import { getResume } from "@/services/utils";
import { useNotification } from "@/providers/notification.provider";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ApplicationProps {
    app: ApplicationData;
}

const Field = ({
    label,
    value,
}: {
    label: string;
    value: string | string[];
}) => {
    if (typeof value === "string") {
        return (
            <div>
                <p className="font-medium">{label}</p>
                <p className="pl-4">{value}</p>
            </div>
        );
    }

    return (
        <div>
            <p className="font-medium">{label}</p>
            <ul className="pl-4">
                {value.map((m) => (
                    <li key={m}>{m}</li>
                ))}
            </ul>
        </div>
    );
};

export const Application: FC<ApplicationProps> = ({ app }) => {
    const { showNotification } = useNotification();
    return (
        <div className="divide-y divide-gray-300 w-fit border-t border-gray-300 pb-8">
            <div className="py-2 space-y-2">
                <Field
                    label="Name:"
                    value={`${app.firstName} ${app.lastName}`}
                />
                <Field label="Age:" value={app.age} />
                <Field label="Country:" value={app.countryOfResidence} />
                <Field label="City:" value={app.city} />
                <Field label="Phone:" value={app.phone} />
                <Field label="Role:" value={app.participatingAs} />
                <Field label="Discord:" value={app.discord} />
            </div>
            <div className="py-2 space-y-2">
                <Field label="School:" value={app.school} />
                <Field label="Level of Study:" value={app.levelOfStudy} />
                <Field label="Major:" value={app.major} />
            </div>
            <div className="py-2 space-y-2">
                <Field label="Gender:" value={app.gender} />
                <Field label="Pronouns:" value={app.pronouns} />
                <Field label="Sexuality:" value={app.sexuality} />
                <Field label="Ethnicity:" value={app.race} />
            </div>
            <div className="py-2 space-y-2">
                <Field label="Dietry Restrictions:" value={app.diets} />
                <Field label="Allergies:" value={app.allergies} />
            </div>
            <div className="py-2 space-y-2">
                <Field label="Interests:" value={app.interests} />
                <Field
                    label="Hackathon Experience:"
                    value={app.hackathonExperience}
                />
                <Field
                    label="Programming Languages:"
                    value={app.programmingLanguages}
                />
            </div>
            {app.participatingAs === "Hacker" && (
                <div className="py-2 space-y-2 max-w-lg">
                    <Field
                        label="Why do you want to participate at HawkHacks?"
                        value={app.reasonToBeInHawkHacks}
                    />
                    <Field
                        label="In a few sentences, what up-and-coming or revolutionizing technology are you most excited about?"
                        value={app.revolutionizingTechnology}
                    />
                </div>
            )}
            {app.participatingAs === "Mentor" && (
                <div className="py-2 space-y-2 max-w-xl">
                    <Field
                        label="Have you mentored at previous hackathons before?"
                        value={app.mentorExperience}
                    />
                    {app.linkedinUrl && (
                        <Field label="LinkedIn:" value={app.linkedinUrl} />
                    )}
                    {app.githubUrl && (
                        <Field label="GitHub:" value={app.githubUrl} />
                    )}
                    {app.personalWebsiteUrl && (
                        <Field
                            label="Other Website:"
                            value={app.personalWebsiteUrl}
                        />
                    )}
                    <Field
                        label="Why do you want to be a mentor at HawkHacks?"
                        value={app.reasonToBeMentor}
                    />
                    {app.mentorResumeRef && (
                        <div className="py-2">
                            <p className="font-medium">Mentor Resume:</p>
                            <Button
                                onClick={() => {
                                    getResume(app.mentorResumeRef).catch(() =>
                                        showNotification({
                                            title: "Oops!",
                                            message:
                                                "Resume could not be downloaed.",
                                        })
                                    );
                                }}
                            >
                                Get Mentor Resume
                            </Button>
                        </div>
                    )}
                </div>
            )}
            {app.participatingAs === "Volunteer" && (
                <div className="py-2 space-y-2 max-w-lg">
                    <Field
                        label="Have you volunteered at large-scale events before?"
                        value={app.volunteerExperience}
                    />
                    <Field
                        label="Why do you want to be a volunteer at HawkHacks?"
                        value={app.reasonToBeVolunteer}
                    />
                    <Field
                        label="In a couple of sentences, what would you be most excited about helping out with at HawkHacks and why?"
                        value={app.excitedToVolunteerFor}
                    />
                </div>
            )}
            {app.generalResumeRef && (
                <div className="py-2">
                    <p className="font-medium">Resume:</p>
                    <Button
                        onClick={() => {
                            getResume(app.generalResumeRef).catch(() =>
                                showNotification({
                                    title: "Oops!",
                                    message: "Resume could not be downloaed.",
                                })
                            );
                        }}
                    >
                        Get Resume
                    </Button>
                </div>
            )}
            <div className="py-2 space-y-2 max-w-lg">
                <div className="py-2 flex gap-4 items-center">
                    {app.agreedToReceiveEmailsFromMLH ? (
                        <CheckIcon className="ml-4 block text-tbrand w-10 h-10" />
                    ) : (
                        <XMarkIcon className="ml-4 block text-red-500 w-10 h-10" />
                    )}
                    <span className="block">
                        I authorize MLH to send me occasional emails about
                        relevant events, career opportunities, and community
                        announcements.
                    </span>
                </div>
            </div>
        </div>
    );
};
