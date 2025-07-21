import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/clerk-react';
import Container from './Container';
import { LogoContainer } from './LogoContainer';
import { NavigationRoutes } from './NavigationRoutes';
import { NavLink } from 'react-router-dom';
import ProfileContainer from './ProfileContainer';
import ToggleContainer from './ToggleContainer';

function Header() {
  const { userId } = useAuth();

  return (
    <header className={cn(
      "w-full border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm transition-all duration-200"
    )}>
      <Container>
        <div className="flex items-center justify-between w-full py-3 gap-6">

          {/* Logo Section */}
          <LogoContainer />

          {/* Navigation Section */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <NavigationRoutes />

            {userId && (
              <NavLink
                to="/generate"
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 rounded-md transition-colors duration-150",
                    "text-muted-foreground hover:text-primary hover:bg-muted",
                    isActive && "text-primary font-semibold bg-muted"
                  )
                }
              >
                🎯 Take an Interview
              </NavLink>
            )}
          </nav>

          {/* Right Section: Profile + Toggle */}
          <div className="flex items-center gap-4 ml-auto">
            <ProfileContainer />
            <ToggleContainer />
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
