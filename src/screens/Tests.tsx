import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import styles from './Tests.module.css';

interface Test {
  id: string;
  title: string;
  category: string;
  level: 'BASE' | 'MEDIUM' | 'PRO';
  questions: number;
  passed: boolean | null;
  score: number | null;
}

const tests: Test[] = [
  { id: 'test-1', title: 'Основы зерна', category: 'Зерно', level: 'BASE', questions: 10, passed: true, score: 90 },
  { id: 'test-2', title: 'Помол и экстракция', category: 'Помол', level: 'BASE', questions: 10, passed: true, score: 85 },
  { id: 'test-3', title: 'Эспрессо базовый', category: 'Эспрессо', level: 'BASE', questions: 15, passed: false, score: 70 },
  { id: 'test-4', title: 'Молоко и капучино', category: 'Молоко', level: 'BASE', questions: 10, passed: null, score: null },
  { id: 'test-5', title: 'Дайлинг PRO', category: 'Дайлинг', level: 'PRO', questions: 20, passed: null, score: null },
  { id: 'test-6', title: 'Сенсорика', category: 'Сенсорика', level: 'MEDIUM', questions: 15, passed: null, score: null },
];

const Tests: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed' | 'available'>('all');

  const filteredTests = tests.filter((test) => {
    if (filter === 'all') return true;
    if (filter === 'passed') return test.passed === true;
    if (filter === 'failed') return test.passed === false;
    if (filter === 'available') return test.passed === null;
    return true;
  });

  return (
    <div className={styles.tests}>
      <div className={styles.header}>
        <h1 className={styles.title}>Тесты</h1>
      </div>

      <div className={styles.filters}>
        {(['all', 'available', 'passed', 'failed'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setFilter(f)}
          >
            {f === 'all' && 'Все'}
            {f === 'available' && 'Доступные'}
            {f === 'passed' && 'Пройденные'}
            {f === 'failed' && 'Не пройденные'}
          </Button>
        ))}
      </div>

      <div className={styles.grid}>
        {filteredTests.map((test) => (
          <Card key={test.id} className={styles.testCard}>
            <div className={styles.testHeader}>
              <Badge variant={test.level === 'PRO' ? 'danger' : test.level === 'MEDIUM' ? 'warning' : 'primary'}>
                {test.level}
              </Badge>
              <span className={styles.category}>{test.category}</span>
            </div>
            <h3 className={styles.testTitle}>{test.title}</h3>
            <div className={styles.testMeta}>
              <span>{test.questions} вопросов</span>
              {test.passed !== null && (
                <span className={test.passed ? styles.passed : styles.failed}>
                  {test.passed ? '✓ Пройден' : '✗ Не пройден'}
                </span>
              )}
              {test.score !== null && <span>{test.score}%</span>}
            </div>
            <Button
              fullWidth
              variant={test.passed === true ? 'secondary' : 'primary'}
            >
              {test.passed === true ? 'Повторить' : 'Начать тест'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tests;
