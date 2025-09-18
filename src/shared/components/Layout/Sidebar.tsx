import React, { useCallback } from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarItem } from './types';
import './Sidebar.scss';

interface SidebarProps {
  items: SidebarItem[];
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ items, isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onToggle();
    },
    [onToggle]
  );

  const handleItemClick = useCallback(
    (e: React.MouseEvent, path: string) => {
      e.preventDefault();
      navigate(path);
    },
    [navigate]
  );

  const createItemClickHandler = useCallback(
    (path: string) => (e: React.MouseEvent) => {
      handleItemClick(e, path);
    },
    [handleItemClick]
  );

  const isActive = (item: SidebarItem) => {
    const currentPath = location.pathname;
    if (item.matchPaths) {
      return item.matchPaths.some(path => currentPath.startsWith(path));
    }
    // Ensure item.path is a string before calling startsWith
    return item.path ? currentPath.startsWith(item.path) : false;
  };

  const renderSidebarItem = (item: SidebarItem) => {
    const hasChildren = item.children && item.children.length > 0;

    return (
      <Nav.Item key={item.id} className='sidebar-item'>
        <Nav.Link
          href={item.path || '#'}
          className={`sidebar-link ${isCollapsed ? 'collapsed' : ''} ${
            isActive(item) ? 'active' : ''
          }`}
          title={isCollapsed ? item.label : undefined}
          onClick={item.path ? createItemClickHandler(item.path) : undefined}
        >
          {item.icon && (
            <img className='sidebar-icon' src={item.url} alt='Dashboard Menu' />
          )}
          {!isCollapsed && (
            <>
              <span className='sidebar-label'>{item.label}</span>
              {item.badge && (
                <span className='badge bg-primary ms-auto'>{item.badge}</span>
              )}
            </>
          )}
        </Nav.Link>

        {hasChildren && !isCollapsed && (
          <Nav className='flex-column ms-3'>
            {item.children?.map(child => renderSidebarItem(child))}
          </Nav>
        )}
      </Nav.Item>
    );
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className='sidebar-header'>
        {!isCollapsed && (
          <div className='sidebar-logo'>
            <img src='../images/Logo.svg' alt='logo' />
          </div>
        )}
        {isCollapsed && (
          <div className='sidebar-logo'>
            <img src='../images/MG-logo.png' alt='logo' />
          </div>
        )}
      </div>

      <Nav className='flex-column sidebar-nav'>
        {items.map(item => renderSidebarItem(item))}
      </Nav>

      <div className='sidebar-footer'>
        <Nav.Link
          href='#'
          className='sidebar-link'
          onClick={handleToggleClick}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <i
            className={`bi bi-chevron-${isCollapsed ? 'right' : 'left'} sidebar-icon`}
          />
          {!isCollapsed && <span className='sidebar-label'>Collapse</span>}
        </Nav.Link>
      </div>
    </div>
  );
};

export default Sidebar;
