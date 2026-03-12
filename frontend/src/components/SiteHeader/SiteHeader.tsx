import { useSessionUser } from "@/features/user";
import { authClient } from "@/lib/auth-client";
import { LogOutIcon, Menu, UserIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../public/hike-space-logo.png";
import { HStack, VStack } from "../Stack/Stack";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { UserAvatar } from "../UserAvatar/UserAvatar";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const { data: session } = authClient.useSession();
  const { user } = useSessionUser();
  const navigate = useNavigate();

  const navLinks = [{ label: "Home", url: "/" }];

  async function handleSignOut() {
    await authClient.signOut();
    navigate("/auth", {
      state: { defaultTab: "sign_in" },
    });
  }

  return (
    <header className={styles.wrapper}>
      <div className={styles.inner}>
        <div className="flex items-center gap-2">
          <NavLink to="/">
            <img src={logo} alt="Hike Space Logo" className={styles.logo} />
          </NavLink>
          {/* desktop nav links (left) */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navLinks.map((navLink) => (
                <NavigationMenuItem key={navLink.url}>
                  <NavigationMenuLink asChild>
                    <NavLink to={navLink.url}>{navLink.label}</NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* desktop auth (right) */}
        <div className="hidden md:flex items-center">
          {session && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity">
                  <span>{user.name}</span>
                  <UserAvatar user={user} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => navigate(`/user/${session.user.id}`)}
                >
                  <UserIcon className="size-4" />
                  View profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                  <LogOutIcon className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavLink
              to="/auth"
              state={{ defaultTab: "sign_in" }}
              className="text-sm font-medium hover:opacity-80 transition-opacity"
            >
              Log In
            </NavLink>
          )}
        </div>

        {/* mobile */}
        <Sheet>
          <div className="md:hidden ml-auto">
            <HStack reverse>
              <Button asChild size="icon-lg" variant="outline">
                <SheetTrigger>
                  <Menu />
                </SheetTrigger>
              </Button>
            </HStack>
          </div>
          <SheetContent style={{ paddingTop: "3rem" }}>
            <SheetTitle>Navigation Menu</SheetTitle>
            <VStack>
              {navLinks.map((navLink) => (
                <NavLink key={navLink.url} to={navLink.url}>
                  {({ isActive }) => (
                    <Button
                      asChild
                      className="w-full rounded-none"
                      variant="ghost"
                      data-active={isActive}
                    >
                      <span>{navLink.label}</span>
                    </Button>
                  )}
                </NavLink>
              ))}
              {session ? (
                <>
                  <NavLink to={`/user/${session.user.id}`}>
                    {({ isActive }) => (
                      <Button
                        asChild
                        className="w-full rounded-none"
                        variant="ghost"
                        data-active={isActive}
                      >
                        <span className="flex items-center gap-2">
                          <UserAvatar user={session.user} className="size-6" />
                          {session.user.name ?? session.user.email}
                        </span>
                      </Button>
                    )}
                  </NavLink>
                  <Button
                    className="w-full rounded-none"
                    variant="ghost"
                    onClick={handleSignOut}
                  >
                    <LogOutIcon className="size-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <NavLink to="/auth" state={{ defaultTab: "sign_up" }}>
                  {({ isActive }) => (
                    <Button
                      asChild
                      className="w-full rounded-none"
                      variant="ghost"
                      data-active={isActive}
                    >
                      <span>Sign Up</span>{" "}
                    </Button>
                  )}
                </NavLink>
              )}
            </VStack>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
