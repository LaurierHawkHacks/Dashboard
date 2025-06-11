import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import { useDocumentVisibility } from "./use-document-visibility";

let lastPromise = Promise.resolve();

export function useQRCodeReader(videoDeviceId: string) {
	const videoPreviewRef = useRef<HTMLVideoElement>(null);
	const [decodedText, setDecodedText] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const isDocumentVisible = useDocumentVisibility();

	useEffect(() => {
		const abortController = new AbortController();

		function onDecodeQRCode(result: { getText(): string } | undefined) {
			if (!result) return;
			setDecodedText(result.getText());
		}

		async function initQRCodeReader() {
			if (!isDocumentVisible) return;
			if (abortController.signal.aborted) return;

			const codeReader = new BrowserQRCodeReader();
			let controls: IScannerControls;
			try {
				controls = await codeReader.decodeFromVideoDevice(
					videoDeviceId,
					videoPreviewRef.current ?? undefined,
					onDecodeQRCode,
				);
			} catch (error) {
				if (abortController.signal.aborted) return;
				const message =
					error instanceof Error
						? error.message
						: "An unknown error occurred while starting the QR code scanner";
				setError(message);
				return;
			}

			if (abortController.signal.aborted) {
				controls.stop();
				return;
			}
			abortController.signal.addEventListener("abort", () => controls.stop());
			setError(null);
		}

		// Wait for the previous promise to resolve before starting a new one
		// as the scanner must clean up before starting a new one
		lastPromise = lastPromise.then(initQRCodeReader);
		return () => abortController.abort();
	}, [videoDeviceId, isDocumentVisible]);

	// Pause/Play the video when a QR code is decoded/cleared, or when the document
	// becomes visible again and there is already decoded text
	useEffect(() => {
		const abortController = new AbortController();
		lastPromise = lastPromise.then(() => {
			if (!isDocumentVisible) return;
			if (abortController.signal.aborted) return;

			if (decodedText === null) {
				videoPreviewRef.current?.play();
			} else {
				videoPreviewRef.current?.pause();
			}
		});
		return () => abortController.abort();
	}, [decodedText, isDocumentVisible]);

	useEffect(() => {
		if (decodedText === null) return;
		// Note: Vibrate is only supported in Chrome
		window.navigator.vibrate?.(200);
	}, [decodedText]);

	function clearDecodedText() {
		setDecodedText(null);
	}

	return {
		videoPreviewRef,
		decodedText,
		clearDecodedText,
		error,
	};
}
