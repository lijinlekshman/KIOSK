import React, { useMemo } from 'react';
import { DashboardLayout } from '@shared/components/Layout';
import { useCenters } from './CentersContext';
import DashboardCards, {
  DashboardCard,
  DashboardMetricItem
} from '@features/dashboard/dashboardCards';
import TrendAnalysis from './trendAnslsyis/TrendAnalysis';
import { useFilters } from '@shared/contexts/FiltersContext';
import {
  generateHospitalData,
  filterDataByDateRange,
  calculateMetrics,
  getComparisonText
} from '@shared/services/dummyDataService';

const Centers: React.FC = () => {
  const { centers, loading, error, reload } = useCenters();
  const { dateRange, hospital: selectedHospital } = useFilters();

  // Generate hospital-specific dummy data
  const hospitalData = useMemo(() => generateHospitalData(), []);

  // Get data for selected hospital
  const currentHospitalData = useMemo(() => {
    if (selectedHospital === 'All') {
      // Sum all hospital data
      const allData = hospitalData['Mediclinic Creek Harbour'].map(
        (_, index) => {
          const dayData = Object.values(hospitalData).map(
            hospital => hospital[index]
          );
          return {
            date: dayData[0].date,
            totalKiosks: dayData.reduce((sum, day) => sum + day.totalKiosks, 0),
            totalBookings: dayData.reduce(
              (sum, day) => sum + day.totalBookings,
              0
            ),
            kioskCheckins: dayData.reduce(
              (sum, day) => sum + day.kioskCheckins,
              0
            ),
            mobileCheckins: dayData.reduce(
              (sum, day) => sum + day.mobileCheckins,
              0
            ),
            offlineKiosks: dayData.reduce(
              (sum, day) => sum + day.offlineKiosks,
              0
            ),
            criticalKiosks: dayData.reduce(
              (sum, day) => sum + day.criticalKiosks,
              0
            ),
            averageCheckinTime: dayData[0].averageCheckinTime
          };
        }
      );
      return allData;
    }
    return hospitalData[selectedHospital];
  }, [hospitalData, selectedHospital]);

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    return filterDataByDateRange(currentHospitalData, dateRange);
  }, [currentHospitalData, dateRange]);

  // Calculate metrics from filtered data
  const metrics = useMemo(() => {
    const currentPeriod = filteredData;
    const previousPeriod =
      dateRange === 'today'
        ? currentHospitalData.slice(-2, -1) // Previous day for today
        : dateRange === 'last7days'
          ? currentHospitalData.slice(-14, -7) // Previous 7 days for last 7 days
          : currentHospitalData.slice(-60, -30); // Previous 30 days for last 30 days

    return calculateMetrics(currentPeriod, previousPeriod);
  }, [filteredData, currentHospitalData, dateRange]);

  // Define cards data with dynamic values
  const cards: DashboardMetricItem[] = useMemo(
    () => [
      {
        id: 'total-kiosks',
        title: 'Total Kiosks',
        value: metrics.totalKiosks.toString(),
        subText: `${metrics.avgCheckinTime}m Average Check-in Time`
      },
      {
        id: 'total-bookings',
        title: 'Total Bookings',
        value: metrics.totalBookings.toString(),
        subText: `${
          metrics.bookingsChange >= 0 ? '+' : ''
        }${metrics.bookingsChange.toFixed(1)}% ${getComparisonText(dateRange)}`,
        tone: metrics.bookingsChange >= 0 ? 'positive' : 'negative'
      },
      {
        id: 'mobile-checkins',
        title: 'Mobile Check-ins',
        value: metrics.mobileCheckins.toString(),
        subText: `${
          metrics.mobileCheckinsChange >= 0 ? '+' : ''
        }${metrics.mobileCheckinsChange.toFixed(1)}% ${getComparisonText(dateRange)}`,
        tone: metrics.mobileCheckinsChange >= 0 ? 'positive' : 'negative'
      },
      {
        id: 'offline-critical',
        title: 'Offline / Critical Kiosks',
        value: `${metrics.offlineKiosks} / ${metrics.criticalKiosks}`,
        subText: `${
          metrics.offlineKiosks + metrics.criticalKiosks
        } Kiosk · Repair immediately`,
        tone: 'warning'
      }
    ],
    [metrics, dateRange]
  );

  return (
    <DashboardLayout title='All Hospitals'>
      <div className='container-fluid py-4'>
        {/* Filters moved to Header */}

        {/* Top metric cards */}
        <section className='dashboard-cards mb-4 px-0'>
          <DashboardCards>
            {cards.map(card => (
              <DashboardCard key={card.id} {...card} />
            ))}
          </DashboardCards>
        </section>

        {loading && (
          <div className='alert alert-light border d-flex align-items-center gap-2'>
            <span
              className='spinner-border spinner-border-sm'
              role='status'
              aria-hidden='true'
            />
            <span>Loading centers…</span>
          </div>
        )}
        {error && (
          <div className='alert alert-warning border d-flex justify-content-between align-items-center'>
            <span>{error}</span>
            <button
              className='btn btn-sm btn-outline-secondary'
              onClick={reload}
            >
              Retry
            </button>
          </div>
        )}

        {/* Centers list */}
        <div className='row'>
          {centers.map(center => (
            <div key={center.id} className='col-12 col-md-6 col-lg-4 mb-3'>
              <div className='card shadow-sm h-100'>
                <div className='card-body'>
                  <div className='d-flex justify-content-between align-items-start mb-2'>
                    <h5 className='card-title mb-0'>{center.name}</h5>
                    <span className='badge bg-light text-dark'>
                      {center.hospital}
                    </span>
                  </div>
                  <div className='small text-muted mb-2'>{center.address}</div>
                  <div className='d-flex flex-wrap gap-3'>
                    <div>
                      <div className='text-muted small'>Kiosks</div>
                      <div className='fw-semibold'>{center.kiosks}</div>
                    </div>
                    <div>
                      <div className='text-muted small'>Bookings</div>
                      <div className='fw-semibold'>{center.bookings}</div>
                    </div>
                    <div>
                      <div className='text-muted small'>Mobile Check-ins</div>
                      <div className='fw-semibold'>{center.mobileCheckins}</div>
                    </div>
                    <div>
                      <div className='text-muted small'>Offline / Critical</div>
                      <div className='fw-semibold'>
                        {center.offlineKiosks} / {center.criticalKiosks}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <TrendAnalysis />
      </div>
    </DashboardLayout>
  );
};

export default Centers;

// import React, { useMemo } from 'react';
// import { DashboardLayout } from '@shared/components/Layout';
// import { Row } from 'react-bootstrap';
// import { useCenters } from './CentersContext';
// import DashboardCards, {
//   DashboardCard,
//   DashboardMetricItem
// } from '@features/dashboard/dashboardCards';
// import TrendAnalysis from './trendAnslsyis/TrendAnalysis';
// import { useFilters } from '@shared/contexts/FiltersContext';
// import {
//   generateHospitalData,
//   filterDataByDateRange,
//   calculateMetrics,
//   getComparisonText
// } from '@shared/services/dummyDataService';

// const Centers: React.FC = () => {
//   const { centers, loading, error, reload } = useCenters();
//   const { dateRange, hospital: selectedHospital } = useFilters();

//   // Generate hospital-specific dummy data
//   const hospitalData = useMemo(() => generateHospitalData(), []);

//   // Filters come from context

//   // Get data for selected hospital
//   const currentHospitalData = useMemo(() => {
//     if (selectedHospital === 'All') {
//       // Sum all hospital data
//       const allData = hospitalData['Mediclinic Creek Harbour'].map(
//         (_, index) => {
//           const dayData = Object.values(hospitalData).map(
//             hospital => hospital[index]
//           );
//           return {
//             date: dayData[0].date,
//             totalKiosks: dayData.reduce((sum, day) => sum + day.totalKiosks, 0),
//             totalBookings: dayData.reduce(
//               (sum, day) => sum + day.totalBookings,
//               0
//             ),
//             kioskCheckins: dayData.reduce(
//               (sum, day) => sum + day.kioskCheckins,
//               0
//             ),
//             mobileCheckins: dayData.reduce(
//               (sum, day) => sum + day.mobileCheckins,
//               0
//             ),
//             offlineKiosks: dayData.reduce(
//               (sum, day) => sum + day.offlineKiosks,
//               0
//             ),
//             criticalKiosks: dayData.reduce(
//               (sum, day) => sum + day.criticalKiosks,
//               0
//             ),
//             averageCheckinTime: dayData[0].averageCheckinTime
//           };
//         }
//       );
//       return allData;
//     }
//     return hospitalData[selectedHospital];
//   }, [hospitalData, selectedHospital]);

//   // Filter data based on selected date range
//   const filteredData = useMemo(() => {
//     return filterDataByDateRange(currentHospitalData, dateRange);
//   }, [currentHospitalData, dateRange]);

//   // Calculate metrics from filtered data
//   const metrics = useMemo(() => {
//     const currentPeriod = filteredData;
//     const previousPeriod =
//       dateRange === 'today'
//         ? currentHospitalData.slice(-2, -1) // Previous day for today
//         : dateRange === 'last7days'
//           ? currentHospitalData.slice(-14, -7) // Previous 7 days for last 7 days
//           : currentHospitalData.slice(-60, -30); // Previous 30 days for last 30 days

//     return calculateMetrics(currentPeriod, previousPeriod, dateRange);
//   }, [filteredData, currentHospitalData, dateRange]);

//   // Define cards data with dynamic values
//   const cards: DashboardMetricItem[] = useMemo(
//     () => [
//       {
//         id: 'total-kiosks',
//         title: 'Total Kiosks',
//         value: metrics.totalKiosks.toString(),
//         subText: `${metrics.avgCheckinTime}m Average Check-in Time`
//       },
//       {
//         id: 'total-bookings',
//         title: 'Total Bookings',
//         value: metrics.totalBookings.toString(),
//         subText: `${
//           metrics.bookingsChange >= 0 ? '+' : ''
//         }${metrics.bookingsChange.toFixed(1)}% ${getComparisonText(dateRange)}`,
//         tone: metrics.bookingsChange >= 0 ? 'positive' : 'negative'
//       },
//       {
//         id: 'mobile-checkins',
//         title: 'Mobile Check-ins',
//         value: metrics.mobileCheckins.toString(),
//         subText: `${
//           metrics.mobileCheckinsChange >= 0 ? '+' : ''
//         }${metrics.mobileCheckinsChange.toFixed(1)}% ${getComparisonText(dateRange)}`,
//         tone: metrics.mobileCheckinsChange >= 0 ? 'positive' : 'negative'
//       },
//       {
//         id: 'offline-critical',
//         title: 'Offline / Critical Kiosks',
//         value: `${metrics.offlineKiosks} / ${metrics.criticalKiosks}`,
//         subText: `${
//           metrics.offlineKiosks + metrics.criticalKiosks
//         } Kiosk · Repair immediately`,
//         tone: 'warning'
//       }
//     ],
//     [metrics, dateRange]
//   );

//   return (
//     <DashboardLayout title='All Hospitals'>
//       <div className='container-fluid py-4'>
//         {/* Filters moved to Header */}

//         {/* Top metric cards */}
//         <section className='dashboard-cards mb-4 px-0'>
//           <DashboardCards>
//             {cards.map(card => (
//               <DashboardCard key={card.id} {...card} />
//             ))}
//           </DashboardCards>
//         </section>

//         {loading && (
//           <div className='alert alert-light border d-flex align-items-center gap-2'>
//             <span
//               className='spinner-border spinner-border-sm'
//               role='status'
//               aria-hidden='true'
//             />
//             <span>Loading centers…</span>
//           </div>
//         )}
//         {error && (
//           <div className='alert alert-warning border d-flex justify-content-between align-items-center'>
//             <span>{error}</span>
//             <button
//               className='btn btn-sm btn-outline-secondary'
//               onClick={reload}
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Centers list */}
//         <div className='row'>
//           {centers.map(center => (
//             <div key={center.id} className='col-12 col-md-6 col-lg-4 mb-3'>
//               <div className='card shadow-sm h-100'>
//                 <div className='card-body'>
//                   <div className='d-flex justify-content-between align-items-start mb-2'>
//                     <h5 className='card-title mb-0'>{center.name}</h5>
//                     <span className='badge bg-light text-dark'>
//                       {center.hospital}
//                     </span>
//                   </div>
//                   <div className='small text-muted mb-2'>{center.address}</div>
//                   <div className='d-flex flex-wrap gap-3'>
//                     <div>
//                       <div className='text-muted small'>Kiosks</div>
//                       <div className='fw-semibold'>{center.kiosks}</div>
//                     </div>
//                     <div>
//                       <div className='text-muted small'>Bookings</div>
//                       <div className='fw-semibold'>{center.bookings}</div>
//                     </div>
//                     <div>
//                       <div className='text-muted small'>Mobile Check-ins</div>
//                       <div className='fw-semibold'>{center.mobileCheckins}</div>
//                     </div>
//                     <div>
//                       <div className='text-muted small'>Offline / Critical</div>
//                       <div className='fw-semibold'>
//                         {center.offlineKiosks} / {center.criticalKiosks}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <TrendAnalysis />
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Centers;
