import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@shared/components/Layout/DashboardLayout';
import KioskUsageGrid from '@shared/components/Grid/KioskUsageGrid';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Button } from 'react-bootstrap';

// Types
type financialReport = {
  hospital: string;
  totalFeedbacks: number;
  positive: number;
  neutral: number;
  negative: number;
  avgRating: string;
  lastUpdated?: string;
};

// Sample Data
const sampleData: financialReport[] = [
  {
    hospital: 'Sapphire Lake Medical Center',
    totalFeedbacks: 120,
    positive: 80,
    neutral: 25,
    negative: 15,
    avgRating: '4.2',
    lastUpdated: '2025-09-16'
  },
  {
    hospital: 'Olympus Hospital Center',
    totalFeedbacks: 98,
    positive: 60,
    neutral: 20,
    negative: 18,
    avgRating: '3.9',
    lastUpdated: '2025-09-15'
  }
];

// Filter/Export options
const dateOptions = [
  { label: 'Last week', value: 'Last week' },
  { label: 'Current week', value: 'Current week' },
  { label: 'Custom range', value: 'Custom range' }
];

const filterOptions = [
  { label: 'A-Z', value: 'A-Z' },
  { label: 'Z-A', value: 'Z-A' },
  { label: 'Last updated ascending', value: 'LastUpdatedAsc' },
  { label: 'Last updated descending', value: 'LastUpdatedDesc' }
];

// Helper for dynamic title
const getDashboardTitle = (pathname: string) => {
  if (pathname.startsWith('/reports/patient-feedback')) {
    return 'Patient Feedback Report';
  }
  // Add a fallback for financial report
  if (pathname.startsWith('/reports/financial')) {
    return 'Financial Report';
  }
  return 'Report';
};

