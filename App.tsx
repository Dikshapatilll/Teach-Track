
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Timetable from './pages/Timetable';
import Reports from './pages/Reports';
import LeaveManagement from './pages/LeaveManagement';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/leave" element={<LeaveManagement />} />
      </Routes>
    </Layout>
  );
}

export default App;
