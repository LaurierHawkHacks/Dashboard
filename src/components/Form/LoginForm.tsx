import React from "react";
import { Navigate } from "react-router-dom";
import { Form } from "./Form";
import { Button } from "../Button/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";

// types and interfaces
interface LoginFormDataValue {
    email: string;
    password: string;
}

const loginEmailPassword = async (
    formData: LoginFormDataValue,
    setUserState
) => {
    const email = formData.email;
    const password = formData.password;

    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        setUserState((user) => {
            return {
                ...user,
                user: userCredential.user,
            };
        });
    } catch (error) {
        console.log(`Error: ${error}`);
        setUserState((user) => {
            return {
                ...user,
                error,
            };
        });
    }
};

export const LoginForm = () => {
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });
    const [userState, setUserState] = React.useState({
        user: null,
        error: null,
    });

    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginEmailPassword(formData, setUserState);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value,
            };
        });
    };

    return (
        <Form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
            {userState.user !== null && <Navigate to="/admin" replace={true} />}

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                    Your email
                </label>
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 w-full p-2.5"
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                    Password
                </label>
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 w-full p-2.5"
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                />
            </div>

            {!userState.error ? (
                ""
            ) : (
                <p className="error-msg text-red-500">Error~</p>
            )}

            <Button
                type="submit"
                className="hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
                Sign In
            </Button>
        </Form>
    );
};
