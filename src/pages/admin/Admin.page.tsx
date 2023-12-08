import { AdminNavbar } from "@components";

export const AdminPage = () => {
    return (
        <div>
            <AdminNavbar />
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <main className="py-8">
                    <h1>Welcome to admin page!!!</h1>
                </main>
            </div>
        </div>
    );
};
