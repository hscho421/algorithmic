import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import VisualizerPage from './pages/VisualizerPage';
import NotFoundPage from './pages/NotFoundPage';
import RoadmapPage from './pages/RoadmapPage';
import PricingPage from './pages/PricingPage';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/visualize/:algorithmId" element={<VisualizerPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
