import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Placeholder } from "@pages";

const Router = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Placeholder />} />
        </Routes>
    </BrowserRouter>
);

export { Router };