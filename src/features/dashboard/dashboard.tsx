import React, { useCallback, useMemo } from 'react';
import { DashboardLayout } from '@shared/components/Layout';
import { Card, Spinner, Alert } from 'react-bootstrap';
import './dashboard.scss';
import DashboardCards, {
  DashboardCard,
  DashboardMetricItem
} from './dashboardCards';
import useDashboardLogic, { KioskData } from './dashboardLogic';
import { useFilters } from '@shared/contexts/FiltersContext';
import {
  generateDummyData,
  filterDataByDateRange,
  calculateMetrics,
  getComparisonText
} from '@shared/services/dummyDataService';

// KioskCard presentation component
const KioskCard: React.FC<{
  kiosk: KioskData;
  helpers: {
    getStatusClass: (status: string) => string;
    getDeltaClass: (delta: number) => string;
    getBadgeClass: (delta: number) => string;
  };
}> = ({ kiosk, helpers }) => (
  <div className='kiosk-card'>
    <div className='kiosk-head'>
      <div className='id'>ID: {kiosk.id}</div>
      <div className={`status ${helpers.getStatusClass(kiosk.status)}`}>
        {kiosk.status.charAt(0).toUpperCase() + kiosk.status.slice(1)}
      </div>
    </div>
    <div className='kiosk-title'>{kiosk.title}</div>
    <div className='kiosk-sub'>{kiosk.location}</div>
    <div className='kpi-row'>
      <div className='kpi'>
        <div className='kpi-label'>Today&apos;s Bookings</div>
        <div className='kpi-value'>
          {kiosk.todaysBookings}{' '}
          <span
            className={`delta ${helpers.getDeltaClass(kiosk.bookingsDelta)}`}
          >
            {kiosk.bookingsDelta >= 0 ? '+' : ''}
            {kiosk.bookingsDelta}
          </span>
        </div>
      </div>
      <div className='kpi'>
        <div className='kpi-label'>Device Up Time</div>
        <div className='kpi-value'>
          {kiosk.deviceUptime}%{' '}
          <span className={`badge ${helpers.getBadgeClass(kiosk.uptimeDelta)}`}>
            {kiosk.uptimeDelta}↘
          </span>
        </div>
      </div>
      <div className='kpi'>
        <div className='kpi-label'>Average Time Spent</div>
        <div className='kpi-value'>{kiosk.averageTimeSpent}</div>
      </div>
    </div>
  </div>
);

// TabButton component to avoid arrow functions in JSX
const TabButton: React.FC<{
  tab: {
    id: string;
    label: string;
    count: number;
    dotColor?: string;
  };
  isActive: boolean;
  onTabClick: (tabId: string) => void;
}> = ({ tab, isActive, onTabClick }) => {
  const handleClick = useCallback(() => {
    onTabClick(tab.id);
  }, [onTabClick, tab.id]);

  return (
    <button className={`tab ${isActive ? 'active' : ''}`} onClick={handleClick}>
      {tab.label}
      <span className='pill'>{tab.count}</span>
      {tab.dotColor && <span className={`dot ${tab.dotColor}`} />}
    </button>
  );
};

