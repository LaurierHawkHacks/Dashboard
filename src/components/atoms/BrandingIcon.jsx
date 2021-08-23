import makeStyles from "@material-ui/styles/makeStyles";
import { Icon } from "@assets";

const useStyles = makeStyles({
    icon: {
        width: "auto",
        height: "3.4em",
        // spins up to 100 times before stopping (unwinds when no longer hovering)
        transition: "150s ease",
        "&:hover": {
            transition: "350s linear",
            transform: "rotate(36000deg)",
            cursor: "pointer",
        },
    },
});

function BrandingIcon({ ...rest }) {
    const classes = useStyles();
    return <img className={classes.icon} src={Icon} alt="Hawk Hacks Icon" {...rest} />
}

export default BrandingIcon;