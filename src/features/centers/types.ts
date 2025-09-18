export type Hospital = {
  id: string;
  name: string;
};

export type Metrics = {
  kiosks: number;
  avgCheckinTime: number;
  bookings: number;
  bookingsChange: number;
  mobileCheckins: number;
  mobileCheckinsChange: number;
  offlineKiosks: number;
  criticalKiosks: number;
};

export type DayMetrics = {
  date: string;
  metrics: Metrics;
};

export type HospitalMetrics = {
  hospitalId: string;
  days: DayMetrics[];
};
