import { ReactNode } from 'react';

export interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  showSidebar?: boolean;
  sidebarItems?: SidebarItem[];
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  children?: SidebarItem[];
  url?: string;
  badge?: string;
  matchPaths?: string[];
}

export interface HeaderProps {
  title?: string;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}
