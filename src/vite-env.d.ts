/// <reference types="vite/client" />
interface ImportMetaEnv {
    VITE_FIREBASE_API_KEY: string;
    VITE_FIREBASE_AUTH_DOMAIN: string;
    VITE_FIREBASE_PROJECT_ID: string;
    VITE_FIREBASE_STORAGE_BUCKET: string;
    VITE_FIREBASE_MESSAGING_SENDER_ID: string;
    VITE_FIREBASE_APP_ID: string;
    VITE_FIREBASE_MEASUREMENT_ID: string;
    VITE_CONNECT_AUTH_EMU: string;
    VITE_GOOGLE_CLIENT_ID: string;
    VITE_APP_VERSION: string;
    VITE_APP_CHECK_KEY: string;
    VITE_TICKETS_COLLECTION: string;
    VITE_USERS_COLLECTION: string;
    VITE_APPLICATIONS_COLLECTION: string;
    VITE_FIREBASE_APPCHECK_DEBUG_TOKEN: string;
    VITE_RSVP_COLLECTION: string;
}

declare const APP_VERSION: string;
