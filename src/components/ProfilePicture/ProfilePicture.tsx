import { useProfilePicture } from "@/hooks/use-profile-picture";
import { useAuth } from "@/providers";
import { Image, Box } from "@chakra-ui/react";

interface ProfilePictureProps {
	size?: string | number;
	fallbackSrc?: string;
	borderRadius?: string;
	className?: string;
}

export const ProfilePicture = ({ 
	size = "40px", 
	fallbackSrc = "/default-profile.png",
	borderRadius = "full",
	className = ""
}: ProfilePictureProps) => {
	const { profilePictureUrl } = useProfilePicture();
	const { currentUser } = useAuth();

	// priority: 1. custom uploaded profile picture, 2. auth provider photo, 3. default placeholder
	// i literally couldn't think of a better way to do this
	const imageSrc = profilePictureUrl || currentUser?.photoURL;

	return (
		<Image
			src={imageSrc || ""}
			alt="Profile picture"
			width={size}
			height={size}
			borderRadius={borderRadius}
			objectFit="cover"
			className={className}
			onError={(e) => {
				// if image fails to load, use the fallback
				const target = e.currentTarget as HTMLImageElement;
				if (fallbackSrc && target.src !== fallbackSrc) {
					target.src = fallbackSrc;
				}
			}}
		/>
	);
}; 