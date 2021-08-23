import makeStyles from "@material-ui/styles/makeStyles";
import { Icon } from "@assets";

const useStyles = makeStyles({
    icon: {
        width: "auto",
        height: "3.4em",
    },
});

function BrandingIcon({ ...rest }) {
    const classes = useStyles();
    return <img className={classes.icon.concat(" spin-hover-animation")} src={Icon} alt="Hawk Hacks Icon" {...rest} />
}

export default BrandingIcon;