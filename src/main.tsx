import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Router } from "@utils";
import { AuthProvider } from "@providers";
import { NotificationProvider } from "./providers/notification.provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <NotificationProvider>
                <Router />
            </NotificationProvider>
        </AuthProvider>
    </React.StrictMode>
);