const FinancialReport: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<financialReport[]>([]);
  const [filter, setFilter] = useState<string>('A-Z');
  const [dateRange, setDateRange] = useState<string>('Last week');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    setData(sampleData);
  }, []);

  // Map PatientFeedbackData to KioskUsageGrid format for reuse
  const gridData = data.map(item => ({
    hospital: item.hospital,
    totalCheckins: item.totalFeedbacks,
    completedCheckins: item.positive,
    abandonedCheckins: item.negative,
    totalPARequests: item.neutral,
    avgCheckinTime: item.avgRating,
    lastUpdated: item.lastUpdated
  }));

  const getSortedData = () => {
    let sorted = [...gridData];
    if (dateRange === 'Last week') {
      sorted = sorted.filter(
        row => row.lastUpdated && row.lastUpdated < '2025-09-16'
      );
    } else if (dateRange === 'Current week') {
      sorted = sorted.filter(
        row => row.lastUpdated && row.lastUpdated >= '2025-09-16'
      );
    }
    if (filter === 'A-Z') {
      sorted.sort((a, b) => a.hospital.localeCompare(b.hospital));
    } else if (filter === 'Z-A') {
      sorted.sort((a, b) => b.hospital.localeCompare(a.hospital));
    } else if (filter === 'LastUpdatedAsc') {
      sorted.sort((a, b) => {
        return (a.lastUpdated ?? '').localeCompare(b.lastUpdated ?? '');
      });
    } else if (filter === 'LastUpdatedDesc') {
      sorted.sort((a, b) => {
        return (b.lastUpdated ?? '').localeCompare(a.lastUpdated ?? '');
      });
    }
    return sorted;
  };

  const sortedData = getSortedData();

  const dashboardTitle = getDashboardTitle(location.pathname);

  // Define handleExport before using it in useCallback hooks
  const handleExport = useCallback(
    (type: string) => {
      if (type === 'pdf') {
        const doc = new jsPDF();
        doc.text('Financial Report', 14, 16);
        autoTable(doc, {
          head: [
            [
              'Hospital',
              'Total Check-ins',
              'Completed Check-ins',
              'Abandoned Check-ins',
              'Total PA Requests',
              'Avg. Check-in Time'
            ]
          ],
          body: sortedData.map(row => [
            row.hospital,
            row.totalCheckins,
            row.completedCheckins,
            row.abandonedCheckins,
            row.totalPARequests,
            row.avgCheckinTime
          ]),
          startY: 22,
          styles: { fontSize: 10 }
        });
        doc.save('FinancialReport.pdf');
      } else if (type === 'excel') {
        const ws = XLSX.utils.json_to_sheet(
          sortedData.map(row => ({
            Hospital: row.hospital,
            'Total Check-ins': row.totalCheckins,
            'Completed Check-ins': row.completedCheckins,
            'Abandoned Check-ins': row.abandonedCheckins,
            'Total PA Requests': row.totalPARequests,
            'Avg. Check-in Time': row.avgCheckinTime
          }))
        );
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Financial Report');
        XLSX.writeFile(wb, 'FinancialReport.xlsx');
      }
      setShowExportMenu(false);
    },
    [sortedData]
  );

  // Now these will be defined after handleExport
  const handleExportPdf = useCallback(
    () => handleExport('pdf'),
    [handleExport]
  );

  const handleExportExcel = useCallback(
    () => handleExport('excel'),
    [handleExport]
  );

  // Stable handlers to avoid inline arrow functions in JSX
  const handleNavigateBack = useCallback(() => {
    navigate('/reports');
  }, [navigate]);

  const handleToggleFilterMenu = useCallback(() => {
    setShowFilterMenu(prev => !prev);
  }, []);

  const handleToggleExportMenu = useCallback(() => {
    setShowExportMenu(prev => !prev);
  }, []);

  const handleFilterClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const target = event.currentTarget as HTMLButtonElement;
      const value = target.dataset.value;
      if (value) {
        setFilter(value);
        setShowFilterMenu(false);
      }
    },
    []
  );

  const handleDateRangeSelect = useCallback((eventKey: string | null) => {
    if (eventKey) {
      setDateRange(eventKey);
    }
  }, []);

  return (
    <DashboardLayout title='Financial Reports'>
      <div className='col-12 col-lg-12 h-100'>
        <div className='card shadow-sm rounded-4 usage-reportGrid'>
          <div className='card-body'>
            <div className='d-flex align-items-center mb-4 flex-wrap gap-2'>
              <button
                className='btn btn-link p-0 me-2'
                style={{ fontSize: 24, textDecoration: 'none' }}
                onClick={handleNavigateBack}
                aria-label='Back'
              >
                <img src='../images/arrowReply.svg' alt='back button' />
              </button>
              <h2 className='mb-0 flex-grow-1 kiosk-header'>
                {dashboardTitle}
              </h2>
              <Dropdown
                className='me-2 weekDropdown'
                onSelect={handleDateRangeSelect}
              >
                <Dropdown.Toggle
                  variant='outline-secondary'
                  id='date-dropdown'
                  className='w-auto'
                >
                  {dateRange}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {dateOptions.map(opt => (
                    <Dropdown.Item
                      key={opt.value}
                      active={dateRange === opt.value}
                      eventKey={opt.value}
                    >
                      {opt.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {/* Only show filter if there is at least one row */}
              {sortedData.length > 0 && (
                <div className='dropdown me-2 cstmDropdown'>
                  <button
                    className='btn d-flex align-items-center'
                    type='button'
                    aria-expanded={showFilterMenu}
                    style={{ minWidth: 120 }}
                    onClick={handleToggleFilterMenu}
                  >
                    <span style={{ fontWeight: 500, color: '#6B7280' }}>
                      Filter
                    </span>
                  </button>
                  <ul
                    className={`dropdown-menu${showFilterMenu ? ' show' : ''}`}
                  >
                    {filterOptions.map(opt => (
                      <li key={opt.value}>
                        <button
                          className={`dropdown-item${filter === opt.value ? ' active' : ''}`}
                          onClick={handleFilterClick}
                          data-value={opt.value}
                          type='button'
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Export Button with Dropdown */}
              <div className='dropdown cstmDropdown'>
                <button
                  className='btn d-flex align-items-center exportBtn'
                  type='button'
                  aria-expanded={showExportMenu}
                  style={{ minWidth: 120 }}
                  onClick={handleToggleExportMenu}
                >
                  Export
                </button>
                <ul className={`dropdown-menu${showExportMenu ? ' show' : ''}`}>
                  <li>
                    <Button
                      className='dropdown-item'
                      variant='link'
                      onClick={handleExportPdf}
                    >
                      Export PDF
                    </Button>
                  </li>
                  <li>
                    <Button
                      className='dropdown-item'
                      variant='link'
                      onClick={handleExportExcel}
                    >
                      Export Excel
                    </Button>
                  </li>
                </ul>
              </div>
            </div>
            <div className='table-responsive cstm-tableDesign'>
              <KioskUsageGrid data={sortedData} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinancialReport;
