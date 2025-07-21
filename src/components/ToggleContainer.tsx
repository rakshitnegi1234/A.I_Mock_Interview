import { Menu } from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import { NavigationRoutes } from "./NavigationRoutes";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


export const ToggleContainer = () => {
  const { userId } = useAuth();
  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>

        <nav className="gap-6 flex flex-col items-start">
      <NavigationRoutes isMobile />
      {userId && (
        <NavLink
          to={"/generate"}
          className={({ isActive }) =>
            cn(
              "text-base text-neutral-600 ", // Note the extra space after 600
              isActive && "text-neutral-900 font-semibold"
            )
          }
        >
          Take An Interview
        </NavLink>
      )}
    </nav>
      </SheetContent>
    </Sheet>
  );
}

export default ToggleContainer;