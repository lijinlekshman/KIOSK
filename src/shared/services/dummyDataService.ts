import { DateRange, HospitalOption } from '@shared/contexts/FiltersContext';

// Daily metric data structure
export interface DailyMetricData {
  date: string;
  totalKiosks: number;
  totalBookings: number;
  kioskCheckins: number;
  mobileCheckins: number;
  offlineKiosks: number;
  criticalKiosks: number;
  averageCheckinTime: string;
}

// Hospital-specific data structure
export interface HospitalMetricData {
  hospital: HospitalOption;
  totalKiosks: number;
  totalBookings: number;
  kioskCheckins: number;
  mobileCheckins: number;
  offlineKiosks: number;
  criticalKiosks: number;
  averageCheckinTime: string;
}

// Generate 30 days of dummy data
export const generateDummyData = (): DailyMetricData[] => {
  const data: DailyMetricData[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate realistic variations in data
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseMultiplier = isWeekend ? 0.7 : 1;

    data.push({
      date: date.toISOString().split('T')[0],
      totalKiosks: 210, // Constant
      totalBookings: Math.floor((1200 + Math.random() * 200) * baseMultiplier),
      kioskCheckins: Math.floor((900 + Math.random() * 150) * baseMultiplier),
      mobileCheckins: Math.floor((300 + Math.random() * 100) * baseMultiplier),
      offlineKiosks: Math.floor(Math.random() * 6),
      criticalKiosks: Math.floor(Math.random() * 4),
      averageCheckinTime: `${(8 + Math.random() * 2).toFixed(1)}m`
    });
  }

  return data;
};

// Generate hospital-specific dummy data
export const generateHospitalData = (): Record<
  HospitalOption,
  DailyMetricData[]
> => {
  const hospitals: HospitalOption[] = [
    'All',
    'Mediclinic Creek Harbour',
    'Mediclinic Welcare',
    'Mediclinic Dubai Hills',
    'Mediclinic Deira'
  ];
  const hospitalData: Record<HospitalOption, DailyMetricData[]> = {} as Record<
    HospitalOption,
    DailyMetricData[]
  >;

  hospitals.forEach(hospital => {
    const data: DailyMetricData[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseMultiplier = isWeekend ? 0.7 : 1;

      // Different base values for different hospitals
      const hospitalMultipliers = {
        All: 1,
        'Mediclinic Creek Harbour': 0.3,
        'Mediclinic Welcare': 0.25,
        'Mediclinic Dubai Hills': 0.2,
        'Mediclinic Deira': 0.25
      };

      const hospitalMultiplier = hospitalMultipliers[hospital];

      data.push({
        date: date.toISOString().split('T')[0],
        totalKiosks: Math.floor(210 * hospitalMultiplier),
        totalBookings: Math.floor(
          (1200 + Math.random() * 200) * baseMultiplier * hospitalMultiplier
        ),
        kioskCheckins: Math.floor(
          (900 + Math.random() * 150) * baseMultiplier * hospitalMultiplier
        ),
        mobileCheckins: Math.floor(
          (300 + Math.random() * 100) * baseMultiplier * hospitalMultiplier
        ),
        offlineKiosks: Math.floor(Math.random() * 6 * hospitalMultiplier),
        criticalKiosks: Math.floor(Math.random() * 4 * hospitalMultiplier),
        averageCheckinTime: `${(8 + Math.random() * 2).toFixed(1)}m`
      });
    }

    hospitalData[hospital] = data;
  });

  return hospitalData;
};

// Filter data based on date range
export const filterDataByDateRange = (
  data: DailyMetricData[],
  dateRange: DateRange
): DailyMetricData[] => {
  let daysToInclude = 1;

  switch (dateRange) {
    case 'today':
      daysToInclude = 1;
      break;
    case 'last7days':
      daysToInclude = 7;
      break;
    case 'last30days':
      daysToInclude = 30;
      break;
  }

  return data.slice(-daysToInclude);
};

// Calculate metrics from filtered data
export const calculateMetrics = (
  currentPeriod: DailyMetricData[],
  previousPeriod: DailyMetricData[]
) => {
  const currentTotalBookings = currentPeriod.reduce(
    (sum, day) => sum + day.totalBookings,
    0
  );
  const previousTotalBookings = previousPeriod.reduce(
    (sum, day) => sum + day.totalBookings,
    0
  );
  const bookingsChange =
    previousTotalBookings > 0
      ? ((currentTotalBookings - previousTotalBookings) /
          previousTotalBookings) *
        100
      : 0;

  const currentKioskCheckins = currentPeriod.reduce(
    (sum, day) => sum + day.kioskCheckins,
    0
  );
  const previousKioskCheckins = previousPeriod.reduce(
    (sum, day) => sum + day.kioskCheckins,
    0
  );
  const kioskCheckinsChange =
    previousKioskCheckins > 0
      ? ((currentKioskCheckins - previousKioskCheckins) /
          previousKioskCheckins) *
        100
      : 0;

  const currentMobileCheckins = currentPeriod.reduce(
    (sum, day) => sum + day.mobileCheckins,
    0
  );
  const previousMobileCheckins = previousPeriod.reduce(
    (sum, day) => sum + day.mobileCheckins,
    0
  );
  const mobileCheckinsChange =
    previousMobileCheckins > 0
      ? ((currentMobileCheckins - previousMobileCheckins) /
          previousMobileCheckins) *
        100
      : 0;

  const avgCheckinTime =
    currentPeriod.length > 0
      ? (
          currentPeriod.reduce(
            (sum, day) => sum + parseFloat(day.averageCheckinTime),
            0
          ) / currentPeriod.length
        ).toFixed(1)
      : '8.5';

  const latestOffline =
    currentPeriod[currentPeriod.length - 1]?.offlineKiosks || 0;
  const latestCritical =
    currentPeriod[currentPeriod.length - 1]?.criticalKiosks || 0;

  return {
    totalKiosks: currentPeriod[0]?.totalKiosks || 210,
    totalBookings: currentTotalBookings,
    kioskCheckins: currentKioskCheckins,
    mobileCheckins: currentMobileCheckins,
    offlineKiosks: latestOffline,
    criticalKiosks: latestCritical,
    avgCheckinTime,
    bookingsChange,
    kioskCheckinsChange,
    mobileCheckinsChange
  };
};

// Get comparison text for date range
export const getComparisonText = (dateRange: DateRange): string => {
  switch (dateRange) {
    case 'today':
      return 'vs Yesterday';
    case 'last7days':
      return 'vs Previous 7 Days';
    case 'last30days':
      return 'vs Previous 30 Days';
  }
};
