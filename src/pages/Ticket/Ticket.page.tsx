import testQRCode from "../../assets/qrcode.png";
import { Logo } from "@assets";
import { FiDownload } from "react-icons/fi";
import { getFunctions, httpsCallable } from "firebase/functions";
import { GoogleWalletButton } from "@/assets";
import { useAuth } from "@/providers/hooks";
import { Navigate } from "react-router-dom";
import { useAvailableRoutes } from "@/providers/routes.provider";

interface PassObjectResponse {
    url: string;
}

export const TicketPage = () => {
    const functions = getFunctions();
    const { currentUser } = useAuth();
    const firstName = "FirstName"; // Replace with Ticket First Name
    const lastName = "LastName"; // Replace with Ticket Last Name
    const email = "email@email.com"; // Replace with Ticket Email
    const { paths } = useAvailableRoutes();

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = testQRCode;
        link.download = "qrcode.png"; // Replace with Ticket QR Code
        link.click();
    };

    if (!currentUser) return <Navigate to={paths.login} />;

    const handleCreatePassClass = () => {
        const addPassClass = httpsCallable(functions, "createPassClass");
        addPassClass({})
            .then((result) => {
                console.log("Pass class result:", result.data);
            })
            .catch((error) => {
                console.error("Error creating pass class:", error);
            });
    };

    const handleCreatePassObject = async () => {
        const addPassObject = httpsCallable<unknown, PassObjectResponse>(
            functions,
            "createPassObject"
        );
        try {
            const result = await addPassObject({ email: currentUser.email });
            window.open(result.data.url, "_blank");
        } catch (error) {
            console.error("Error creating pass object:", error);
        }
    };

    return (
        <>
            <div>
                <button
                    className="p-4 bg-red-50 m-2"
                    onClick={handleCreatePassClass}
                >
                    Create Pass Class
                </button>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        handleCreatePassObject();
                    }}
                >
                    <img src={GoogleWalletButton} alt="Add to Google Wallet" />
                </a>

                <p>Here you are</p>
            </div>
            <div className="flex justify-start">
                <div className="bg-white drop-shadow-xl rounded-xl box-border max-w-[540px] w-full p-10 mt-10">
                    <div className="flex items-center font-bold text-[30px] mb-2">
                        <img
                            src={Logo}
                            alt="HawkHacks Logo"
                            className="w-6 mr-2"
                        />
                        HawkHacks 2024
                    </div>
                    <h1 className="font-semibold text-[42px] mb-1 truncate">
                        {firstName} {lastName}
                    </h1>
                    <h2 className="text-gray-500 underline mb-6 truncate">
                        {email}
                    </h2>
                    <div className="bg-gray-200 rounded-xl h-[2px] my-8"></div>
                    <div className="flex flex-col items-center">
                        <img
                            src={testQRCode}
                            alt="QR Code"
                            className="w-[350px] mb-4"
                        />
                        <button
                            className="text-3xl mb-4"
                            onClick={handleDownload}
                        >
                            <FiDownload />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
