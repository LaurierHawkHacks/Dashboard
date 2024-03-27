export const Navbar = () => {
    return (
        <div className="w-1/6 bg-white p-4">
            <div className="flex gap-4 items-center justify-center">
                <a className="nav-logo" href="/">
                    <img
                        className="h-24 w-24"
                        src="./src/assets/logo.svg"
                        alt="HawkHacks Logo"
                    />
                </a>
                <p>HawkHacks</p>
            </div>

            <aside className="sidebar">
                <nav className="nav">
                    <ul className="nav-list">
                        <li className="nav-item">
                            <a href="/" className="nav-link">
                                Home
                            </a>
                            
                        </li>
                        <li className="nav-item">
                            <a href="/user" className="nav-link">
                                Schedule
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/not-found" className="nav-link">
                                Networking
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="/not-found" className="nav-link">
                                Ticket
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    );
};
