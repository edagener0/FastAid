import { createBrowserRouter } from 'react-router-dom';

import IncidentDetailPage from './pages/IncidentDetailPage';
import MapPage from './pages/MapPage';
import NearbyPage from './pages/NearbyPage';
import Root from './pages/Root';
import StatisticsPage from './pages/StatisticsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: MapPage },
      { path: 'perto-de-si', Component: NearbyPage },
      { path: 'statistics', Component: StatisticsPage },
      { path: ':incidentId', Component: IncidentDetailPage },
    ],
  },
]);
