import { useState } from 'react';
import Layout, { NavSection } from './components/Layout';
import Dashboard from './screens/Dashboard';
import Tests from './screens/Tests';
import Library from './screens/Library';
import Trainer from './screens/Trainer';
import Practice from './screens/Practice';
import { useSeedData } from './hooks/useSeedData';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('academy');

  useSeedData();

  return (
    <Layout activeSection={activeSection} onNavigate={setActiveSection}>
      {activeSection === 'academy' && <Dashboard />}
      {activeSection === 'tests' && <Tests />}
      {activeSection === 'library' && <Library />}
      {activeSection === 'trainer' && <Trainer />}
      {activeSection === 'practice' && <Practice />}
    </Layout>
  );
}

export default App;
