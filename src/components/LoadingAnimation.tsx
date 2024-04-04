import { Logo } from "@assets";

export const LoadingAnimation: React.FC = () => {
    return (
        <div className="flex h-screen items-center justify-center">
            <p className="text-lg md:text-2xl">
                Loading super awesome portal...
            </p>
            <img
                className="w-12 h-12 md:w-16 md:h-16 motion-safe:animate-bounce"
                src={Logo}
                alt="Loading Animation"
            />
        </div>
    );
};
