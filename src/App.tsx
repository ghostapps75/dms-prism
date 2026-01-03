
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Academy from './pages/Academy';
import Bestiary from './pages/Bestiary';
import Toolbelt from './pages/Toolbelt';
import Campaign from './pages/Campaign';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="academy" element={<Academy />} />
          <Route path="bestiary" element={<Bestiary />} />
          <Route path="toolbelt" element={<Toolbelt />} />
          <Route path="campaign" element={<Campaign />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
