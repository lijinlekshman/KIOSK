import { useCallback } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export type Report = {
  name: string;
  link: string;
};

export type ReportSection = {
  title: string;
  reports: Report[];
};

// Static sections; could be fetched in future
const reportSectionsData: ReportSection[] = [
  {
    title: 'Kiosk Reports',
    reports: [
      { name: 'Kiosk Usage Report', link: '/reports/kiosk-usage' },
      { name: 'Error & Exception Report', link: '/reports/kiosk-usage' }
    ]
  },
  {
    title: 'Patient Reports',
    reports: [{ name: 'Patient Feedback', link: '/reports/patient-feedback' }]
  },
  {
    title: 'Financial Report',
    reports: [{ name: 'Financial Report', link: '/reports/finance-report' }]
  }
];

export const useReportsLogic = () => {
  const navigate = useNavigate();

  const handleReportClick = useCallback(
    (event: MouseEvent<HTMLLIElement>) => {
      const link = event.currentTarget.getAttribute('data-link');
      if (link) {
        navigate(link);
      }
    },
    [navigate]
  );

  return {
    sections: reportSectionsData,
    handleReportClick
  };
};

export default useReportsLogic;
