
// setup precondition and postcondition
export const Form = () => {
    return (
        // <form action="trigger the loginEmailPassword function">
        // Todo: add a html form interface for this component?
        <form>
            <div>
                <label>Email</label>
                <input type="email" id="email" name="email" />
            </div>
            <div>
                <label>Password</label>
                <input type="password" id="password" name="password" />
            </div>
        </form>
    );
};
