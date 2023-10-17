import Logo from "@assets/logo.svg";
import classes from "@styles/App.module.css";

function App() {
    return (
        <div className={classes.container}>
            <img src={Logo} alt="Hawk Hacks Logo" />
        </div>
    );
}

export default App;
