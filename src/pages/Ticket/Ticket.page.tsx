import testQRCode from "../../assets/qrcode.png";
import { Logo } from "@assets";
import { FiDownload } from "react-icons/fi";
import { getFunctions, httpsCallable } from "firebase/functions";
import { GoogleWalletBadge } from "@/assets";
import { useAuth } from "@/providers/hooks";
import { Navigate } from "react-router-dom";
import { useAvailableRoutes } from "@/providers/routes.provider";

export const TicketPage = () => {
    const functions = getFunctions();
    const { paths } = useAvailableRoutes();

    const { currentUser } = useAuth();
    const email = currentUser?.email;
    const fullName = currentUser?.displayName || "";
    const names = fullName.split(" ");
    const firstName = names[0] || "Unknown";
    const lastName = names[1] || "Unknown";

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = testQRCode;
        link.download = "qrcode.png"; // Replace with Ticket QR Code
        link.click();
    };

    if (!currentUser) return <Navigate to={paths.login} />;

    // const handleCreatePassClass = () => {
    //     const addPassClass = httpsCallable(functions, "createPassClass");
    //     addPassClass({})
    //         .then((result) => {
    //             console.log("Pass class result:", result.data);
    //         })
    //         .catch((error) => {
    //             console.error("Error creating pass class:", error);
    //         });
    // };

    const handleCreatePassObject = async () => {
        try {
            const createTicket = httpsCallable(functions, "createPassObject");
            const ticketResult = await createTicket({
                email: currentUser.email,
            });
            const ticketData = ticketResult.data as { url?: string };
            if (ticketData.url) {
                window.location.href = ticketData.url; // Redirects user to download the pass
                alert(
                    "Ticket has been issued and your pass is ready to add to Apple Wallet!"
                );
            } else {
                alert(
                    "Ticket has been issued but could not generate Apple Wallet pass."
                );
            }
        } catch (error) {
            console.error("Failed to issue ticket:", error);
            alert("Failed to issue ticket.");
        }
    };

    return (
        <>
            {/* <button
                    className="p-4 bg-red-50 m-2"
                    onClick={handleCreatePassClass}
                >
                    Create Pass Class
                </button> */}

            <div className="flex justify-start">
                <div className="bg-white drop-shadow-xl rounded-xl box-border max-w-[400px] w-full p-8 flex flex-col gap-2">
                    <div className="flex items-center font-bold text-2xl md:text-[30px]">
                        <img
                            src={Logo}
                            alt="HawkHacks Logo"
                            className="w-6 mr-2"
                        />
                        HawkHacks 2024
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                        <h1 className="font-semibold text-3xl md:text-[42px]">
                            {firstName} {lastName}
                        </h1>
                        <h2 className="text-gray-500 underline truncate">
                            {email}
                        </h2>
                    </div>

                    <div className="bg-gray-200 rounded-xl h-[2px]"></div>
                    <div className="flex flex-col items-center">
                        <img
                            src={testQRCode}
                            alt="QR Code"
                            className="max-w-[250px]"
                        />
                        <button
                            className="text-3xl mb-4"
                            onClick={handleDownload}
                        >
                            <FiDownload />
                        </button>
                        <div className="flex w-full justify-evenly items-center">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    // handleCreatePassObject();
                                }}
                            >
                                REPLACE WITH APPLE
                            </a>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleCreatePassObject();
                                }}
                            >
                                <img
                                    src={GoogleWalletBadge}
                                    alt="Add to Google Wallet"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
