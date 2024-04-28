import { defaultApplication } from "@/components/forms/defaults";
import { FormInput } from "@/components/forms/types";
import { MdOutlineEdit, MdOutlineFileDownload } from "react-icons/md";

export const NetworkingPage = () => {
    const mediaList = [
        { media: "Instagram", type: "text" },
        { media: "LinkedIn", type: "text" },
        { media: "GitHub", type: "text" },
        { media: "Discord", type: "text" },
        { media: "Resume", type: "file" },
    ];

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
                    <div className="bg-white shadow-md p-4 rounded-xl">
                        <p className="mb-2">{item.media}</p>
                        <input
                            className="bg-peachWhite border-0 rounded-lg text-gray-500"
                            type={item.type}
                            placeholder="Add your account!"
                        ></input>
                        <MdOutlineEdit />
                    </div>
                ))}
            </form>
        </div>
    );
};
