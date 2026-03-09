import { authClient } from "@/lib/auth-client";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { HStack, VStack } from "../Stack/Stack";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "../ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const { data: session } = authClient.useSession();

  const navLinks = [
    { label: "Home", url: "/" },
  ];

  const initials = session?.user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className={styles.wrapper}>
      {/* desktop */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {navLinks.map((navLink) => (
            <NavigationMenuItem key={navLink.url}>
              <NavigationMenuLink asChild>
                <NavLink to={navLink.url}>{navLink.label}</NavLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              {session
                ? (
                  <NavLink to={`/user/${session?.user.id}`}>
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </NavLink>
                )
                : <NavLink to="/auth">Log In</NavLink>}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {/* mobile */}
      <Sheet>
        <HStack reverse>
          <Button asChild size="icon-lg" variant="outline">
            <SheetTrigger className="md:hidden">
              <Menu /> {/* lucide icon */}
            </SheetTrigger>
          </Button>
        </HStack>
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
            {session
              ? (
                <NavLink to={`/user/${session?.user.id}`}>
                  {({ isActive }) => (
                    <Button
                      asChild
                      className="w-full rounded-none"
                      variant="ghost"
                      data-active={isActive}
                    >
                      <span className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        {session.user.name ?? session.user.email}
                      </span>
                    </Button>
                  )}
                </NavLink>
              )
              : (
                <NavLink to="/auth">
                  {({ isActive }) => (
                    <Button
                      asChild
                      className="w-full rounded-none"
                      variant="ghost"
                      data-active={isActive}
                    >
                      <span>Log In</span>
                    </Button>
                  )}
                </NavLink>
              )}
          </VStack>
        </SheetContent>
      </Sheet>
    </header>
  );
}
