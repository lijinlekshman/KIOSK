import React, { useState, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { DashboardLayoutProps, SidebarItem } from './types';
import './DashboardLayout.scss';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { CentersProvider } from '@features/centers/CentersContext';

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith('/centers')) {
    return 'Centers';
  }
  if (pathname.startsWith('/dashboard')) {
    return 'Dashboard';
  }
  if (pathname.startsWith('/reports')) {
    return 'Reports';
  }
  if (pathname.startsWith('/manage')) {
    return 'Manage';
  }
  return 'MediClinic';
};

const defaultSidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'speedometer2',
    path: '/dashboard',
    url: '../images/dashboardIcon.svg'
  },
  {
    id: 'centers',
    label: 'Centers',
    icon: 'hospital',
    path: '/centers',
    url: '../images/clinicIcon.svg'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'file-earmark-bar-graph',
    path: '/reports',
    url: '../images/reportIcon.svg',
    matchPaths: [
      '/reports',
      '/reports/kiosk-usage',
      '/reports/patient-feedback',
      '/reports/financial'
    ]
  }
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  showSidebar = true,
  sidebarItems = defaultSidebarItems
}) => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Unique key for theme (can be replaced with your theme logic if needed)
  const themeKey = 'default';

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);
  return (
    <div key={themeKey} className='dashboard-layout'>
      {showSidebar && (
        <Sidebar
          key={`sidebar-${themeKey}`}
          items={sidebarItems}
          isCollapsed={isSidebarCollapsed}
          onToggle={handleToggleSidebar}
        />
      )}

      <div
        className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}
      >
        <CentersProvider>
          <Header key={`header-${themeKey}`} title={title} />

          <main className='content-area'>
            <Container fluid>{children}</Container>
          </main>
        </CentersProvider>
      </div>
    </div>
  );
};

export default DashboardLayout;
