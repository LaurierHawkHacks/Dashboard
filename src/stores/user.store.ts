import type { Socials, TeamData } from "@/services/firebase/types";
import { create } from "zustand";

export interface UserStore {
	socials: Socials | null;
	setSocials: (socials: Socials | null) => void;

	team: TeamData | null;
	setTeam: (team: TeamData | null) => void;
	updateTeamName: (name: string) => void;

	profilePictureUrl: string | null;
	setProfilePictureUrl: (url: string | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
	// Socials
	socials: null,
	setSocials: (socials) =>
		set((state) => {
			state.socials = socials;
			return state;
		}),

	// Team
	team: null,
	setTeam: (team) =>
		set((state) => {
			state.team = team;
			return state;
		}),
	updateTeamName: (name: string) =>
		set((state) => {
			if (state.team) {
				state.team.teamName = name;
			}
			return state;
		}),

	profilePictureUrl: null,
	setProfilePictureUrl: (url) =>
		set((state) => {
			state.profilePictureUrl = url;
			return state;
		}),
}));
