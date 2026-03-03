import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ErrorBoundary } from './molecules';
import { DashboardLayout } from './templates';
import { DashboardPage, TripsPage, VehiclesPage, DriversPage, MillsPage } from './pages';

export function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/mills" element={<MillsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  );
}
