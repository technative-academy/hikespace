import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import { HStack, VStack } from "../Stack/Stack";
import { Button } from "../ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const navLinks = [
    { label: "Home", url: "/" },
    { label: "Example", url: "/createpost" }, // testing purposes of createpost needs to be removed after
  ];

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
          </VStack>
        </SheetContent>
      </Sheet>
    </header>
  );
}