const Dashboard = () => {
  const {
    themeKey,
    activeTab,
    handleTabChange,
    handleToggleDetails,
    tabData,
    helpers,
    loading,
    error
    // refetch
  } = useDashboardLogic();

  const { dateRange } = useFilters();

  // Generate dummy data
  const dummyData = useMemo(() => generateDummyData(), []);

  // Event handler for tab clicks
  const handleTabClick = useCallback(
    (tabId: string) => {
      handleTabChange(tabId);
    },
    [handleTabChange]
  );

  // Date range comes from context

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    return filterDataByDateRange(dummyData, dateRange);
  }, [dummyData, dateRange]);

  // Calculate metrics from filtered data
  const metrics = useMemo(() => {
    const currentPeriod = filteredData;
    const previousPeriod =
      dateRange === 'today'
        ? dummyData.slice(-2, -1) // Previous day for today
        : dateRange === 'last7days'
          ? dummyData.slice(-14, -7) // Previous 7 days for last 7 days
          : dummyData.slice(-60, -30); // Previous 30 days for last 30 days

    return calculateMetrics(currentPeriod, previousPeriod);
  }, [filteredData, dummyData, dateRange]);

  // Define cards data with dynamic values
  const cards: DashboardMetricItem[] = useMemo(
    () => [
      {
        id: 'total-kiosks',
        title: 'Total Kiosks',
        value: metrics.totalKiosks.toString(),
        subText: `${metrics.avgCheckinTime}m Average Check-in Time`
      },
      {
        id: 'total-bookings',
        title: 'Total Bookings',
        value: metrics.totalBookings.toString(),
        subText: `${
          metrics.bookingsChange >= 0 ? '+' : ''
        }${metrics.bookingsChange.toFixed(1)}% ${getComparisonText(dateRange)}`,
        tone: metrics.bookingsChange >= 0 ? 'positive' : 'negative'
      },
      {
        id: 'kiosk-checkins',
        title: 'Kiosk Check-ins',
        value: metrics.kioskCheckins.toString(),
        subText: `${
          metrics.kioskCheckinsChange >= 0 ? '+' : ''
        }${metrics.kioskCheckinsChange.toFixed(1)}% ${getComparisonText(dateRange)}`,
        tone: metrics.kioskCheckinsChange >= 0 ? 'positive' : 'negative'
      },
      {
        id: 'mobile-checkins',
        title: 'Mobile Check-ins',
        value: metrics.mobileCheckins.toString(),
        subText: `${
          metrics.mobileCheckinsChange >= 0 ? '+' : ''
        }${metrics.mobileCheckinsChange.toFixed(1)}% ${getComparisonText(dateRange)}`,
        tone: metrics.mobileCheckinsChange >= 0 ? 'positive' : 'negative'
      },
      {
        id: 'offline-critical',
        title: 'Offline / Critical Kiosks',
        value: `${metrics.offlineKiosks} / ${metrics.criticalKiosks}`,
        subText: `${
          metrics.offlineKiosks + metrics.criticalKiosks
        } Kiosk · Repair immediately`,
        tone: 'warning',
        colProps: { xs: 12, sm: 6, lg: 8, xxl: 4 }
      }
    ],
    [metrics, dateRange]
  );

  return (
    <DashboardLayout title='Dashboard'>
      <div key={themeKey} className='dashboard-page p-4'>
        {/* Filters moved to Header */}

        {/* Cards Section */}
        <section className='dashboard-cards mb-4'>
          <DashboardCards>
            {cards.map(card => (
              <DashboardCard key={card.id} {...card} />
            ))}
          </DashboardCards>
        </section>

        {/* Map Section */}
        <section className='dashboard-map'>
          <Card className='map-card position-relative overflow-hidden'>
            <Card.Body className='p-0'>
              <div className='static-map-container'>
                <img
                  src={'images/map.png'}
                  alt='Map'
                  className='static-map-image'
                />
                <button
                  type='button'
                  className='map-toggle-btn'
                  onClick={handleToggleDetails}
                >
                  Toggle Details
                </button>

                {/* Loading / Error States */}
                {loading && <Spinner animation='border' />}
                {error && <Alert variant='danger'>{error}</Alert>}

                {/* Popup panel */}
                <div className='map-side-pop'>
                  <div className='pop-header'>
                    <div className='title'>Mediclinic Creek Harbour</div>
                    <div className='subtitle'>Dubai Creek Harbour</div>
                  </div>

                  {/* Tabs */}
                  <div className='pop-tabs tabs'>
                    {tabData.map(tab => (
                      <TabButton
                        key={tab.id}
                        tab={tab}
                        isActive={activeTab === tab.id}
                        onTabClick={handleTabClick}
                      />
                    ))}
                  </div>

                  {/* Tab Contents */}
                  <div className='tab-contents'>
                    {tabData.map(
                      tab =>
                        activeTab === tab.id && (
                          <div key={tab.id} className='tab-content pop-list'>
                            {tab.kiosks.length > 0 ? (
                              tab.kiosks.map(kiosk => (
                                <KioskCard
                                  key={kiosk.id}
                                  kiosk={kiosk}
                                  helpers={helpers}
                                />
                              ))
                            ) : (
                              <div className='no-kiosks-message'>
                                No kiosks found for this category.
                              </div>
                            )}
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
