import { PageWrapper } from "@/components";
import { QRCodeScanner } from "@/components/Scanner/QRCodeScanner";
import { VideoInputDeviceSelector } from "@/components/Scanner/VideoInputDeviceSelector";
import { Alert, VStack } from "@chakra-ui/react";
import { useState } from "react";

export const AdminScanPage = () => {
	const hasMediaDevicesApi =
		"mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices;
	const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<
		string | null
	>(null);

	return (
		<PageWrapper
			title="Scan QR Code"
			subTitle="Scan QR codes using your device's camera"
		>
			{hasMediaDevicesApi ? (
				<VStack gap="2" align="stretch">
					<VideoInputDeviceSelector
						onVideoDeviceIdSelected={setSelectedVideoDeviceId}
					/>
					{selectedVideoDeviceId && (
						<QRCodeScanner videoDeviceId={selectedVideoDeviceId} />
					)}
				</VStack>
			) : (
				<Alert.Root status="error">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>Not supported</Alert.Title>
						<Alert.Description>
							The MediaDevices API is not supported in your browser. If you are
							running the development server, MediaDevices is only available in
							secure contexts; check the project contribution guide.
						</Alert.Description>
					</Alert.Content>
				</Alert.Root>
			)}
		</PageWrapper>
	);
};
