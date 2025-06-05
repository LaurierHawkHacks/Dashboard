import { Logo } from "@/assets";
import { paths } from "@/data/paths";
import { useAuth } from "@/providers";
import { Drawer, Portal } from "@chakra-ui/react";
import {
	CalendarDaysIcon,
	CodeBracketIcon,
	HomeIcon,
	ShareIcon,
	TicketIcon,
	UserGroupIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import {
	CalendarDaysIcon as CalendarDaysIconSolid,
	CodeBracketIcon as CodeBracketIconSolid,
	HomeIcon as HomeIconSolid,
	ShareIcon as ShareIconSolid,
	TicketIcon as TicketIconSolid,
	UserGroupIcon as UserGroupIconSolid,
} from "@heroicons/react/24/solid";
import Hamburger from "hamburger-react";
import { useState } from "react";
import { FiLogOut, FiMapPin } from "react-icons/fi";
import { RiDiscordLine } from "react-icons/ri";
import { RxStar, RxStarFilled } from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface NavItemProps {
	label: string;
	path: string;
	Icon: React.ComponentType<{ className?: string }>;
	ActiveIcon: React.ComponentType<{ className?: string }>;
	isActive?: boolean;
	hasNewContentNotification?: boolean;
	onClick?: () => void;
	target?: string;
}

function NavItem(props: NavItemProps) {
	const [didVisit, setDidVisit] = useState(
		window.localStorage.getItem(props.path) === "visited",
	);

	const IconElement = props.isActive ? props.ActiveIcon : props.Icon;

	function onLinkClicked() {
		setDidVisit(true);
		window.localStorage.setItem(props.path, "visited");
		props.onClick?.();
	}

	return (
		<Link
			to={props.path}
			className="w-full"
			onClick={onLinkClicked}
			target={props.target}
			rel="noopener noreferrer"
		>
			<li className="p-4 hover:bg-slate-100 duration-300 transition-colors rounded-md hover:text-black cursor-pointer flex items-center gap-2">
				<IconElement className="w-5 h-5" />
				<span className="relative">
					{props.label}

					{props.hasNewContentNotification && !didVisit && (
						<span className="absolute flex h-2 w-2 top-0 -right-2.5">
							<span className="h-full w-full rounded-full bg-orange-400 animate-ping absolute opacity-75" />
							<span className="h-full w-full rounded-full bg-orange-500" />
						</span>
					)}
				</span>
			</li>
		</Link>
	);
}

function NavItems({ onClickNavItem }: { onClickNavItem?: () => void }) {
	const { currentUser, logout } = useAuth();
	const location = useLocation();

	if (!currentUser) {
		return null;
	}

	return (
		<ul className="flex flex-col gap-4 w-full">
			<NavItem
				label="Location"
				path="https://maps.app.goo.gl/Fxic5XJBzZjHP4Yt5"
				target="_blank"
				Icon={FiMapPin}
				ActiveIcon={FiMapPin}
			/>
			{currentUser.emailVerified && (
				<>
					<NavItem
						isActive={location.pathname === paths.home}
						label="Home"
						path={paths.home}
						Icon={HomeIcon}
						ActiveIcon={HomeIconSolid}
						onClick={onClickNavItem}
					/>
					<NavItem
						isActive={location.pathname === paths.schedule}
						label="Schedule"
						path={paths.schedule}
						Icon={CalendarDaysIcon}
						ActiveIcon={CalendarDaysIconSolid}
						onClick={onClickNavItem}
					/>
					<NavItem
						isActive={location.pathname === paths.networking}
						label="Networking"
						path={paths.networking}
						Icon={ShareIcon}
						ActiveIcon={ShareIconSolid}
						onClick={onClickNavItem}
					/>
					<NavItem
						isActive={location.pathname === paths.myTicket}
						label="My Ticket"
						path={paths.myTicket}
						Icon={TicketIcon}
						ActiveIcon={TicketIconSolid}
						hasNewContentNotification
						onClick={onClickNavItem}
					/>
					<NavItem
						isActive={location.pathname === paths.application}
						label="Application"
						path={paths.application}
						Icon={CodeBracketIcon}
						ActiveIcon={CodeBracketIconSolid}
						onClick={onClickNavItem}
					/>
					<NavItem
						isActive={location.pathname === paths.myTeam}
						label="My Team"
						path={paths.myTeam}
						Icon={UserGroupIcon}
						ActiveIcon={UserGroupIconSolid}
						hasNewContentNotification
						onClick={onClickNavItem}
					/>
					<NavItem
						isActive={location.pathname === paths.perks}
						label="Perks"
						path={paths.perks}
						Icon={RxStar}
						ActiveIcon={RxStarFilled}
						hasNewContentNotification
						onClick={onClickNavItem}
					/>
				</>
			)}

			<NavItem
				label="Discord Support"
				path="https://discord.com/invite/GxwvFEn9TB"
				target="_blank"
				Icon={RiDiscordLine}
				ActiveIcon={RiDiscordLine}
			/>

			<div className="flex flex-1 flex-col justify-end">
				<NavItem
					label="Sign out"
					path="#"
					Icon={FiLogOut}
					ActiveIcon={FiLogOut}
					onClick={logout}
				/>
			</div>
		</ul>
	);
}

export const Navbar = ({ children }: React.PropsWithChildren) => {
	const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

	const navItems = <NavItems onClickNavItem={() => setMobileMenuOpen(false)} />;

	return (
		<div className="flex flex-col md:flex-row md:pl-72">
			<nav
				className={twMerge(
					"flex p-4 gap-2 justify-between border-b-2 border-gray-300 overflow-y-auto bg-white shrink-0",
					"md:h-screen md:fixed md:top-0 md:left-0 md:z-20 md:flex-col md:justify-normal md:border-b-0 md:border-r-2 md:font-medium md:text-cadetBlue md:w-72",
				)}
			>
				<Link className="flex gap-2 items-center" to={paths.home}>
					<img className="h-10 w-10 m-1" src={Logo} alt="HawkHacks Logo" />

					<span className="hidden md:block text-2xl font-bold text-black">
						HawkHacks
					</span>
				</Link>

				<div className="hidden md:flex flex-1">{navItems}</div>

				<div className="md:hidden">
					<Drawer.Root
						open={isMobileMenuOpen}
						onOpenChange={(e) => setMobileMenuOpen(e.open)}
					>
						<Drawer.Trigger asChild>
							<Hamburger
								toggled={isMobileMenuOpen}
								toggle={setMobileMenuOpen}
								size={24}
								color="black"
								label="Show navigation menu"
							/>
						</Drawer.Trigger>
						<Portal>
							<Drawer.Backdrop />
							<Drawer.Positioner>
								<Drawer.Content>
									<Drawer.Body className="pt-14">{navItems}</Drawer.Body>
									<Drawer.CloseTrigger>
										<XMarkIcon className="w-8 h-8 m-3" />
									</Drawer.CloseTrigger>
								</Drawer.Content>
							</Drawer.Positioner>
						</Portal>
					</Drawer.Root>
				</div>
			</nav>

			{children}
		</div>
	);
};
