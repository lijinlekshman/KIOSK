import React, { useEffect, useState, useCallback } from 'react';
import KioskUsageGrid from '../../shared/components/Grid/KioskUsageGrid';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../shared/components/Layout/DashboardLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import './KIOSK.scss';
import autoTable from 'jspdf-autotable';
// For Excel export
import * as XLSX from 'xlsx';
// For PDF export
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type HospitalData = {
  hospital: string;
  totalCheckins: number;
  completedCheckins: number;
  abandonedCheckins: number;
  totalPARequests: number;
  avgCheckinTime: string;
  lastUpdated?: string;
};

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

const exportOptions = [
  { label: 'Export as PDF', value: 'pdf' },
  { label: 'Export as Excel', value: 'excel' }
];

// Dropdown item components to avoid arrow functions
const DateDropdownItem: React.FC<{
  option: { label: string; value: string };
  isActive: boolean;
  onSelect: (value: string) => void;
}> = ({ option, isActive, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(option.value);
  }, [onSelect, option.value]);

  return (
    <Dropdown.Item key={option.value} active={isActive} onClick={handleClick}>
      {option.label}
    </Dropdown.Item>
  );
};

const FilterDropdownItem: React.FC<{
  option: { label: string; value: string };
  isActive: boolean;
  onSelect: (value: string) => void;
}> = ({ option, isActive, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(option.value);
  }, [onSelect, option.value]);

  return (
    <li key={option.value}>
      <button
        className={`dropdown-item${isActive ? ' active' : ''}`}
        onClick={handleClick}
        type='button'
      >
        {option.label}
      </button>
    </li>
  );
};

const ExportDropdownItem: React.FC<{
  option: { label: string; value: string };
  onSelect: (value: string) => void;
}> = ({ option, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(option.value);
  }, [onSelect, option.value]);

  return (
    <li key={option.value}>
      <button className='dropdown-item' onClick={handleClick} type='button'>
        {option.label}
      </button>
    </li>
  );
};

const getDashboardTitle = (pathname: string) => {
  if (pathname.startsWith('/dashboard')) {
    return 'Dashboard';
  }
  if (pathname.startsWith('/clinic')) {
    return 'Clinic';
  }
  if (pathname.startsWith('/reports/kiosk-usage')) {
    return 'All Hospitals';
  }
  if (pathname.startsWith('/reports/error-exception')) {
    return 'Error & Exception Report';
  }
  if (pathname.startsWith('/reports/patient-feedback')) {
    return 'Patient Feedback';
  }
  if (pathname.startsWith('/reports/financial-report')) {
    return 'Financial Report';
  }
  if (pathname.startsWith('/reports')) {
    return 'Reports';
  }
  return 'Dashboard';
};

