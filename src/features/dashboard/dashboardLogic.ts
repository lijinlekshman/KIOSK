import { useEffect, useMemo, useState } from 'react';

// Types
export interface KioskData {
  id: string;
  title: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  todaysBookings: number;
  bookingsDelta: number;
  deviceUptime: number;
  uptimeDelta: number;
  averageTimeSpent: string;
}

export interface TabData {
  id: string;
  label: string;
  count: number;
  dotColor?: string;
  kiosks: KioskData[];
}

// Hook
export const useDashboardLogic = () => {
  const [themeKey, setThemeKey] = useState(0);
  const [activeTab, setActiveTab] = useState('tab1');
  const [kioskData, setKioskData] = useState<KioskData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // tab switching
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleToggleDetails = () => {
    setThemeKey(prev => prev + 0);
  };

  // ✅ Data Fetching
  const fetchKiosks = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real API call when ready
      // const res = await fetch('/api/kiosks'); // replace with real endpoint
      // if (!res.ok) {
      //   throw new Error('Failed to fetch kiosks');
      // }
      // const data: KioskData[] = await res.json();
      // setKioskData(data);

      // Dummy data for development
      const dummyData: KioskData[] = [
        {
          id: 'kiosk-001',
          title: 'Main Lobby Kiosk',
          location: 'Ground Floor - Main Entrance',
          status: 'online',
          todaysBookings: 45,
          bookingsDelta: 12,
          deviceUptime: 98.5,
          uptimeDelta: 2.1,
          averageTimeSpent: '3m 24s'
        },
        {
          id: 'kiosk-002',
          title: 'Emergency Department Kiosk',
          location: '1st Floor - Emergency Wing',
          status: 'online',
          todaysBookings: 32,
          bookingsDelta: -5,
          deviceUptime: 95.2,
          uptimeDelta: -1.3,
          averageTimeSpent: '4m 12s'
        },
        {
          id: 'kiosk-003',
          title: 'Outpatient Kiosk A',
          location: '2nd Floor - OPD Section A',
          status: 'offline',
          todaysBookings: 0,
          bookingsDelta: -15,
          deviceUptime: 0,
          uptimeDelta: -100,
          averageTimeSpent: '0m 0s'
        },
        {
          id: 'kiosk-004',
          title: 'Pharmacy Kiosk',
          location: 'Ground Floor - Pharmacy Counter',
          status: 'maintenance',
          todaysBookings: 8,
          bookingsDelta: -22,
          deviceUptime: 45.8,
          uptimeDelta: -54.2,
          averageTimeSpent: '2m 45s'
        },
        {
          id: 'kiosk-005',
          title: 'Cardiology Kiosk',
          location: '3rd Floor - Cardiology Department',
          status: 'online',
          todaysBookings: 28,
          bookingsDelta: 8,
          deviceUptime: 99.1,
          uptimeDelta: 0.5,
          averageTimeSpent: '5m 18s'
        },
        {
          id: 'kiosk-006',
          title: 'Pediatrics Kiosk',
          location: '2nd Floor - Pediatrics Wing',
          status: 'online',
          todaysBookings: 19,
          bookingsDelta: 3,
          deviceUptime: 97.8,
          uptimeDelta: 1.2,
          averageTimeSpent: '6m 33s'
        },
        {
          id: 'kiosk-007',
          title: 'Radiology Kiosk',
          location: 'Basement - Radiology Department',
          status: 'offline',
          todaysBookings: 0,
          bookingsDelta: -8,
          deviceUptime: 0,
          uptimeDelta: -100,
          averageTimeSpent: '0m 0s'
        },
        {
          id: 'kiosk-008',
          title: 'Laboratory Kiosk',
          location: '1st Floor - Lab Section',
          status: 'online',
          todaysBookings: 41,
          bookingsDelta: 15,
          deviceUptime: 96.7,
          uptimeDelta: -0.8,
          averageTimeSpent: '3m 56s'
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setKioskData(dummyData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKiosks();
  }, []);

  // build tab data from kiosks
  const tabData: TabData[] = useMemo(() => {
    return [
      {
        id: 'tab1',
        label: 'Total Kiosks',
        count: kioskData.length,
        kiosks: kioskData
      },
      {
        id: 'tab2',
        label: 'Online',
        count: kioskData.filter(k => k.status === 'online').length,
        dotColor: 'dot-green',
        kiosks: kioskData.filter(k => k.status === 'online')
      },
      {
        id: 'tab3',
        label: 'Offline',
        count: kioskData.filter(k => k.status === 'offline').length,
        dotColor: 'dot-orange',
        kiosks: kioskData.filter(k => k.status === 'offline')
      },
      {
        id: 'tab4',
        label: 'Maintenance',
        count: kioskData.filter(k => k.status === 'maintenance').length,
        dotColor: 'dot-red',
        kiosks: kioskData.filter(k => k.status === 'maintenance')
      }
    ];
  }, [kioskData]);

  // helpers used by UI
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'online';
      case 'offline':
        return 'offline';
      case 'maintenance':
        return 'repair';
      default:
        return 'ok';
    }
  };

  const getDeltaClass = (delta: number) => {
    return delta >= 0 ? 'positive' : 'negative';
  };

  const getBadgeClass = (delta: number) => {
    return delta >= 0 ? 'good' : 'warn';
  };

  // handle theme updates
  useEffect(() => {
    const handleThemeChange = () => {
      setThemeKey(prev => prev + 1);
    };
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  return {
    themeKey,
    activeTab,
    handleTabChange,
    handleToggleDetails,
    tabData,
    helpers: { getStatusClass, getDeltaClass, getBadgeClass },
    loading,
    error,
    refetch: fetchKiosks // expose fetch for manual refresh
  };
};

export default useDashboardLogic;
