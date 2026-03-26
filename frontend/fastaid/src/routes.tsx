import { createBrowserRouter } from 'react-router-dom';

import IncidentDetailPage from './pages/IncidentDetailPage';
import MapPage from './pages/MapPage';
import NearbyPage from './pages/NearbyPage';
import Root from './pages/Root';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: MapPage },
      { path: 'perto-de-si', Component: NearbyPage },
      { path: ':incidentId', Component: IncidentDetailPage },
    ],
  },
]);
