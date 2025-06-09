import { getTicketData } from "@/services/firebase/ticket";
import { useQuery } from "@tanstack/react-query";

export function useTicketData(ticketId: string) {
	return useQuery({
		queryKey: ["ticketData", ticketId],
		queryFn: () => getTicketData(ticketId),
	});
}
