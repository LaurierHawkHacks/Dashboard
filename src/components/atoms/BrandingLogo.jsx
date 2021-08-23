import { LogoBlack, LogoWhite } from "@assets";

function BrandingLogo({ variant="black", ...rest }) {
    switch (variant.toLowerCase()) {
        case "black":
        case "dark":
            return <img src={LogoBlack} alt="Hawk Hacks Logo" {...rest} />
        case "white":
        case "light":
            return <img src={LogoWhite} alt="Hawk Hacks Logo" {...rest} />
        default:
            return <img src={LogoBlack} alt="Hawk Hacks Logo" {...rest} />

    };
}

export default BrandingLogo;