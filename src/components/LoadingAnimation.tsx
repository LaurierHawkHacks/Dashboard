import { Logo } from "@assets";

interface LoadingAnimationProps {
    text?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ text }) => {
    return (
        <div className="flex h-screen items-center justify-center flex-col">
            <img
                className="w-12 h-12 md:w-16 md:h-16 motion-safe:animate-bounce"
                src={Logo}
                alt="Loading Animation"
            />
            
            <p className="text-lg md:text-2xl">
                {text || "Loading super awesome portal..."}
            </p>
         
            <p className="text-md md:text-lg text-gray-500">
                Please be paitent, <u> don't refresh! </u>
            </p>
        </div>
    );
};
