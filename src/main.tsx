import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Router } from "@/navigation";
import { AuthProvider } from "@providers";
import { NotificationProvider } from "./providers/notification.provider";

// for funsies
console.log("Hey, we are not hiring at the moment ^_^");
console.log(`App version: ${import.meta.env.VITE_APP_VERSION}`);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <NotificationProvider>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </NotificationProvider>
    </React.StrictMode>
);
