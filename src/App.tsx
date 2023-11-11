import Logo from "@assets/logo.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages";
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
