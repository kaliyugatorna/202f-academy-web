import React from 'react';
import styles from './Layout.module.css';

export type NavSection = 'academy' | 'tests' | 'library' | 'trainer' | 'practice';

interface LayoutProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  children: React.ReactNode;
}

const SECTION_TITLES: Record<NavSection, string> = {
  academy: 'Академия',
  tests: 'Тесты',
  library: 'Библиотека',
  trainer: 'Тренер',
  practice: 'Практика',
};

const NAV_ITEMS: { id: NavSection; label: string; icon: string }[] = [
  { id: 'academy', label: 'Академия', icon: '🎓' },
  { id: 'tests', label: 'Тесты', icon: '✅' },
  { id: 'library', label: 'Библиотека', icon: '📚' },
  { id: 'trainer', label: 'Тренер', icon: '🤖' },
  { id: 'practice', label: 'Практика', icon: '⏱' },
];

const Layout: React.FC<LayoutProps> = ({ activeSection, onNavigate, children }) => {
  const title = SECTION_TITLES[activeSection];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <nav className={styles.nav} aria-label="Основная навигация">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.navItem} ${
              activeSection === item.id ? styles.navItemActive : ''
            }`}
            onClick={() => onNavigate(item.id)}
            aria-current={activeSection === item.id ? 'page' : undefined}
          >
            <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
