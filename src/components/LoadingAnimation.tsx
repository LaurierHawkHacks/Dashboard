import { Logo } from "@assets";

interface LoadingAnimationProps {
    text?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ text }) => {
    return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-lg md:text-2xl">
                {text || "Loading super awesome portal..."}
            </p>
            <img
                className="w-12 h-12 md:w-16 md:h-16 motion-safe:animate-bounce"
                src={Logo}
                alt="Loading Animation"
            />
        </div>
    );
};
