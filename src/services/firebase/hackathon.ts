import { firestore } from "@/services/firebase";
import { logEvent } from "@/services/firebase/log";
import { doc, getDoc } from "firebase/firestore";

const HACKATHONS_COLLECTION = "hackathons";

export interface HackathonDates {
	appOpenDate: string;
	appCloseDate: string;
}

export async function getHackathonDates(year:string): Promise<HackathonDates> {
	try {
		const docRef = doc(firestore, HACKATHONS_COLLECTION, year);
		const docSnap = await getDoc(docRef);

		if (!docSnap.exists()) {
			return null;
		}

		const data = docSnap.data() as HackathonDates;
		return data;
	} catch (e) {
		logEvent("error", {
			event: "get_hackathon_dates_error",
			message: (e as Error).message,
			name: (e as Error).name,
			stack: (e as Error).stack,
		});
		return null;
	}
}


//Redo logic using getDocs and query as in application.ts 