import { LoginForm } from "@/components";
import "./LoginPage.css";

const LoginPage = () => {
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Sign in to your account
            </h1>
            <LoginForm />
        </div>
    );
};

export default LoginPage;