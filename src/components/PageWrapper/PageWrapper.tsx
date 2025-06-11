import { Navbar } from "@components";
import { twMerge } from "tailwind-merge";

interface PageWrapperProps {
	variant?: "default" | "tight";
	title: string;
	subTitle: string;
	children: React.ReactNode;
}

export const PageWrapper = ({
	variant = "default",
	title,
	subTitle,
	children,
}: PageWrapperProps) => {
	return (
		<div className="flex flex-col">
			<Navbar>
				{/* right hand side */}
				<div className="flex flex-col flex-1 min-h-0 min-w-0">
					<div className="md:sticky top-0 z-10 shrink-0 px-6 md:py-8 py-2 border-b-2 border-b-gray-300 bg-white">
						<h1 className="text-xl md:text-4xl text-gray-800 font-bold font-sans">
							{title}
						</h1>
						<p className="text-md md:text-xl text-gray-500 md:mt-4 font-sans whitespace-pre-line">
							{subTitle}
						</p>
						<p className="text-gray-800 mt-2">
							Having trouble? Get help in our{" "}
							<a
								href="https://discord.com/invite/GxwvFEn9TB"
								target="_blank"
								rel="noopener noreferrer"
								className="text-sky-600 font-bold underline"
							>
								Discord
							</a>{" "}
							support channel.
						</p>
					</div>
					<div
						className={twMerge(
							"flex flex-col flex-1 min-h-0 px-6 py-6",
							variant === "tight" && "p-0",
						)}
					>
						{children}
					</div>
				</div>
			</Navbar>
		</div>
	);
};
