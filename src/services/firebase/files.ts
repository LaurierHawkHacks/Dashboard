import {
	deleteObject,
	getBlob,
	getMetadata,
	ref,
	uploadBytes,
} from "firebase/storage";

import { storage } from "@/services/firebase";
import { logEvent } from "@/services/firebase/log";

export async function uploadMentorResume(file: File, uid: string) {
	try {
		const resumeRef = ref(
			storage,
			`/resumes/${uid}-mentor-resume${file.name.substring(
				file.name.lastIndexOf("."),
			)}`,
		);
		const snap = await uploadBytes(resumeRef, file, {
			customMetadata: { owner: uid },
		});
		return snap.ref.toString();
	} catch (e) {
		logEvent("error", {
			event: "upload_mentor_resume_error",
			message: (e as Error).message,
			name: (e as Error).name,
			stack: (e as Error).stack,
		});
		throw e;
	}
}

export async function uploadGeneralResume(file: File, uid: string) {
	try {
		const resumeRef = ref(
			storage,
			`/resumes/${uid}-general-resume${file.name.substring(
				file.name.lastIndexOf("."),
			)}`,
		);
		const snap = await uploadBytes(resumeRef, file, {
			customMetadata: { owner: uid },
		});
		return snap.ref.toString();
	} catch (e) {
		logEvent("error", {
			event: "upload_general_resume_error",
			message: (e as Error).message,
			name: (e as Error).name,
			stack: (e as Error).stack,
		});
		throw e;
	}
}

export async function deleteGeneralResume(gsUrl: string) {
	try {
		// Extract the file path from the gs:// URL
		// The format is: gs://bucket-name/path/to/file
		const bucketName = gsUrl.split("/")[2];
		const filePath = gsUrl.substring(
			gsUrl.indexOf(bucketName) + bucketName.length + 1,
		);

		// Create a reference to the file
		const fileRef = ref(storage, filePath);

		// Delete the file
		await deleteObject(fileRef);
	} catch (e) {
		logEvent("error", {
			event: "delete_general_resume_error",
			message: (e as Error).message,
			name: (e as Error).name,
			stack: (e as Error).stack,
		});
		throw e;
	}
}

export async function getResume(gs: string) {
	const gsRef = ref(storage, gs);
	try {
		const metadata = await getMetadata(gsRef);
		const blob = await getBlob(gsRef);
		const blobUrl = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = blobUrl;
		link.download = metadata.name;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} catch (e) {
		logEvent("error", {
			event: "get_resume_error",
		});
	}
}

export async function getResumeURL(gs: string) {
	const gsRef = ref(storage, gs);
	try {
		const blob = await getBlob(gsRef);
		const blobUrl = URL.createObjectURL(blob);
		return blobUrl;
	} catch (e) {
		logEvent("error", {
			event: "get_resume_error",
		});
	}
}

export async function uploadProfilePicture(file: File, uid: string) {
	try {
		const imageRef = ref(
			storage,
			`/profile-pictures/${uid}-profile${file.name.substring(
				file.name.lastIndexOf("."),
			)}`,
		);
		const snap = await uploadBytes(imageRef, file, {
			customMetadata: { owner: uid },
		});
		return snap.ref.toString();
	} catch (e) {
		logEvent("error", {
			event: "upload_profile_picture_error",
			message: (e as Error).message,
			name: (e as Error).name,
			stack: (e as Error).stack,
		});
		throw e;
	}
}

export async function getProfilePictureURL(gs: string) {
	const gsRef = ref(storage, gs);
	try {
		const blob = await getBlob(gsRef);
		const blobUrl = URL.createObjectURL(blob);
		return blobUrl;
	} catch (e) {
		logEvent("error", {
			event: "get_profile_picture_error",
		});
		return null;
	}
}
