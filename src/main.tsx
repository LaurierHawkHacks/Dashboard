import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Router } from "@/navigation";
import { AuthProvider } from "@providers";
import { NotificationProvider } from "./providers/notification.provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <NotificationProvider>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </NotificationProvider>
    </React.StrictMode>
);
