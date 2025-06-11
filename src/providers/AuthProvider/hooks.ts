import { useContext } from "react";
import { AuthContext } from "./context";

export const useAuth = () => useContext(AuthContext);

export const useUser = () => {
	const ctx = useContext(AuthContext);
	const user = ctx.currentUser;
	return {
		user: user,
		role: {
			isHacker: user?.type === "hacker",
			isVolunteerT1: user?.type === "volunteer.t1",
			isVolunteerT2: user?.type === "volunteer.t2",
			isMentor: user?.type === "mentor",
			isSponsor: user?.type === "sponsor",
			isSpeaker: user?.type === "speaker",
			isGuest: user?.type === "guest",
			isAdmin: user?.type === "admin",
			isVip: user?.type === "vip",
		},
	};
};
