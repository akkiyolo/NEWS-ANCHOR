import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Personalized } from './pages/Personalized';
import { Feed } from './pages/Feed';
import { Anchor } from './pages/Anchor';
import { Settings } from './pages/Settings';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/personalized" replace />} />
        <Route path="/personalized" element={<Personalized />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/anchor" element={<Anchor />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/personalized" replace />} />
      </Routes>
    </Layout>
  );
}
