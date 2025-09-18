import React, { createContext, useContext, ReactNode } from 'react';
import { useCentersLogic } from './centersLogic';

type CentersContextValue = ReturnType<typeof useCentersLogic>;

const CentersContext = createContext<CentersContextValue | undefined>(
  undefined
);

export const CentersProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const value = useCentersLogic();
  return (
    <CentersContext.Provider value={value}>{children}</CentersContext.Provider>
  );
};

export const useCenters = (): CentersContextValue => {
  const ctx = useContext(CentersContext);
  if (!ctx) {
    const fallback: CentersContextValue = {
      hospitals: [],
      centers: [],
      selectedHospital: 'All Hospitals',
      handleSelectHospital: (_eventKey: string | null) => {
        void _eventKey;
      },
      dateRange: 'today',
      handleSelectDateRange: (range: 'today' | 'lastDay' | 'last7') => {
        void range;
      },
      loading: false,
      error: null,
      reload: async () => {
        await Promise.resolve();
      },
      metrics: {
        kiosks: 0,
        bookings: 0,
        mobileCheckins: 0,
        offlineKiosks: 0,
        criticalKiosks: 0
      }
    } as unknown as CentersContextValue;
    return fallback;
  }
  return ctx;
};

export default CentersProvider;
