import { useAvailableRoutes } from "@/providers/routes.provider";
import { Link } from "react-router-dom";

export const AdminPage = () => {
    const { paths } = useAvailableRoutes();
    return (
        <div className="text-center rounded-xl border-2 border-black px-7 py-32 shadow-lg lg:mt-6 lg:block xl:mt-12">
            <h1 className="text-3xl font-bold">
                Time to Admininstrate!
            </h1>

            <br/>

            <ul>
                <li>
                    <Link
                        to={paths.adminManageEvents}
                        className="px-5 py-4 text-sm font-medium transition relative rounded-sm
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tbrand
                        disabled:cursor-not-allowed disabled:after:hidden disabled:bg-btn-gradient-disabled disabled:text-white disabled:hover:bg-gray-400 
                        bg-btn-gradient text-white hover:bg-[#3f9098] active:bg-[#214b4f]"
                    >
                        Manage Events/Foods
                    </Link>
                </li>
            </ul>

            <br />

            <p className="text-sm mt-4">
                (If you're unsure on how to use this page, contact Juan or Aidan.)
            </p>
        </div>
    );
};