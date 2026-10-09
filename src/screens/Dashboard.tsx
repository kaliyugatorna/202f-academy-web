import React from 'react';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import { useAuthStore } from '../store/authStore';
import { useSkillStore } from '../store/skillStore';
import { useBrewStore } from '../store/brewStore';
import styles from './Dashboard.module.css';

const DEMO_USER_ID = '1';

// Fallback until a real user logs in
const DEMO_PROFILE = {
  currentLevel: 'JUNIOR' as const,
  totalProgress: 31,
  currentStreak: 7,
  totalLessonsCompleted: 8,
  totalTestsPassed: 3,
  totalBrewLogsRecorded: 15,
};

const Dashboard: React.FC = () => {
  const authProfile = useAuthStore((s) => s.profile);
  const skills = useSkillStore((s) => s.skills);
  const skillProgress = useSkillStore((s) => s.userSkillProgress);
  const brewLogs = useBrewStore((s) => s.brewLogs);

  const userId = authProfile?.userId ?? DEMO_USER_ID;
  const profile = authProfile ?? DEMO_PROFILE;
  const brewLogsRecorded = authProfile
    ? brewLogs.filter((b) => b.userId === userId).length
    : DEMO_PROFILE.totalBrewLogsRecorded;

  const skillList = Object.values(skills).map((skill) => {
    const progress = skillProgress[`${userId}-${skill.id}`];
    return {
      id: skill.id,
      name: skill.name,
      level: progress?.level ?? 'NOT_STARTED',
      progress: progress?.progress ?? 0,
    };
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Доброе утро';
    if (hour < 18) return '☀️ Добрый день';
    return '🌙 Добрый вечер';
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.greeting}>{greeting()}</h1>
        <p className={styles.subtitle}>Добро пожаловать в 202F Academy</p>
      </div>

      <div className={styles.levelCard}>
        <Card>
          <div className={styles.levelContent}>
            <div>
              <h2 className={styles.levelTitle}>{profile.currentLevel}</h2>
              <p className={styles.levelSubtitle}>Твой текущий уровень</p>
            </div>
            <div className={styles.progressSection}>
              <ProgressBar value={profile.totalProgress} showLabel={false} />
              <p className={styles.progressLabel}>{profile.totalProgress}%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.statsGrid}>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statIcon}>🔥</span>
            <div>
              <p className={styles.statLabel}>Текущая серия</p>
              <p className={styles.statValue}>{profile.currentStreak} дней</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statIcon}>📚</span>
            <div>
              <p className={styles.statLabel}>Уроков завершено</p>
              <p className={styles.statValue}>{profile.totalLessonsCompleted}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statIcon}>✓</span>
            <div>
              <p className={styles.statLabel}>Тестов пройдено</p>
              <p className={styles.statValue}>{profile.totalTestsPassed}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className={styles.stat}>
            <span className={styles.statIcon}>☕</span>
            <div>
              <p className={styles.statLabel}>Проливов записано</p>
              <p className={styles.statValue}>{brewLogsRecorded}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Навыки</h3>
        <div className={styles.skillsGrid}>
          {skillList.map((skill) => (
            <Card key={skill.id}>
              <div className={styles.skillCard}>
                <p className={styles.skillName}>{skill.name}</p>
                <Badge variant="secondary">{skill.level}</Badge>
                <ProgressBar value={skill.progress} size="small" showLabel={false} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Следующие уровни</h3>
        <div className={styles.levelsGrid}>
          {['SKILLED', 'PRO'].map((level) => (
            <Card key={level} interactive>
              <div className={styles.levelCard2}>
                <h4>{level}</h4>
                <p>🔒 Заблокирован</p>
                <p className={styles.hint}>Завершите текущий уровень</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
