import { Routes, Route } from 'react-router-dom';
import Dashboard from '@features/dashboard/dashboard';
import Centers from '@features/centers/Centers';
import Reports from '@features/reports/reports';
import KioskUsageReport from '@features/reports/KioskUsageReport';
import PatientFeedbackReport from '@features/reports/patient-feedback/PatientFeedbackReport';
import FinancialReport from '@features/reports/Financial-report/FinancialReport'; // <-- Fix casing here

const MainRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/centers' element={<Centers />} />
      <Route path='/reports' element={<Reports />} />
      <Route path='/reports/kiosk-usage' element={<KioskUsageReport />} />
      <Route
        path='/reports/patient-feedback'
        element={<PatientFeedbackReport />}
      />
      <Route path='/reports/finance-report' element={<FinancialReport />} />
    </Routes>
  );
};

export default MainRouter;
