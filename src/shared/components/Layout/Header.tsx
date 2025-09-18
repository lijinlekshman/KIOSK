import React, { useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { Row } from 'react-bootstrap';
import DateRangeDropdown from '@shared/components/filters/DateRangeDropdown';
import HospitalDropdown from '@shared/components/filters/HospitalDropdown';

type HeaderProps = {
  title: string;
};

type Notification = {
  id: number;
  type: string;
  title: string;
  desc: string;
  time: string;
  code: string;
  location: string;
  icon: string;
  tone: string;
  isRead: boolean;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  const location = useLocation();
  const isCentersRoute = location.pathname.startsWith('/centers');
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Add isRead property to each notification
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'Critical',
      title: 'Kiosk Offline – Emergency Department',
      desc: 'Emergency Kiosk has been offline for 6 hours.',
      time: '11:45 AM',
      code: '38753',
      location: 'Mediclinic Creek Harbour',
      icon: 'bi-exclamation-octagon',
      tone: 'badgeDanger',
      isRead: false
    },
    {
      id: 2,
      type: 'Alert',
      title: 'System update completed',
      desc: 'Emergency Kiosk has been offline for 6 hours.',
      time: '11:45 AM',
      code: '38753',
      location: 'Mediclinic Creek Harbour',
      icon: 'bi-info-circle',
      tone: 'badgeAlert',
      isRead: false
    },
    {
      id: 3,
      type: 'Warning',
      title: 'Network Connection Lost',
      desc: 'Emergency Kiosk has been offline for 6 hours.',
      time: '11:45 AM',
      code: '38753',
      location: 'Mediclinic Creek Harbour',
      icon: 'bi-exclamation-triangle',
      tone: 'badgeWarning',
      isRead: false
    },
    {
      id: 4,
      type: 'Warning',
      title: 'Software Update Overdue',
      desc: 'Emergency Kiosk has been offline for 6 hours.',
      time: '11:45 AM',
      code: '38753',
      location: 'Mediclinic Creek Harbour',
      icon: 'bi-exclamation-triangle',
      tone: 'badgeWarning',
      isRead: false
    },
    {
      id: 5,
      type: 'Critical',
      title: 'Storage Space Critical',
      desc: 'Emergency Kiosk has been offline for 6 hours.',
      time: '11:45 AM',
      code: '38753',
      location: 'Mediclinic Creek Harbour',
      icon: 'bi-exclamation-octagon',
      tone: 'badgeDanger',
      isRead: false
    }
  ]);

  // Count only unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  // Mark all as read handler
  const markAllAsRead = useCallback(() => {
    setNotifications(notifications =>
      notifications.map(n => ({ ...n, isRead: true }))
    );
  }, []);

  // Toggle notifications handler
  const handleToggleNotifications = useCallback(() => {
    setShowNotifications(v => !v);
  }, []);

  return (
    <header
      className='main-header d-flex align-items-center justify-content-between px-3 py-2 shadow-sm'
      style={{ minHeight: 64 }}
    >
      <div className='flex-shrink-0 fw-bold fs-5 me-4'>{title}</div>

      <div className='d-flex align-items-center'>
        <Row className='g-2 align-items-center' style={{ marginRight: 10 }}>
          <DateRangeDropdown />
          {isCentersRoute && <HospitalDropdown />}
        </Row>

        <button
          ref={bellRef}
          type='button'
          className='btn btn-link me-3 position-relative bell-notification'
          aria-label='Notifications'
          onClick={handleToggleNotifications}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='#6a7797'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 3c-3.3 0-6 2.7-6 6 0 7-3 9-3 9h18s-3-2-3-9c0-3.3-2.7-6-6-6zm1.7 18a2 2 0 0 1-3.4 0' />
          </svg>
          {unreadCount > 0 && (
            <span
              className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
              style={{
                fontSize: '0.7rem',
                minWidth: 18,
                height: 18,
                padding: '0 4px',
                lineHeight: '18px',
                right: '-6px',
                top: '-4px'
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        {showNotifications && (
          <div className='notification-dropdown shadow'>
            <div className='d-flex justify-content-between align-items-center px-3 pt-3 pb-2 border-bottom'>
              <span className='noti-title'>Notifications</span>
              <button
                className='btn btn-link btn-sm text-primary p-0 markasALL'
                onClick={markAllAsRead}
              >
                Mark as all read
              </button>
            </div>
            <div className='notificationBody'>
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`d-flex align-items-start notification-list px-3 py-2 border-bottom${!n.isRead ? ' bg-light' : ''}`}
                  style={{
                    gap: 10
                  }}
                >
                  <i className={`bi ${n.icon} fs-4 ${n.tone} me-2`} />
                  <div className='flex-grow-1'>
                    <div className='fw-semibold noti-header'>{n.title}</div>
                    <div className='small text-muted'>{n.desc}</div>
                    <div className='d-flex align-items-center gap-2 mt-1'>
                      <span className={`badge ${n.tone}`}>{n.type}</span>
                      <span className='badge badgeId text-secondary border'>
                        ID: {n.code}
                      </span>
                      <span className='text-secondary locationTxt'>
                        {n.location}
                      </span>
                    </div>
                  </div>
                  <div className='timeLabel ms-2'>
                    <img src='./images/clockIcon.svg' alt='time' />
                    {n.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <Dropdown align='end'>
          <Dropdown.Toggle variant='outline-secondary' id='user-dropdown'>
            <span>Anna John</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Profile</Dropdown.Item>
            <Dropdown.Item>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
