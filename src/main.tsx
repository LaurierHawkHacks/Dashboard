import React from "react";
import ReactDOM from "react-dom/client";

import { Toaster } from "@/components/ui/toaster";

import { Provider } from "@/components/ui/provider";
import { AuthProvider } from "@/providers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { paths } from "./data/paths";

import {
	AdminPage,
	HomePage,
	LoginPage,
	NetworkingPage,
	NotFoundPage,
	PerksPage,
	SchedulePage,
	TicketPage,
	VerifyEmailPage,
} from "@/pages";
import { ApplicationPage } from "@/pages/Application/Application.page";
import { JoinTeamPage } from "@/pages/JoinTeam.page";
import { MyTeamPage } from "@/pages/MyTeam.page";
import { AdminScanPage } from "@/pages/admin/AdminScan.page";
import { AdminManageEventsPage } from "@/pages/admin/ManageEvents.page";
import { AdminViewTicketPage } from "@/pages/admin/ViewTicket.page";
import { PostSubmissionPage } from "@/pages/miscellaneous/PostSubmission.page";
import { VerifyRSVP } from "@/pages/miscellaneous/VerifyRSVP.page";
import { ViewTicketPage } from "@/pages/miscellaneous/ViewTicket.page";
import { LoggedInUserOutlet } from "./providers/outlets";

// for funsies
console.log("If you found this, you are a curious one! 😄");
console.log("Impressed by what you see and want to make a difference?");
console.log(
	"Keep an eye out on Discord for when applications open and join the team next year!",
);
console.log(`Commit hash: ${__GIT_COMMIT_HASH__}`);
console.log(`App env: ${import.meta.env.VITE_APP_ENV}`);

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");
if (!rootElement) {
	throw new Error("Element with id 'root' not found");
}

ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<Provider>
			<QueryClientProvider client={queryClient}>
				<Toaster />
				<AuthProvider>
					<BrowserRouter>
						<Routes>
							<Route path={paths.login} element={<LoginPage />} />
							<Route path={paths.verifyEmail} element={<VerifyEmailPage />} />

							<Route element={<LoggedInUserOutlet />}>
								<Route path={paths.home} element={<HomePage />} />
								<Route path={paths.schedule} element={<SchedulePage />} />
								<Route path={paths.networking} element={<NetworkingPage />} />
								<Route path={paths.myTicket} element={<TicketPage />} />
								<Route path={paths.application} element={<ApplicationPage />} />
								<Route
									path={paths.submitted}
									element={<PostSubmissionPage />}
								/>
								<Route path={paths.verifyRSVP} element={<VerifyRSVP />} />

								<Route path={paths.myTeam} element={<MyTeamPage />} />
								<Route path={paths.joinTeam} element={<JoinTeamPage />} />
								<Route path={paths.ticket} element={<ViewTicketPage />} />
								<Route path={paths.perks} element={<PerksPage />} />
								<Route path={paths.admin} element={<AdminPage />} />
								<Route path={paths.adminScan} element={<AdminScanPage />} />
								<Route
									path={paths.adminViewTicket}
									element={<AdminViewTicketPage />}
								/>
								<Route
									path={paths.adminManageEvents}
									element={<AdminManageEventsPage />}
								/>
							</Route>

							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</BrowserRouter>
				</AuthProvider>
			</QueryClientProvider>
		</Provider>
	</React.StrictMode>,
);
