import { useAuth as useAuthProvider } from "@/providers/auth.provider";
import { useAuth } from "@/providers/hooks";
import { useEffect, useState } from "react";
import { MdOutlineEdit, MdOutlineFileDownload } from "react-icons/md";
import { getFunctions, httpsCallable } from "firebase/functions";

const mediaTypes = [
    // { name: "Instagram", key: "instagramUrl" },
    { name: "LinkedIn", key: "linkedinUrl" },
    { name: "GitHub", key: "githubUrl" },
    { name: "Discord", key: "discord" },
];

interface MediaValues {
    // instagram?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    discord?: string;
    [key: string]: string | undefined;
}

export const NetworkingPage = () => {
    const userApp = useAuthProvider().userApp;
    const { currentUser } = useAuth();
    console.log("userApp", userApp);
    console.log("user", currentUser);

    const { firstName, lastName, pronouns, mentorResumeRef, generalResumeRef } =
        userApp || {};

    // State to keep track of each media account value
    const [mediaValues, setMediaValues] = useState<MediaValues>({
        //instagram: userApp?.instagram,
        linkedinUrl: userApp?.linkedinUrl,
        githubUrl: userApp?.githubUrl,
        discord: userApp?.discord,
    });

    const handleFileChange = (media: string, file: FileList | null) => {
        // Handle RESUME UPLOAD
        console.log(media, file);
    };

    console.log("uid", currentUser?.uid);

    const handleInputChange = (key: string, value: string) => {
        setMediaValues((prev) => ({ ...prev, [key]: value }));
        console.log("mediaValues", mediaValues);
    };

    // console.log("userID", currentUser?.uid);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const functions = getFunctions();
        try {
            const updateMedia = httpsCallable(functions, "updateSocials");
            console.log("mediaValues", mediaValues);

            const response = await updateMedia(mediaValues);
            const data = response.data;

            console.log(data);
        } catch (e) {
            console.error(e);
        }
    };

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
                                <p className="bg-green-300 rounded-full px-4 py-1">
                                    Completed
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
                                <MdOutlineEdit className="absolute right-2 text-gray-500 ml-2" />
                            )}
                        </div>

                        {mediaValues[key] && (
                            <div className="mt-2 flex gap-2">
                                <button className="bg-peachWhite rounded-lg px-4 py-1">
                                    Cancel
                                </button>
                                <button
                                    className="bg-peachWhite rounded-lg px-4 py-1"
                                    type="button"
                                    onClick={(e) => handleSubmit(e)}
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
                            id="file-upload"
                            className="hidden"
                            type="file"
                            onChange={(e) =>
                                handleFileChange(
                                    "FileName Here",
                                    e.target.files
                                )
                            }
                        />
                        {(mentorResumeRef || generalResumeRef) && (
                            <p className="bg-peachWhite px-4 py-1 w-full rounded-md text-gray-500 overflow-hidden">
                                {mentorResumeRef || generalResumeRef}
                            </p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};
