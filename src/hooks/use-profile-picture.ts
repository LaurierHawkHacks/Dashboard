import { useUserStore } from "@/stores/user.store";

export const useProfilePicture = () => {
	const profilePictureUrl = useUserStore((state) => state.profilePictureUrl);
	const setProfilePictureUrl = useUserStore((state) => state.setProfilePictureUrl);
 
	return {
		profilePictureUrl,
		setProfilePictureUrl,
	};
}; 