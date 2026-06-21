import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

// Lazy loading pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const EventWorkspacePage = lazy(() => import('./pages/EventWorkspacePage'));
const EventListPage = lazy(() => import('./pages/events/EventListPage'));
const CreateEventPage = lazy(() => import('./pages/events/CreateEventPage'));
const EventDetailPage = lazy(() => import('./pages/events/EventDetailPage'));
const EventPhasesPage = lazy(() => import('./pages/events/EventPhasesPage'));
const EventTeamPage = lazy(() => import('./pages/events/EventTeamPage'));
const PlanningDashboardPage = lazy(() => import('./pages/planning/PlanningDashboardPage'));
const TaskManagementPage = lazy(() => import('./pages/planning/TaskManagementPage'));
const ResourceDashboardPage = lazy(() => import('./pages/resources/ResourceDashboardPage'));
const BudgetDashboardPage = lazy(() => import('./pages/budget/BudgetDashboardPage'));
const VendorDirectoryPage = lazy(() => import('./pages/vendors/VendorDirectoryPage'));
const ExecutionDashboardPage = lazy(() => import('./pages/execution/ExecutionDashboardPage'));
const DocumentLibraryPage = lazy(() => import('./pages/documents/DocumentLibraryPage'));
const ReportingDashboardPage = lazy(() => import('./pages/reporting/ReportingDashboardPage'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 400 }}>
    Loading...
  </div>
);

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          <Route path="workspace" element={<EventWorkspacePage />} />
          
          <Route path="events">
            <Route index element={<EventListPage />} />
            <Route path="new" element={<CreateEventPage />} />
            <Route path=":id" element={<EventDetailPage />} />
            <Route path=":id/phases" element={<EventPhasesPage />} />
            <Route path=":id/team" element={<EventTeamPage />} />
          </Route>
          
          <Route path="planning">
            <Route index element={<PlanningDashboardPage />} />
            <Route path="tasks" element={<TaskManagementPage />} />
          </Route>
          
          <Route path="resources">
            <Route index element={<ResourceDashboardPage />} />
          </Route>
          
          <Route path="budget">
            <Route index element={<BudgetDashboardPage />} />
          </Route>
          
          <Route path="vendors">
            <Route index element={<VendorDirectoryPage />} />
          </Route>
          
          <Route path="execution">
            <Route index element={<ExecutionDashboardPage />} />
          </Route>
          
          <Route path="documents">
            <Route index element={<DocumentLibraryPage />} />
          </Route>
          
          <Route path="reporting">
            <Route index element={<ReportingDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
