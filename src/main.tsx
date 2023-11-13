import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { Router } from "@utils";
import { AuthProvider } from "@/providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </React.StrictMode>
);
