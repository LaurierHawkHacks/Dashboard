import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@components/Button/Button";
import { useAuth } from "@/providers/AuthProvider";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<null | unknown>(null);

    const authProvider = useAuth();
    const navigate = useNavigate();

    const loginWithEmailAndPassword = async (email: string, password: string) => {
        try {
            await authProvider.login(email, password);
            navigate("/admin", { replace: true });
        } catch (errorObject) {
            setError(errorObject);
        }
    };

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginWithEmailAndPassword(email, password);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        if (event.target.name === "email") {
            setEmail(value);
        } else {
            setPassword(value);
        }
    };

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl">
                Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
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
                        onChange={handleChange}
                        value={email}
                    />
                </div>
                <div>
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
                        onChange={handleChange}
                        value={password}
                    />
                </div>

                {!error ? (
                    ""
                ) : (
                    <p className="text-red-500">
                        Wrong Credential. Try Again You Dummy🥹
                    </p>
                )}

                <Button
                    type="submit"
                    className="hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                    Sign In
                </Button>
            </form>
        </div>
    );
};

export default LoginPage;
