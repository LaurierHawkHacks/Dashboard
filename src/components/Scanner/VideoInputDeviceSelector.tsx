import { Alert, CloseButton, RadioCard, VStack } from "@chakra-ui/react";
import { BrowserCodeReader } from "@zxing/browser";
import { useEffect, useState } from "react";

interface VideoInputDeviceSelectorProps {
	onVideoDeviceIdSelected: (videoDeviceId: string | null) => void;
}

export function VideoInputDeviceSelector(props: VideoInputDeviceSelectorProps) {
	const [cameraPermissionState, setCameraPermissionState] =
		useState<PermissionState>("prompt");
	const [selectedDevice, setSelectedDevice] =
		useState<MediaDeviceInfo | null>();

	const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>(
		[],
	);

	useEffect(() => {
		const abortController = new AbortController();
		async function init() {
			try {
				await navigator.mediaDevices.getUserMedia({
					video: { facingMode: "environment" },
				});
			} catch (error) {
				console.error("Error getting camera permissions:", error);
				if (abortController.signal.aborted) return;
				setCameraPermissionState("denied");
				return;
			}

			if (abortController.signal.aborted) return;
			setCameraPermissionState("granted");
			const devices = await BrowserCodeReader.listVideoInputDevices();
			if (abortController.signal.aborted) return;
			setVideoInputDevices(devices);
		}
		init();

		return () => abortController.abort();
	}, []);

	function onValueChange(details: { value: string | null }) {
		if (details.value === null) {
			setSelectedDevice(null);
			localStorage.removeItem("scannerDeviceId");
			props.onVideoDeviceIdSelected(null);
			return;
		}

		const deviceInfo = videoInputDevices.find(
			(device) => device.deviceId === details.value,
		);
		if (!deviceInfo) throw new Error("Device not found");

		localStorage.setItem("scannerDeviceId", deviceInfo.deviceId);
		setSelectedDevice(deviceInfo);
		props.onVideoDeviceIdSelected(deviceInfo.deviceId);
	}

	useEffect(() => {
		if (cameraPermissionState !== "granted") return;
		if (videoInputDevices.length === 0) return;
		const storedDeviceId = localStorage.getItem("scannerDeviceId");
		if (storedDeviceId === null) return;
		onValueChange({ value: storedDeviceId });
	}, [cameraPermissionState, videoInputDevices]);

	if (cameraPermissionState === "prompt") {
		return (
			<Alert.Root status="info">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Camera Permission Required</Alert.Title>
					<Alert.Description>
						Please grant camera permissions to use the QR code scanner.
					</Alert.Description>
				</Alert.Content>
			</Alert.Root>
		);
	}

	if (cameraPermissionState === "denied") {
		return (
			<Alert.Root status="error">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Camera Permission Denied</Alert.Title>
					<Alert.Description>
						Please grant camera permissions to use the QR code scanner. You may
						need to check your browser settings. Refresh the page to try again.
					</Alert.Description>
				</Alert.Content>
			</Alert.Root>
		);
	}

	if (videoInputDevices.length === 0) {
		return (
			<Alert.Root status="info">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>No video devices found</Alert.Title>
				</Alert.Content>
			</Alert.Root>
		);
	}

	if (selectedDevice) {
		return (
			<Alert.Root status="neutral">
				<Alert.Indicator />
				<Alert.Title>Video device: {selectedDevice.label}</Alert.Title>
				<CloseButton
					pos="absolute"
					top="2"
					insetEnd="2"
					size="sm"
					onClick={() => onValueChange({ value: null })}
				/>
			</Alert.Root>
		);
	}

	return (
		<RadioCard.Root onValueChange={onValueChange}>
			<RadioCard.Label>Select video device</RadioCard.Label>
			<VStack gap={1} p={1} align="stretch">
				{videoInputDevices.map((device) => (
					<RadioCard.Item key={device.deviceId} value={device.deviceId}>
						<RadioCard.ItemHiddenInput />
						<RadioCard.ItemControl>
							<RadioCard.ItemText>{device.label}</RadioCard.ItemText>
							<RadioCard.ItemIndicator />
						</RadioCard.ItemControl>
					</RadioCard.Item>
				))}
			</VStack>
		</RadioCard.Root>
	);
}
