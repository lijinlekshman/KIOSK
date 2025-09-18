import type { Hospital, HospitalMetrics } from './types';

export const hospitals: Hospital[] = [
  { id: 'all', name: 'All Hospitals' },
  { id: 'sapphire', name: 'Sapphire Lake Medical Center' },
  { id: 'olympus', name: 'Olympus Hospital Center' }
];

export const hospitalMetrics: HospitalMetrics[] = [
  {
    hospitalId: 'sapphire',
    days: [
      {
        date: '2025-09-17',
        metrics: {
          kiosks: 120,
          avgCheckinTime: 6.1,
          bookings: 4100,
          bookingsChange: 1.5,
          mobileCheckins: 1800,
          mobileCheckinsChange: -8.2,
          offlineKiosks: 7,
          criticalKiosks: 4
        }
      },
      {
        date: '2025-09-16',
        metrics: {
          kiosks: 120,
          avgCheckinTime: 6.4,
          bookings: 4000,
          bookingsChange: 1.2,
          mobileCheckins: 1750,
          mobileCheckinsChange: -7.5,
          offlineKiosks: 8,
          criticalKiosks: 3
        }
      },
      {
        date: '2025-09-15',
        metrics: {
          kiosks: 120,
          avgCheckinTime: 6.0,
          bookings: 3900,
          bookingsChange: 1.0,
          mobileCheckins: 1700,
          mobileCheckinsChange: -6.8,
          offlineKiosks: 6,
          criticalKiosks: 2
        }
      }
    ]
  }
  // Add olympus and all as needed
];
