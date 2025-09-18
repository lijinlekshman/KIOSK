import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type Center = {
  id: string;
  name: string;
  address: string;
  hospital: string;
  kiosks: number;
  bookings: number;
  mobileCheckins: number;
  offlineKiosks: number;
  criticalKiosks: number;
};

export type Hospital = {
  id: string;
  name: string;
};

// Sample hospitals and centers data; replace with API calls when available
const hospitalsSeed: Hospital[] = [
  { id: 'all', name: 'All Hospitals' },
  { id: 'h2', name: 'Sapphire Lake Medical Center' },
  { id: 'h3', name: 'Olympus Hospital Center' }
];

const centersSeed: Center[] = [
  {
    id: 'c1',
    name: 'Front Desk Kiosk - A1',
    address: 'Building A, Ground Floor',
    hospital: 'Sapphire Lake Medical Center',
    kiosks: 3,
    bookings: 350,
    mobileCheckins: 140,
    offlineKiosks: 1,
    criticalKiosks: 0
  },
  {
    id: 'c2',
    name: 'Emergency Wing Kiosk - E2',
    address: 'Building C, Level 1',
    hospital: 'Sapphire Lake Medical Center',
    kiosks: 2,
    bookings: 280,
    mobileCheckins: 95,
    offlineKiosks: 0,
    criticalKiosks: 1
  },
  {
    id: 'c3',
    name: 'Outpatient Lobby Kiosk - O7',
    address: 'Main Lobby',
    hospital: 'Olympus Hospital Center',
    kiosks: 4,
    bookings: 410,
    mobileCheckins: 150,
    offlineKiosks: 0,
    criticalKiosks: 0
  }
];

export const useCentersLogic = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [centersAll, setCentersAll] = useState<Center[]>([]);
  const [selectedHospital, setSelectedHospital] =
    useState<string>('All Hospitals');
  const [dateRange, setDateRange] = useState<'today' | 'lastDay' | 'last7'>(
    'today'
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchHospitals = useCallback(
    async (_signal?: AbortSignal): Promise<Hospital[]> => {
      void _signal;
      await new Promise(r => setTimeout(r, 150));
      return hospitalsSeed;
    },
    []
  );

  const fetchCenters = useCallback(
    async (_signal?: AbortSignal): Promise<Center[]> => {
      void _signal;
      await new Promise(r => setTimeout(r, 150));
      return centersSeed;
    },
    []
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const [hRes, cRes] = await Promise.all([
        fetchHospitals(controller.signal),
        fetchCenters(controller.signal)
      ]);
      const hasAll = hRes.find(h => h.name === 'All Hospitals');
      setHospitals(
        hasAll ? hRes : [{ id: 'all', name: 'All Hospitals' }, ...hRes]
      );
      setCentersAll(cRes);
    } catch (e) {
      const errorObj = e as { name?: string };
      if (errorObj?.name !== 'AbortError') {
        setError('Failed to load centers data');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchHospitals, fetchCenters]);

  useEffect(() => {
    loadData();
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [loadData]);

  const handleSelectHospital = useCallback((eventKey: string | null) => {
    if (eventKey) {
      setSelectedHospital(eventKey);
    }
  }, []);

  const centers = useMemo(() => {
    if (!selectedHospital || selectedHospital === 'All Hospitals') {
      return centersAll;
    }
    return centersAll.filter(c => c.hospital === selectedHospital);
  }, [centersAll, selectedHospital]);

  const metrics = useMemo(() => {
    const totals = centers.reduce(
      (acc, c) => {
        acc.kiosks += c.kiosks;
        acc.bookings += c.bookings;
        acc.mobileCheckins += c.mobileCheckins;
        acc.offlineKiosks += c.offlineKiosks;
        acc.criticalKiosks += c.criticalKiosks;
        return acc;
      },
      {
        kiosks: 0,
        bookings: 0,
        mobileCheckins: 0,
        offlineKiosks: 0,
        criticalKiosks: 0
      }
    );
    // Adjust totals based on selected date range to simulate averages
    const scaleMap = {
      today: 1,
      lastDay: 0.92,
      last7: 0.88
    } as const;
    const s = scaleMap[dateRange];
    const scaled = {
      kiosks: Math.round(totals.kiosks),
      bookings: Math.round(totals.bookings * s),
      mobileCheckins: Math.round(totals.mobileCheckins * s),
      offlineKiosks: Math.round(totals.offlineKiosks * s),
      criticalKiosks: Math.round(totals.criticalKiosks * s)
    };
    return scaled;
  }, [centers, dateRange]);

  return {
    hospitals,
    centers,
    selectedHospital,
    handleSelectHospital,
    dateRange,
    handleSelectDateRange: setDateRange,
    loading,
    error,
    reload: loadData,
    metrics
  };
};

export default useCentersLogic;
