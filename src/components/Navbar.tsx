import { DiscordLogo, FullLogo, Logo } from "@/assets";
import { useApplications } from "@/hooks/use-applications";
import { useDeadlines } from "@/hooks/use-deadlines";
import type { AccessControlContext } from "@/navigation";
import {
	type RouteConfig,
	useAuth,
	useRouteDefinitions,
	useUser,
} from "@/providers";
import { paths } from "@/providers/RoutesProvider/data";
import { useUserStore } from "@/stores/user.store";
import { ProfilePicture } from "./ProfilePicture";
import {
	Box,
	Link as ChakraLink,
	CloseButton,
	Drawer,
	Flex,
	Image,
	Portal,
	Presence,
	Text,
} from "@chakra-ui/react";
import {
	CalendarDaysIcon,
	CodeBracketIcon,
	HomeIcon,
	ShareIcon,
	TicketIcon,
	UserGroupIcon,
	Cog8ToothIcon,
	StarIcon,
} from "@heroicons/react/24/outline";
import Hamburger from "hamburger-react";
import { useEffect, useMemo, useState } from "react";
import { FiChevronUp, FiLogOut, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import { RouterChakraLink } from "./RouterChakraLink";
import { Button } from "./ui/button";

// Order matters
const navItems = {
	[paths.home]: {
		label: "Home",
		Icon: HomeIcon,
		category: "MAIN",
	},
	[paths.schedule]: {
		label: "Schedule",
		Icon: CalendarDaysIcon,
		category: "MAIN",
	},
	[paths.perks]: {
		label: "Perks",
		Icon: StarIcon,
		category: "MAIN",
	},
	[paths.myTeam]: {
		label: "My Team",
		Icon: UserGroupIcon,
		category: "SOCIAL",
	},
	[paths.networking]: {
		label: "Networking",
		Icon: ShareIcon,
		category: "SOCIAL",
	},
	[paths.myTicket]: {
		label: "My Ticket",
		Icon: TicketIcon,
		category: "SOCIAL",
	},
	[paths.myAccount]: {
		label: "Account",
		Icon: Cog8ToothIcon,
		category: "SETTINGS",
	},
	[paths.apply]: {
		label: "Application",
		Icon: CodeBracketIcon,
		category: "MAIN",
	},
};

const MobileNav = ({
	availableRoutes,
	isMobile,
}: {
	availableRoutes: RouteConfig[];
	isMobile: boolean;
}) => {
	const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

	useEffect(() => {
		setMobileMenuOpen(false);
	}, [location]);

	return (
		<>
			{/* Mobile: Navbar Closed */}
			<Flex
				as="nav"
				alignItems="center"
				justifyContent="space-between"
				padding="1rem"
			>
				<Flex alignItems="center" justifyContent="start">
					<Link to="/home">
						<Image
							width="3rem"
							height="2.5rem"
							src={Logo}
							alt="SpurHacks Logo"
						/>
					</Link>
				</Flex>
				<Drawer.Root
					open={isMobileMenuOpen}
					onOpenChange={(e) => setMobileMenuOpen(e.open)}
				>
					<Drawer.Trigger asChild>
						<Hamburger
							toggled={isMobileMenuOpen}
							toggle={setMobileMenuOpen}
							size={24}
							label="Show navigation menu"
						/>
					</Drawer.Trigger>
					<Portal>
						<Drawer.Backdrop />
						<Drawer.Positioner>
							<Drawer.Content bg="#181C2B">
								<Drawer.Header>
									<Drawer.Title />
								</Drawer.Header>
								<Drawer.Body>
									<Flex
										direction="column"
										alignItems="center"
										justifyContent="space-between"
										height="full"
										pb="10"
									>
										<NavbarContent
											availableRoutes={availableRoutes}
											isMobile={isMobile}
										/>
									</Flex>
								</Drawer.Body>
								<Drawer.CloseTrigger asChild>
									<CloseButton size="sm" />
								</Drawer.CloseTrigger>
							</Drawer.Content>
						</Drawer.Positioner>
					</Portal>
				</Drawer.Root>
			</Flex>
		</>
	);
};

const NavbarContent = ({
	availableRoutes,
	isMobile,
}: {
	availableRoutes: RouteConfig[];
	isMobile: boolean;
}) => {
	const { logout, currentUser: user } = useAuth();
	const [showLogout, setShowLogout] = useState(false);
	const team = useUserStore((state) => state.team);

	const categorizedRoutes = useMemo(() => {
		const groups: Record<string, { path: string; label: string; Icon: any }[]> =
			{};

		Object.entries(navItems).forEach(([path, item]) => {
			if (!availableRoutes.some((r) => r.path === path)) return;
			const { category = "MAIN", label, Icon } = item;
			if (!groups[category]) groups[category] = [];
			groups[category].push({ path, label, Icon });
		});

		return groups;
	}, [availableRoutes]);

	return (
		<>
			<Flex
				as="ul"
				direction="column"
				alignItems="start"
				justifyContent="start"
				gap="0.5rem"
				w="full"
				pt={5}
				px={2}
				fontSize="xs"
			>
				<ChakraLink
					w="full"
					href="https://maps.app.goo.gl/NxPavuKXyiT6fhH87"
					target="_blank"
					rel="noopener noreferrer"
					textDecoration="none"
					color="#666484"
					rounded="full"
					_hover={{
						bg: "#1F1E2E",
					}}
					_focus={
						isMobile
							? {}
							: {
									boxShadow: "none",
									outline: "none",
								}
					}
				>
					<Flex
						padding="0.6rem"
						pl={6}
						alignItems="center"
						justifyContent="start"
						gap="0.5rem"
						cursor="pointer"
					>
						<FiMapPin size="1rem" />
						Location
					</Flex>
				</ChakraLink>
				<ChakraLink
					w="full"
					href="https://discord.gg/NpnSUrZJQy"
					target="_blank"
					rel="noopener noreferrer"
					textDecoration="none"
					color="#666484"
					rounded="full"
					_hover={{
						bg: "#1F1E2E",
					}}
					_focus={
						isMobile
							? {}
							: {
									boxShadow: "none",
									outline: "none",
								}
					}
				>
					<Flex
						padding="0.6rem"
						pl={6}
						alignItems="center"
						justifyContent="start"
						gap="0.5rem"
						cursor="pointer"
					>
						<Image
							src={DiscordLogo}
							filter="brightness(0) saturate(100%) invert(44%) sepia(6%) saturate(1804%) hue-rotate(205deg) brightness(89%) contrast(93%)"
							width="1rem"
							height="1rem"
						/>
						Discord Support
					</Flex>
				</ChakraLink>
				{Object.entries(categorizedRoutes).map(([section, routes]) => (
					<Box key={section} w="full" gap={2}>
						<Text fontSize="xs" pl={6} color="#666484" mt={4} mb={2}>
							{section}
						</Text>
						<Flex direction="column" gap={2}>
							{routes.map(({ path }) => {
								const { label, Icon } = navItems[path as keyof typeof navItems];
								const isActive = location.pathname === path;
								return (
									<RouterChakraLink
										key={label}
										as={Link}
										to={path as string}
										w="full"
										textDecoration="none"
										color="#666484"
										rounded="full"
										bg={isActive ? "#1F1E2E" : "transparent"}
										_hover={{ bg: "#1F1E2E" }}
									>
										<Flex
											as="li"
											padding="0.6rem"
											pl={6}
											w="full"
											cursor="pointer"
											gap="0.5rem"
											alignItems="center"
											justifyContent="start"
										>
											<Box width="1rem" height="1rem">
												<Icon color={isActive ? "#FFA75F" : "#666483"} />
											</Box>
											<Text
												fontSize="xs"
												color={isActive ? "#DEEBFF" : "#666484"}
											>
												{label}
											</Text>
										</Flex>
									</RouterChakraLink>
								);
							})}
						</Flex>
					</Box>
				))}
			</Flex>
			{user && (
				<ChakraLink
					position="relative"
					w="full"
					onClick={() => {
						setShowLogout((prev) => !prev);
					}}
					textDecoration="none"
					color="#666484"
					rounded="full"
					bg="#1F1E2E"
					_hover={{
						bg: "#1F1E2E",
					}}
					_focus={
						isMobile
							? {}
							: {
									boxShadow: "none",
									outline: "none",
								}
					}
				>
					{showLogout && (
						<Presence
							present={showLogout}
							position="absolute"
							top="-12"
							right="0"
							animationName={{
								_open: "slide-from-bottom, fade-in",
								_closed: "slide-to-bottom, fade-out",
							}}
							animationDuration="slow"
						>
							<Button
								bg="#1F1E2E"
								color="brand.error"
								gap={4}
								type="button"
								rounded="full"
								px={6}
								py={5}
								onClick={logout}
							>
								<FiLogOut size="1rem" />
								Log out
							</Button>
						</Presence>
					)}
					<Flex
						w="full"
						justify="space-between"
						alignItems="center"
						padding="0.5rem"
						px={6}
						gap={2}
					>
						<Flex flex="1" justifyContent="start" alignItems="center" gap={4}>
							<ProfilePicture
								size="2rem"
								borderRadius="full"
							/>
							<Flex
								flex="1"
								justifyContent="start"
								alignItems="start"
								direction="column"
							>
								<Text
									fontSize="xs"
									color="offwhite.primary"
									textTransform="none"
									lineClamp="1"
								>
									{team?.teamName ?? "No team"}
								</Text>
								<Text
									fontSize="sm"
									color="offwhite.primary"
									textTransform="none"
								>
									{user.displayName ?? "Unnamed hacker"}
								</Text>
							</Flex>
						</Flex>
						<Box
							marginEnd="auto"
							transition="transform 0.3s ease"
							transform={showLogout ? "rotate(180deg)" : "rotate(0deg)"}
						>
							<FiChevronUp size="1rem" />
						</Box>
					</Flex>
				</ChakraLink>
			)}
		</>
	);
};

export const Navbar = () => {
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
	const { user } = useUser();
	const applicationsCtx = useApplications();
	const deadlinesCtx = useDeadlines();
	const routes = useRouteDefinitions();

	const availableRoutes = useMemo(() => {
		return routes.filter((route) => {
			// Default to include in navbar if no access check defined
			if (typeof route.accessCheck === "undefined") return true;
			const ctx: AccessControlContext = {
				user,
				applicationsCtx,
				deadlinesCtx,
			};
			try {
				if (typeof route.accessCheck === "function")
					return route.accessCheck(ctx);
				if (Array.isArray(route.accessCheck))
					return route.accessCheck.every((check) => check(ctx));
			} catch (e) {
				// do nothing
			}

			// Default to exclude if access check type is not recognized
			return false;
		});
	}, [routes, applicationsCtx]);

	const updateNavbarState = () => {
		setIsMobile(window.innerWidth <= 768);
	};

	useEffect(() => {
		window.addEventListener("resize", updateNavbarState);
		return () => {
			window.removeEventListener("resize", updateNavbarState);
		};
	}, []);

	return (
		<>
			{isMobile ? (
				<MobileNav availableRoutes={availableRoutes} isMobile={isMobile} />
			) : (
				<Flex
					as="nav"
					height="vh"
					position="fixed"
					insetY="0"
					width="18rem"
					padding="1rem"
					direction="column"
					borderRightColor="#1F1E2E"
					borderRightStyle="solid"
					borderRightWidth={1}
					style={{
						background: `radial-gradient(
							circle at top left,
							#000000 -100%,
							#191C26 120%,
							#26252F 130%,
							#332D38 180%,
							#4D3E4A 200%,
							#6B5C6D 170%,
							#897B90 180%,
							#C5B8D6 250%
						)`,
					}}
				>
					<Flex alignItems="center" justifyContent="center" padding="1rem">
						<Link to={paths.home}>
							<Box width="full" height="30px">
								<img src={FullLogo} alt="SpurHacks Logo" />
							</Box>
						</Link>
					</Flex>

					<Flex
						as="aside"
						direction="column"
						alignItems="center"
						justifyContent="space-between"
						height="90%"
						overflowY="auto"
					>
						<NavbarContent
							availableRoutes={availableRoutes}
							isMobile={isMobile}
						/>
					</Flex>
				</Flex>
			)}
		</>
	);
};
