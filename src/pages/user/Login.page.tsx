import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@components";
import { useAuth } from "@providers";
import { routes } from "../../utils/Router";

const UserLoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const authProvider = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await authProvider.login(email, password);
        navigate(routes.profile);
    };

    return (
        <div>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div className="email">
                    <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium"
                    >
                        Your email
                    </label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 w-full p-2.5"
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="password">
                    <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium"
                    >
                        Password
                    </label>
                    <input
                        className="bg-gray-50 border border-gray-300 text-gray-900 w-full p-2.5"
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button
                    type="submit"
                    className="hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    LOG IN
                </Button>
                <p>
                    Does not have an account? <a href="#">Signup</a>
                </p>
            </form>
        </div>
    );
};

export { UserLoginPage };
