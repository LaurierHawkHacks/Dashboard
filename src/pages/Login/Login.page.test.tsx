import { render, screen, within } from "@testing-library/react";
import { LoginPage } from "./Login.page";
import { mockUseAuth } from "@mocks/providers";
import userEvent from "@testing-library/user-event";

vi.mock("@providers");

describe("Login Page", () => {
    it("should render HawkHacks Hacker Portal Heading", () => {
        mockUseAuth.mockReturnValue({
            login: vi.fn(),
            createaAccount: vi.fn(),
            currentUser: null,
        });
        render(<LoginPage />);
        expect(
            screen.getByRole("heading", {
                level: 1,
                name: /hawkhacks hacker portal/i,
            })
        ).toBeInTheDocument();
    });

    it("should render a form with email, password, and submit button", () => {
        mockUseAuth.mockReturnValue({
            login: vi.fn(),
            createaAccount: vi.fn(),
            currentUser: null,
        });
        render(<LoginPage />);

        const form = screen.getByRole("form");

        expect(within(form).getByLabelText(/email/i)).toBeInTheDocument();
        expect(within(form).getByLabelText(/email/i)).toBeEnabled();
        expect(within(form).getByLabelText(/password/i)).toBeInTheDocument();
        expect(within(form).getByLabelText(/password/i)).toBeEnabled();
        expect(
            within(form).getByRole("button", { name: /log in/i })
        ).toBeInTheDocument();
        expect(
            within(form).getByRole("button", { name: /log in/i })
        ).toBeEnabled();
    });

    it("should switch log in form to create account form", async () => {
        const user = userEvent.setup();
        render(<LoginPage />);

        const switchBtn = screen.getByRole("button", {
            name: /create account/i,
        });
        await user.click(switchBtn);

        const form = screen.getByRole("form");

        expect(within(form).getByLabelText(/email/i)).toBeInTheDocument();
        expect(within(form).getByLabelText(/email/i)).toBeEnabled();
        const passwordFields = within(form).getAllByLabelText(/password/i);
        expect(passwordFields).toHaveLength(2);
        passwordFields.forEach((field) => {
            expect(field).toBeInTheDocument();
            expect(field).toBeEnabled();
            expect(field.getAttribute("minLength")).toBe("8");
        });
        expect(
            within(form).getByRole("button", { name: /create account/i })
        ).toBeInTheDocument();
        expect(
            within(form).getByRole("button", { name: /create account/i })
        ).toBeEnabled();
    });
});
