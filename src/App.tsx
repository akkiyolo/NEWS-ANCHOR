import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Personalized } from './pages/Personalized';
import { Feed } from './pages/Feed';
import { Anchor } from './pages/Anchor';
import { Settings } from './pages/Settings';
import { Debate } from './pages/Debate';
import { Bias } from './pages/Bias';
import { Fakeness } from './pages/Fakeness';
import { Explain } from './pages/Explain';
import { Archive } from './pages/Archive';
import { Trends } from './pages/Trends';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/personalized" replace />} />
        <Route path="/personalized" element={<Personalized />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/debate" element={<Debate />} />
        <Route path="/bias" element={<Bias />} />
        <Route path="/fakeness" element={<Fakeness />} />
        <Route path="/explain" element={<Explain />} />
        <Route path="/anchor" element={<Anchor />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/personalized" replace />} />
      </Routes>
    </Layout>
  );
}
