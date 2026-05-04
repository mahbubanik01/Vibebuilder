import { ReactNode, useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { publicRoutes } from '@/constant/auth-public-routes';
import { isJWTExpired } from '@/lib/utils/auth-helpers';

/**
 * useAuthState Hook
 *
 * A custom hook that provides authentication state with mounting status tracking.
 * It synchronizes with the global auth store and ensures components can detect
 * when auth state is fully loaded.
 *
 * @returns {AuthState} An object containing authentication status information
 *   - isMounted: Whether the auth state has been initialized
 *   - isAuthenticated: Whether the user is authenticated
 *
 * @example
 * const { isMounted, isAuthenticated } = useAuthState();
 *
 * if (!isMounted) {
 *   return <LoadingSpinner />;
 * }
 *
 * return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
 */

interface AuthState {
  isMounted: boolean;
  isAuthenticated: boolean;
}

export const useAuthState = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const performLogout = useCallback(() => {
    if (logout) logout();
  }, [logout]);

  // Expiry guard on mount and when token changes
  useEffect(() => {
    if (isMounted && accessToken && isJWTExpired(accessToken)) {
      performLogout();
    }
  }, [isMounted, accessToken, performLogout]);

  return { isMounted, isAuthenticated };
};

/**
 * ClientMiddleware Component
 *
 * A protection layer that controls rendering based on authentication state,
 * automatically redirecting unauthenticated users away from protected routes.
 *
 * Features:
 * - Blocks access to protected routes for unauthenticated users
 * - Redirects to login page when authentication is required
 * - Allows access to public routes without authentication
 * - Prevents content flash by not rendering until auth state is confirmed
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render when access is granted
 * @returns {JSX.Element|null} The children when access is granted, null otherwise
 *
 * @example
 * <ClientMiddleware>
 *   <ProtectedRoutes />
 * </ClientMiddleware>
 */

interface ClientMiddlewareProps {
  children: ReactNode;
}

export const ClientMiddleware: React.FC<ClientMiddlewareProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isMounted, isAuthenticated } = useAuthState();
  const isLiveRoute = currentPath.startsWith('/live/');
  const isPublicRoute = publicRoutes.includes(currentPath) || isLiveRoute;
  const lastNavTime = useRef<number>(0);
  const NAV_THROTTLE_MS = 600;

  // Check if we're processing an SSO callback (has code and state parameters)
  const urlParams = new URLSearchParams(location.search);
  const isSSOCallback = !!(urlParams.get('code') && urlParams.get('state'));

  useLayoutEffect(() => {
    if (isSSOCallback) {
      return;
    }

    // Throttle navigation to avoid navigation storms that can hang the browser
    const now = Date.now();
    if (now - lastNavTime.current < NAV_THROTTLE_MS) return;

    if (isMounted && !isAuthenticated && !isPublicRoute) {
      navigate('/auth/signin');
      lastNavTime.current = now;
    }
  }, [isAuthenticated, isMounted, isPublicRoute, isSSOCallback, navigate, currentPath]);

  // Don't block rendering if we're processing SSO callback
  if (isSSOCallback) {
    return <>{children}</>;
  }

  if ((!isMounted || !isAuthenticated) && !isPublicRoute) return null;

  return <>{children}</>;
};
