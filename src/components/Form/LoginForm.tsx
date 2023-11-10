import React from "react";
import { Form } from "./Form";
import { Button } from "../Button/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";

// setup precondition and postcondition
export const LoginForm = () => {
    interface LoginFormDataValue {
        email: string;
        password: string;
    }

    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
    });

    const loginEmailPassword = async (formData: LoginFormDataValue) => {
        const email = formData.email;
        const password = formData.password;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(`Error: ${error}`);
            // showLoginError;
        }
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        loginEmailPassword(formData);
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
        // Todo: add a html form interface for this component (done)
        // Todo: add action to handle the event (done)
        // Todo: connect the value of the input with the firebase (done)
        // Todo: 
        <Form onSubmit={handleFormSubmit}>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                />
            </div>
            <div>
                <label>Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                />
            </div>
            <Button type="submit">Login</Button>
        </Form>
    );
};
