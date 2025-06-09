import { useAuth } from "@/providers";
import { Modal } from "../Modal";

interface QRCodeResultModalProps {
	decodedText: string | null;
	onClose: () => void;
}

export function QRCodeResultModal(props: QRCodeResultModalProps) {
	const { currentUser } = useAuth();

	return (
		<Modal
			title="QR Code Scanned"
			subTitle=""
			open={!!props.decodedText}
			onClose={props.onClose}
		>
			{props.decodedText}
		</Modal>
	);
}