const KioskUsageReport: React.FC = () => {
  const [data, setData] = useState<HospitalData[]>([]);

  useEffect(() => {
    // Example API call
    // fetch('/api/hospitals')
    //   .then(res => res.json())
    //   .then(json => setData(json));
    // For now, use sample data:
    setData([
      {
        hospital: 'Sapphire Lake Medical Center',
        totalCheckins: 6690,
        completedCheckins: 7791,
        abandonedCheckins: 536,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-10'
      },
      {
        hospital: 'Lizy',
        totalCheckins: 7000,
        completedCheckins: 8000,
        abandonedCheckins: 654,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-09'
      },
      {
        hospital: 'Sapphire Lake Medical Center',
        totalCheckins: 6690,
        completedCheckins: 7791,
        abandonedCheckins: 536,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-10'
      },
      {
        hospital: 'Lizy',
        totalCheckins: 7000,
        completedCheckins: 8000,
        abandonedCheckins: 654,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-09'
      },
      {
        hospital: 'Sapphire Lake Medical Center',
        totalCheckins: 6690,
        completedCheckins: 7791,
        abandonedCheckins: 536,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-10'
      },
      {
        hospital: 'Lizy',
        totalCheckins: 7000,
        completedCheckins: 8000,
        abandonedCheckins: 654,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-09'
      },
      {
        hospital: 'Sapphire Lake Medical Center',
        totalCheckins: 6690,
        completedCheckins: 7791,
        abandonedCheckins: 536,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-10'
      },
      {
        hospital: 'Lizy',
        totalCheckins: 7000,
        completedCheckins: 8000,
        abandonedCheckins: 654,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-09'
      },
      {
        hospital: 'Sapphire Lake Medical Center',
        totalCheckins: 6690,
        completedCheckins: 7791,
        abandonedCheckins: 536,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-10'
      },
      {
        hospital: 'Lizy',
        totalCheckins: 7000,
        completedCheckins: 8000,
        abandonedCheckins: 654,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-09'
      },
      {
        hospital: 'Sapphire Lake Medical Center',
        totalCheckins: 6690,
        completedCheckins: 7791,
        abandonedCheckins: 536,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-10'
      },
      {
        hospital: 'Lizy',
        totalCheckins: 7000,
        completedCheckins: 8000,
        abandonedCheckins: 654,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-09'
      },
      {
        hospital: 'Sapphire Lake Medical Center',
        totalCheckins: 6690,
        completedCheckins: 7791,
        abandonedCheckins: 536,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-10'
      },
      {
        hospital: 'Lizy',
        totalCheckins: 7000,
        completedCheckins: 8000,
        abandonedCheckins: 654,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-09'
      },
      {
        hospital: 'Sapphire Lake Medical Center',
        totalCheckins: 6690,
        completedCheckins: 7791,
        abandonedCheckins: 536,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-10'
      },
      {
        hospital: 'Lizy',
        totalCheckins: 7000,
        completedCheckins: 8000,
        abandonedCheckins: 654,
        totalPARequests: 647,
        avgCheckinTime: '12 min',
        lastUpdated: '2025-09-09'
      }
    ]);
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState<string>('A-Z');
  const [dateRange, setDateRange] = useState<string>('Last week');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Event handlers
  const handleBackNavigation = useCallback(() => {
    navigate('/reports');
  }, [navigate]);

  const handleDateRangeChange = useCallback((value: string) => {
    setDateRange(value);
  }, []);

  const handleFilterMenuToggle = useCallback(() => {
    setShowFilterMenu(!showFilterMenu);
  }, [showFilterMenu]);

  const handleFilterChange = useCallback((value: string) => {
    setFilter(value);
    setShowFilterMenu(false);
  }, []);

  const handleExportMenuToggle = useCallback(() => {
    setShowExportMenu(!showExportMenu);
  }, [showExportMenu]);

  const getSortedData = () => {
    let sorted = [...data]; // Use state variable

    // Example: filter by dateRange (for demo, just sort by lastUpdated)
    if (dateRange === 'Last week') {
      sorted = sorted.filter(
        row => row.lastUpdated && row.lastUpdated < '2025-09-16'
      );
    } else if (dateRange === 'Current week') {
      sorted = sorted.filter(
        row => row.lastUpdated && row.lastUpdated >= '2025-09-16'
      );
    }
    // Custom range can be implemented with a date picker

    // Sorting logic
    if (filter === 'A-Z') {
      sorted.sort((a, b) => a.hospital.localeCompare(b.hospital));
    } else if (filter === 'Z-A') {
      sorted.sort((a, b) => b.hospital.localeCompare(a.hospital));
    } else if (filter === 'LastUpdatedAsc') {
      sorted.sort((a, b) =>
        (a.lastUpdated ?? '').localeCompare(b.lastUpdated ?? '')
      );
    } else if (filter === 'LastUpdatedDesc') {
      sorted.sort((a, b) =>
        (b.lastUpdated ?? '').localeCompare(a.lastUpdated ?? '')
      );
    }
    return sorted;
  };

  const sortedData = getSortedData();
  const dashboardTitle = getDashboardTitle(location.pathname);

  // Export handlers
  const handleExport = useCallback(
    (type: string) => {
      if (type === 'pdf') {
        const doc = new jsPDF();
        doc.text('Kiosk Usage Report', 14, 16);
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
        doc.save('KioskUsageReport.pdf');
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
        XLSX.utils.book_append_sheet(wb, ws, 'Kiosk Usage');
        XLSX.writeFile(wb, 'KioskUsageReport.xlsx');
      }
      setShowExportMenu(false);
    },
    [sortedData]
  );

  const handleExportClick = useCallback(
    (type: string) => {
      handleExport(type);
    },
    [handleExport]
  );

  return (
    <DashboardLayout title={dashboardTitle}>
      <div className='col-12 col-lg-12 h-100'>
        <div className='card shadow-sm rounded-4 usage-reportGrid'>
          <div className='card-body'>
            <div className='d-flex align-items-center mb-4 flex-wrap gap-2'>
              <button
                className='btn btn-link p-0 me-2'
                style={{ fontSize: 24, textDecoration: 'none' }}
                onClick={handleBackNavigation}
                aria-label='Back'
              >
                <img src='../images/arrowReply.svg' alt='back button' />
              </button>
              <h2 className='mb-0 flex-grow-1 kiosk-header'>
                {dashboardTitle}
              </h2>
              <Dropdown className='me-2 weekDropdown'>
                <Dropdown.Toggle
                  variant='outline-secondary'
                  id='date-dropdown'
                  className='w-auto'
                >
                  {dateRange}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {dateOptions.map(opt => (
                    <DateDropdownItem
                      key={opt.value}
                      option={opt}
                      isActive={dateRange === opt.value}
                      onSelect={handleDateRangeChange}
                    />
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {/* Filter Button with Dropdown */}
              <div className='dropdown me-2 cstmDropdown'>
                <button
                  className='btn d-flex align-items-center'
                  type='button'
                  aria-expanded={showFilterMenu}
                  style={{ minWidth: 120 }}
                  onClick={handleFilterMenuToggle}
                >
                  <span style={{ fontWeight: 500, color: '#6B7280' }}>
                    Filter
                  </span>
                </button>
                <ul
                  className={`dropdown-menu${showFilterMenu ? ' show' : ''}`}
                  style={{ minWidth: 180 }}
                >
                  {filterOptions.map(opt => (
                    <FilterDropdownItem
                      key={opt.value}
                      option={opt}
                      isActive={filter === opt.value}
                      onSelect={handleFilterChange}
                    />
                  ))}
                </ul>
              </div>
              {/* Export Button with Dropdown */}
              <div className='dropdown cstmDropdown'>
                <button
                  className='btn d-flex align-items-center exportBtn'
                  type='button'
                  aria-expanded={showExportMenu}
                  style={{ minWidth: 120 }}
                  onClick={handleExportMenuToggle}
                >
                  Export
                </button>
                <ul
                  className={`dropdown-menu${showExportMenu ? ' show' : ''}`}
                  style={{ minWidth: 180 }}
                >
                  {exportOptions.map(opt => (
                    <ExportDropdownItem
                      key={opt.value}
                      option={opt}
                      onSelect={handleExportClick}
                    />
                  ))}
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

export default KioskUsageReport;
