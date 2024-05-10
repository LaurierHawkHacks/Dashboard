import { useAuth as useAuthProvider } from "@/providers/auth.provider";
import { FormEventHandler, useEffect, useRef, useState } from "react";
import { MdOutlineEdit, MdOutlineFileDownload } from "react-icons/md";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import {
    getResume,
    getSocials,
    updateSocials,
    uploadGeneralResume,
    uploadMentorResume,
} from "@/services/utils";
import { useNotification } from "@/providers/notification.provider";
import type { Socials } from "@/services/utils/types";
import { Navigate } from "react-router-dom";

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

const mediaTypes: { name: string; key: keyof Socials }[] = [
    { name: "Instagram", key: "instagram" },
    { name: "LinkedIn", key: "linkedin" },
    { name: "GitHub", key: "github" },
    { name: "Discord", key: "discord" },
];

export const NetworkingPage = () => {
    const { currentUser, userApp } = useAuthProvider();
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState("");
    const timeoutRef = useRef<number | null>(null);
    const gettinSocialsRef = useRef<boolean>(false);
    const { showNotification } = useNotification();
    const [socials, setSocials] = useState<Socials | null>(null);

    const [file, setFile] = useState<File | null>(null);

    // State to keep track of each media account value
    const [mediaValues, setMediaValues] = useState<Socials>({
        instagram: "",
        linkedin: "",
        github: "",
        discord: "",
        resumeRef: "",
        docId: "",
        uid: "",
    });

    useEffect(() => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setIsLoading(false), 5000);

        (async () => {
            // avoid calling the function twice
            if (gettinSocialsRef.current) return;
            gettinSocialsRef.current = true;
            try {
                const res = await getSocials();
                setSocials(res.data);
                setMediaValues(res.data);
            } catch (e) {
                showNotification({
                    title: "Error Getting Socials",
                    message: (e as Error).message,
                });
            } finally {
                if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
                setIsLoading(false);
            }
        })();

        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, [userApp]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFile(selectedFiles[0] ?? null);
        setEditMode("resume");
    };

    const submitFile = async () => {
        if (!file || !currentUser || !userApp) return;

        let ref = "";
        if (userApp.participatingAs === "Mentor") {
            ref = await uploadMentorResume(file, currentUser.uid);
        } else {
            ref = await uploadGeneralResume(file, currentUser.uid);
        }

        try {
            await updateSocials({ ...mediaValues, resumeRef: ref });
            setSocials(
                socials
                    ? {
                          ...socials,
                          resumeRef: ref,
                      }
                    : null
            );
            setMediaValues({
                ...mediaValues,
                resumeRef: ref,
            });
            setEditMode("");
        } catch (e) {
            showNotification({
                title: "Failed to upload resuem",
                message: (e as Error).message,
            });
        }
    };

    const handleInputChange = (key: keyof Socials, value: string) => {
        setMediaValues((prev) => ({ ...prev, [key]: value }));
        setEditMode(key);
    };

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();
        try {
            await updateSocials(mediaValues);
            setSocials({ ...mediaValues });
            setEditMode("");
        } catch (e) {
            showNotification({
                title: "Failed to update socials",
                message: (e as Error).message,
            });
        }
    };

    const handleCancel = () => {
        setMediaValues({
            instagram: socials?.instagram ?? "",
            github: socials?.github ?? "",
            linkedin: socials?.linkedin ?? "",
            discord: socials?.discord ?? "",
            resumeRef: socials?.resumeRef ?? "",
            docId: socials?.docId ?? "",
            uid: socials?.uid ?? "",
        });
        setEditMode("");
    };

    if (isLoading) return <LoadingAnimation />;

    if (!userApp) return <Navigate to="/" />;

    return (
        <div>
            <div className="flex items-center gap-10">
                <h1 className="font-bold text-2xl">
                    {userApp.firstName} {userApp.lastName}
                </h1>
                <p>{userApp.pronouns}</p>
            </div>
            <p className="mt-6">Your connections</p>
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
                                            ? " text-gray-500 italic "
                                            : "bg-green-300"
                                    }`}
                                >
                                    {editMode === key
                                        ? "Unsaved Changes"
                                        : "Complete"}
                                </p>
                            )}
                        </div>
                        <div className="relative">
                            <input
                                className="bg-peachWhite border-0 rounded-lg text-gray-500 pr-7 w-full"
                                type="text"
                                placeholder={`Add your ${name}!`}
                                value={mediaValues[key]}
                                onChange={(e) =>
                                    handleInputChange(key, e.target.value)
                                }
                            />
                            {mediaValues[key] && (
                                <MdOutlineEdit className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5" />
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
                        {socials && socials.resumeRef && (
                            <p className="bg-green-300 rounded-full px-4 py-1">
                                Completed
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="p-2 bg-peachWhite rounded-lg flex items-center justify-center hover:cursor-pointer flex-shrink-0"
                            onClick={() =>
                                mediaValues.resumeRef &&
                                getResume(mediaValues.resumeRef)
                            }
                        >
                            <MdOutlineFileDownload className="text-gray-500 w-6 h-6" />
                        </button>
                        <label
                            htmlFor="resume-file-input"
                            className="flex-grow rounded-lg px-4 py-2 bg-peachWhite hover:cursor-pointer"
                        >
                            <span>
                                {file ? file.name : "Select new resume file"}
                            </span>
                            <input
                                id="resume-file-input"
                                className="sr-only"
                                type="file"
                                accept={allowedFileTypes.join(", ")}
                                onChange={handleFileInput}
                            />
                        </label>
                    </div>
                    {editMode === "resume" && (
                        <div className="mt-4 flex gap-2">
                            <button
                                type="button"
                                className="bg-gray-300/30 rounded-lg px-4 py-1"
                                onClick={() => {
                                    setFile(null);
                                    setEditMode("");
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-peachWhite text-black rounded-lg px-4 py-1"
                                onClick={submitFile}
                            >
                                Save
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};
