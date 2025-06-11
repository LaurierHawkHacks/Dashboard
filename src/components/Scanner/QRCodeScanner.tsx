import { useQRCodeReader } from "@/hooks/use-qr-code-reader";
import { Alert } from "@chakra-ui/react";
import { Modal } from "../Modal";

interface QRCodeScannerProps {
	videoDeviceId: string;
}

export function QRCodeScanner(props: QRCodeScannerProps) {
	const { videoPreviewRef, decodedText, clearDecodedText, error } =
		useQRCodeReader(props.videoDeviceId);

	return (
		<div>
			{error && (
				<Alert.Root status="error">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>{error}</Alert.Description>
					</Alert.Content>
				</Alert.Root>
			)}

			{/* biome-ignore lint/a11y/useMediaCaption: it's a live feed not a video */}
			<video ref={videoPreviewRef} />
			{decodedText && (
				<Modal
					title="QR Code Scanned"
					subTitle=""
					open={!!decodedText}
					onClose={clearDecodedText}
				>
					{decodedText}
				</Modal>
			)}
		</div>
	);
}
