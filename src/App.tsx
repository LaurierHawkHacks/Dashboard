import Logo from "@assets/logo.svg";
import { Button } from "./components/Button/Button";

function App() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <img src={Logo} alt="Hawk Hacks Logo" />
            <Button />
        </div>
    );
}

export default App;
