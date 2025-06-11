import { getHackathonDates } from "@/services/firebase/hackathon";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Hook for accessing hackathon dates data
 */

const CURRENT_HACKATHON_YEAR = "2025";

export const useHackathonDates = () => {
	const { data: hackathonDates = null, isLoading } = useQuery({
		queryKey: ["hackathons", CURRENT_HACKATHON_YEAR],
		queryFn: () => getHackathonDates(CURRENT_HACKATHON_YEAR),
	});

	return {
		hackathonDates: hackathonDates,
		isLoading,
	};
};
