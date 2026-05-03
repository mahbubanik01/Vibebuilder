import { MenuItem } from '../models/sidebar';

const createMenuItem = (
  id: string,
  name: string,
  path: string,
  icon?: MenuItem['icon'],
  options: Partial<Omit<MenuItem, 'id' | 'name' | 'path' | 'icon'>> = {}
): MenuItem => ({
  id,
  name,
  path,
  icon,
  ...options,
});

export const menuItems: MenuItem[] = [
  // --- VIBEBUILDER WORKSPACE ---
  createMenuItem('dashboard', 'MY_WORKSPACE', '/site-builder', 'LayoutDashboard'),
  createMenuItem('asset-library', 'ASSET_LIBRARY', '/file-manager/my-files', 'Image' as any),
  createMenuItem('team', 'TEAM_MANAGEMENT', '/identity-management', 'Users', { isIntegrated: true }),
];
