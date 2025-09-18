import React, {
  createContext,
  // useCallback,
  useContext,
  useMemo,
  useState
} from 'react';

export type DateRange = 'today' | 'last7days' | 'last30days';
export type HospitalOption =
  | 'All'
  | 'Mediclinic Creek Harbour'
  | 'Mediclinic Welcare'
  | 'Mediclinic Dubai Hills'
  | 'Mediclinic Deira';

type FiltersContextValue = {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  hospital: HospitalOption;
  setHospital: (hospital: HospitalOption) => void;
  hospitalOptions: HospitalOption[];
};

const FiltersContext = createContext<FiltersContextValue | undefined>(
  undefined
);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [dateRange, setDateRange] = useState<DateRange>('today');
  const [hospital, setHospital] = useState<HospitalOption>('All');

  const hospitalOptions: HospitalOption[] = useMemo(
    () => [
      'All',
      'Mediclinic Creek Harbour',
      'Mediclinic Welcare',
      'Mediclinic Dubai Hills',
      'Mediclinic Deira'
    ],
    []
  );

  const value: FiltersContextValue = {
    dateRange,
    setDateRange,
    hospital,
    setHospital,
    hospitalOptions
  };

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
};

export const useFilters = (): FiltersContextValue => {
  const ctx = useContext(FiltersContext);
  if (!ctx) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return ctx;
};

export default FiltersProvider;
