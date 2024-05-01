import { httpsCallable } from "firebase/functions";
import { functions } from "@/services/firebase";
import { Button } from '@components';

const MyticketPage = () => {
    const issueTicket = async () => {
        try {
            const createTicket = httpsCallable(functions, "createTicket");
            const ticketResult = await createTicket();
            const ticketData = ticketResult.data as { url?: string };
            if (ticketData.url) {
                window.location.href = ticketData.url; // Redirects user to download the pass
                alert('Ticket has been issued and your pass is ready to add to Apple Wallet!');
            } else {
                alert('Ticket has been issued but could not generate Apple Wallet pass.');
            }
        } catch (error) {
            console.error("Failed to issue ticket:", error);
            alert('Failed to issue ticket.');
        }
    };

    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center">
                <Button onClick={issueTicket}>
                    Issue Ticket and Add to Apple Wallet
                </Button>
            </div>
        </div>
    );
};

export { MyticketPage };