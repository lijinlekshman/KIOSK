import React from 'react';
import { DashboardLayout } from '@shared/components/Layout';
import {
  useReportsLogic,
  ReportSection as ReportSectionType
} from './reportlogic';

// Report item component to avoid arrow functions in map
const ReportItem: React.FC<{
  report: { name: string; link: string };
  onReportClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}> = ({ report, onReportClick }) => {
  return (
    <li
      className='list-group-item d-flex align-items-center justify-content-between'
      key={report.name}
      style={{ cursor: 'pointer' }}
      data-link={report.link}
      onClick={onReportClick}
    >
      <div>
        <i className='bi bi-file-earmark-text-fill me-2' />
        <span className='text-decoration-none'>{report.name}</span>
      </div>
      <i className='bi bi-chevron-right text-secondary' />
    </li>
  );
};

// Report section component to avoid arrow functions in map
const ReportSection: React.FC<{
  section: {
    title: string;
    reports: { name: string; link: string }[];
  };
  onReportClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}> = ({ section, onReportClick }) => {
  return (
    <div className='card mb-4'>
      <div className='card-header bg-white fw-bold fs-5'>{section.title}</div>
      <ul className='list-group list-group-flush'>
        {section.reports.map(report => (
          <ReportItem
            key={report.name}
            report={report}
            onReportClick={onReportClick}
          />
        ))}
      </ul>
    </div>
  );
};

// Reports list component to avoid arrow functions in map
const ReportsList: React.FC<{
  sections: ReportSectionType[];
  onReportClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}> = ({ sections, onReportClick }) => {
  return (
    <>
      {sections.map(section => (
        <ReportSection
          key={section.title}
          section={section}
          onReportClick={onReportClick}
        />
      ))}
    </>
  );
};

const Reports: React.FC = () => {
  const { sections, handleReportClick } = useReportsLogic();

  return (
    <DashboardLayout title='Reports'>
      <div className='container-fluid py-4'>
        <div className='row'>
          <div className='col-12'>
            <ReportsList
              sections={sections}
              onReportClick={handleReportClick}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
