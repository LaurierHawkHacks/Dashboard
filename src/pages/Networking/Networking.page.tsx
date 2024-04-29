import { defaultApplication } from "@/components/forms/defaults";
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
    [key: string]: string; // This defines an index signature
}

export const NetworkingPage = () => {
    // State to keep track of each media account value
    const [mediaValues, setMediaValues] = useState<MediaValues>(
        mediaList.reduce((acc, item) => ({ ...acc, [item.media]: "" }), {})
    );

    // Function to update the corresponding media value
    const handleInputChange = (media: string, value: string) => {
        setMediaValues((prev) => ({ ...prev, [media]: value }));
    };

    const handleFileChange = (media: string, file: FileList | null) => {
        // Assuming you want to handle the file list here
        console.log(media, file);
    };

    return (
        <div>
            <div className="flex items-center gap-10">
                <h1 className="font-bold text-2xl">
                    {defaultApplication.firstName +
                        "Gabriel Diniz " +
                        defaultApplication.lastName}
                </h1>
                <p>{defaultApplication.pronouns}she/her</p>
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
                                value={mediaValues[item.media]}
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
                        {/* {mediaValues[item.media] && ( */}
                        <p className="bg-green-300 rounded-full px-4 py-1">
                            Completed
                        </p>
                        {/* )} */}
                    </div>
                    <div className="relative flex items-center w-1/2">
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
                                    "YourMediaIdentifier",
                                    e.target.files
                                )
                            }
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};
