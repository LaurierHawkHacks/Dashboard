import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

import { Router } from "@utils";
import { AuthProvider } from "@providers";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId="587778980690-d0vll2ts3ubnofb21kre5r3qb6959hfo.apps.googleusercontent.com">
        <React.StrictMode>
            <AuthProvider>
                <Router />
            </AuthProvider>
        </React.StrictMode>
    </GoogleOAuthProvider>,
);
