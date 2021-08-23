import React from "react";
import { FormButton, FormTitle, PageBackground } from "@atoms";

const LandingPage = ({ handleLogout }) => {
    return(
        <PageBackground>
            <FormTitle variant="h4">Welcome Hawk!</FormTitle>
            <FormButton type="submit" onClick={handleLogout} label="Logout">Logout</FormButton>
        </PageBackground>
    )
}

export default LandingPage;