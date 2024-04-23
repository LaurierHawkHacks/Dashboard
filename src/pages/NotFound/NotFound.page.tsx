import { Link } from "react-router-dom";

export const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gradient-to-b from-[#F8C1AA] via-[#F8C1AA] to-[#FDDD87]">
            <div className="absolute inset-0 overflow-hidden">
                <img src="/src/assets/404-top-left.svg" alt="" className="absolute top-0 left-0 md:w-[70vh] w-[50vh] object-cover" />
                <img src="/src/assets/404-top-right.svg" alt="" className="absolute top-0 right-0 md:w-[70vh] w-[50vh] object-cover" />
                <img src="/src/assets/404-bottom-right.svg" alt="" className="absolute bottom-0 right-0 w-[30vh] sm:w-[42vh] md:w-[56vh] lg:w-[70vh] object-cover" />
                <img src="/src/assets/404-bottom-left.svg" alt="" className="absolute bottom-0 left-0 sm:w-[36vh] md:w-[42vh] lg:w-[64vh] w-[22vh] object-cover object-bottom translate-y-1/4" />
            </div>
            <div className="z-10">
                <h1 className="text-6xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-800 to-cyan-400">
                    404 Error
                </h1>
                <p className="my-4 text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl font-semibold text-[#2B6469] font-raleway">Uh oh... Something weird happened.</p>
                <Link to="/" className="inline-block bg-gradient-to-r from-[#2B6469] to-[#00CEDB] hover:from-[#27695E] hover:to-[#00B2AA] text-white font-bold py-2 px-4 rounded transition-all duration-300 ease-in-out">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};
