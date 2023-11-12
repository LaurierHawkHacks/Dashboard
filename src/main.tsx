import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import Router from "@/utils/Router";
import { AuthProvider } from "@/providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </React.StrictMode>
);
