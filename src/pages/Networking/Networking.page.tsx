import { useAuth } from "@/providers/auth.provider";
import { useState } from "react";
import { MdOutlineEdit, MdOutlineFileDownload } from "react-icons/md";

interface MediaItem {
    media: string;
    type: "text" | "file";
}

const mediaList: MediaItem[] = [
    { media: "Instagram", type: "text" },
    { media: "LinkedIn", type: "text" },
    { media: "GitHub", type: "text" },
    { media: "Discord", type: "text" },
];

interface MediaValues {
    [key: string]: string;
}

export const NetworkingPage = () => {
    // State to keep track of each media account value
    const [mediaValues, setMediaValues] = useState<MediaValues>(
        mediaList.reduce((acc, item) => ({ ...acc, [item.media]: "" }), {})
    );

    const user = useAuth();

    user.userApp?.generalResumeRef;

    // Handle Social Media input change
    const handleInputChange = (media: string, value: string) => {
        setMediaValues((prev) => ({ ...prev, [media]: value }));
    };

    const handleFileChange = (media: string, file: FileList | null) => {
        // Handle RESUME UPLOAD
        console.log(media, file);
    };

    return (
        <div>
            <div className="flex items-center gap-10">
                <h1 className="font-bold text-2xl">
                    {user.userApp?.firstName + " " + user.userApp?.lastName}
                </h1>
                <p>{user.userApp?.pronouns}</p>
            </div>
            <p className="mt-10">Your connections</p>
            <form className="flex flex-col max-w-md gap-5 mt-12">
                {mediaList.map((item) => (
                    <div
                        key={item.media}
                        className="bg-white shadow-md p-4 rounded-xl flex flex-col"
                    >
                        <div className="mb-2 flex justify-between items-center">
                            <p className="flex-1">{item.media}</p>
                            {mediaValues[item.media] && (
                                <p className="bg-green-300 rounded-full px-4 py-1">
                                    Completed
                                </p>
                            )}
                        </div>
                        <div className="relative flex items-center w-1/2">
                            <input
                                className="bg-peachWhite border-0 rounded-lg text-gray-500 flex-grow "
                                type={item.type}
                                placeholder="Add your account!"
                                value={mediaValues[item.media]} // <-- this will be the backend stored value
                                onChange={(e) =>
                                    handleInputChange(
                                        item.media,
                                        e.target.value
                                    )
                                }
                            />
                            {mediaValues[item.media] && (
                                <MdOutlineEdit className="absolute right-2 text-gray-500 ml-2" />
                            )}
                        </div>
                    </div>
                ))}
                <div className="bg-white shadow-md p-4 rounded-xl flex flex-col">
                    <div className="mb-2 flex justify-between items-center">
                        <p className="flex-1">Resume</p>
                        {/* UPDATE HERE */}
                        {(user.userApp?.mentorResumeRef ||
                            user.userApp?.generalResumeRef) && (
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
                        {(user.userApp?.mentorResumeRef ||
                            user.userApp?.generalResumeRef) && (
                            <p className="bg-peachWhite px-4 py-1 w-full rounded-md text-gray-500 overflow-hidden">
                                {user.userApp?.mentorResumeRef ||
                                    user.userApp?.generalResumeRef}
                            </p>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};
