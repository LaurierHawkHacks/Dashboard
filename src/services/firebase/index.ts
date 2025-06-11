import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { ReCaptchaV3Provider, initializeAppCheck } from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);
// @ts-ignore self refers to the window object that is used by the appcheck in debug mode
self.FIREBASE_APPCHECK_DEBUG_TOKEN =
	import.meta.env.VITE_FIREBASE_APPCHECK_DEBUG_TOKEN;
initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider(import.meta.env.VITE_APP_CHECK_KEY),
	isTokenAutoRefreshEnabled: true,
});

// connect to emulators if not in prod
if (!import.meta.env.PROD && import.meta.env.VITE_APP_ENV === "development") {
	connectFirestoreEmulator(firestore, window.location.hostname, 8080);
	connectAuthEmulator(auth, `http://${window.location.hostname}:9099`, {
		disableWarnings: true,
	});
	connectStorageEmulator(storage, window.location.hostname, 9199);
	connectFunctionsEmulator(functions, window.location.hostname, 5001);
}
