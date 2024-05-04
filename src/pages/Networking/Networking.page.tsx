import { useAuth as useAuthProvider } from "@/providers/auth.provider";
import { useEffect, useState } from "react";
import { MdOutlineEdit, MdOutlineFileDownload } from "react-icons/md";
import { getFunctions, httpsCallable } from "firebase/functions";
import { LoadingAnimation } from "@/components/LoadingAnimation";

const mediaTypes = [
    { name: "Instagram", key: "instagram" },
    { name: "LinkedIn", key: "linkedinUrl" },
    { name: "GitHub", key: "githubUrl" },
    { name: "Discord", key: "discord" },
];

const allowedFileTypes = [
    "image/*", //png, jpg, jpeg, jfif, pjpeg, pjp, gif, webp, bmp, svg
    "application/pdf", //pdf
    "application/msword", //doc, dot, wiz
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", //docx
    "application/rtf", //rtf
    "application/oda", //oda
    "text/markdown", //md, markdown, mdown, markdn
    "text/plain", //txt, text, conf, def, list, log, in, ini
    "application/vnd.oasis.opendocument.text", //odt
];

interface MediaValues {
    instagram?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    discord?: string;
    [key: string]: string | undefined;
}

export const NetworkingPage = () => {
    const userApp = useAuthProvider().userApp;
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState("");
    const [randomId] = useState(Math.random().toString(32));

    const [file, setFile] = useState<File | null>(null);

    console.log("userApp", userApp);

    const {
        firstName,
        lastName,
        pronouns,
        mentorResumeRef,
        participatingAs,
        generalResumeRef,
    } = userApp || {};

    // State to keep track of each media account value
    const [mediaValues, setMediaValues] = useState<MediaValues>({
        instagram: userApp?.instagram,
        linkedinUrl: userApp?.linkedinUrl,
        githubUrl: userApp?.githubUrl,
        discord: userApp?.discord,
    });

    useEffect(() => {
        if (userApp) {
            setMediaValues({
                instagram: userApp.instagram || "",
                linkedinUrl: userApp.linkedinUrl || "",
                githubUrl: userApp.githubUrl || "",
                discord: userApp.discord || "",
            });
            setIsLoading(false);
        }
    }, [userApp]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFile(selectedFiles[0] ?? null);
    };

    const handleInputChange = (key, value) => {
        setMediaValues((prev) => ({ ...prev, [key]: value }));
        setEditMode(key);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const functions = getFunctions();
        try {
            const updateMedia = httpsCallable(functions, "updateSocials");
            await updateMedia(mediaValues && file && participatingAs);
            setIsLoading(false);
            setEditMode("");
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setMediaValues({
            instagram: userApp?.instagram || "",
            linkedinUrl: userApp?.linkedinUrl || "",
            githubUrl: userApp?.githubUrl || "",
            discord: userApp?.discord || "",
        });
        setEditMode("");
    };

    if (isLoading) return <LoadingAnimation />;

    return (
        <div>
            <div className="flex items-center gap-10">
                <h1 className="font-bold text-2xl">
                    {firstName} {lastName}
                </h1>
                <p>{pronouns}</p>
            </div>
            <p className="mt-10">Your connections</p>
            <form className="flex flex-col max-w-md gap-5 mt-12">
                {mediaTypes.map(({ name, key }) => (
                    <div
                        key={key}
                        className="bg-white shadow-md p-4 rounded-xl flex flex-col"
                    >
                        <div className="mb-2 flex justify-between items-center">
                            <p className="flex-1">{name}</p>
                            {mediaValues[key] && (
                                <p
                                    className={`rounded-full px-4 py-1 ${
                                        editMode === key
                                            ? "bg-blue-500/60 text-white"
                                            : "bg-green-300"
                                    }`}
                                >
                                    {editMode === key ? "Pending" : "Complete"}
                                </p>
                            )}
                        </div>
                        <div className="relative flex items-center w-1/2">
                            <input
                                className="bg-peachWhite border-0 rounded-lg text-gray-500 flex-grow"
                                type="text"
                                placeholder={`Add your ${name}!`}
                                value={mediaValues[key]}
                                onChange={(e) =>
                                    handleInputChange(key, e.target.value)
                                }
                            />
                            {mediaValues[key] && (
                                <MdOutlineEdit className="absolute -right-[5%] text-gray-500 ml-2" />
                            )}
                        </div>

                        {editMode === key && (
                            <div className="mt-2 flex gap-2">
                                <button
                                    className="bg-gray-300/30 rounded-lg px-4 py-1"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="bg-peachWhite text-black rounded-lg px-4 py-1"
                                    onClick={handleSubmit}
                                >
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {/* RESUME UPLOAD */}
                <div className="bg-white shadow-md p-4 rounded-xl flex flex-col">
                    <div className="mb-2 flex justify-between items-center">
                        <p className="flex-1">Resume</p>
                        {/* UPDATE HERE */}
                        {(mentorResumeRef || generalResumeRef) && (
                            <p className="bg-green-300 rounded-full px-4 py-1">
                                Completed
                            </p>
                        )}
                    </div>
                    <div className="relative flex items-center w-1/2 gap-4">
                        <label
                            htmlFor="file-upload"
                            className="w-8 h-8 bg-peachWhite rounded-lg flex items-center justify-center hover:cursor-pointer"
                        >
                            <MdOutlineFileDownload className="text-gray-500" />
                        </label>
                        <input
                            id={`file-${randomId}`}
                            className="hidden"
                            type="file"
                            accept={allowedFileTypes.join(", ")}
                            onChange={handleFileInput}
                        />
                        {(mentorResumeRef || generalResumeRef) && (
                            <p className="bg-peachWhite px-4 py-1 w-full rounded-md text-gray-500 overflow-hidden">
                                {file?.name || "Resume Uploaded"}
                            </p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};
