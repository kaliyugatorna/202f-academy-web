import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { coffeeConstants } from '../utils/constants';
import { calculators } from '../utils/calculators';
import { useBrewStore } from '../store/brewStore';
import { BrewLog } from '../types';
import styles from './Practice.module.css';

const DEMO_USER_ID = '1';

const brewMethods = Object.values(coffeeConstants.brewMethods);

const Practice: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timer' | 'log' | 'calculator'>('timer');
  const [brewMethod, setBrewMethod] = useState('V60');
  const [timerActive, setTimerActive] = useState(false);
  const [timerValue, setTimerValue] = useState(0);

  const addBrewLog = useBrewStore((s) => s.addBrewLog);

  // Log form state
  const [logCoffee, setLogCoffee] = useState('');
  const [logOrigin, setLogOrigin] = useState('');
  const [logDose, setLogDose] = useState('18');
  const [logWater, setLogWater] = useState('300');
  const [logRatio, setLogRatio] = useState('1:16.7');
  const [logTime, setLogTime] = useState('180');
  const [logTds, setLogTds] = useState('');
  const [logEy, setLogEy] = useState('');
  const [logRating, setLogRating] = useState('4');
  const [logSaved, setLogSaved] = useState(false);

  // Calculator state
  const [calcCoffee, setCalcCoffee] = useState('18');
  const [calcRatio, setCalcRatio] = useState('1:16.7');
  const [eyDose, setEyDose] = useState('18');
  const [eyBeverage, setEyBeverage] = useState('300');
  const [eyTds, setEyTds] = useState('1.35');

  const currentMethod = brewMethods.find((m) => m.id === brewMethod);

  React.useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimerValue((v) => v + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const calcWaterResult = () => {
    const coffee = Number(calcCoffee);
    if (!coffee || coffee <= 0) return null;
    return calculators.brewRatio(coffee, calculators.parseRatio(calcRatio));
  };

  const calcEyResult = () => {
    const dose = Number(eyDose);
    const beverage = Number(eyBeverage);
    const tds = Number(eyTds);
    if (!dose || !beverage || !tds) return null;
    return calculators.extractionYield(dose, beverage, tds);
  };

  const handleSaveLog = () => {
    const dose = Number(logDose) || 0;
    const log: BrewLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: DEMO_USER_ID,
      date: new Date(),
      brewMethod: brewMethod as BrewLog['brewMethod'],
      coffee: logCoffee || 'Без названия',
      origin: logOrigin || undefined,
      dose,
      water: Number(logWater) || 0,
      ratio: calculators.parseRatio(logRatio),
      grindSetting: 0,
      waterTemperature: 92,
      bloomTime: currentMethod?.bloomTime ?? 0,
      totalTime: Number(logTime) || 0,
      tds: logTds ? Number(logTds) : undefined,
      extractionYield: logEy ? Number(logEy) : undefined,
      taste: '',
      notes: '',
      rating: Math.min(5, Math.max(1, Number(logRating) || 1)),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addBrewLog(log);
    setLogSaved(true);
    setTimeout(() => setLogSaved(false), 2000);
  };

  return (
    <div className={styles.practice}>
      <div className={styles.header}>
        <h1 className={styles.title}>Практика</h1>
      </div>

      <div className={styles.tabs}>
        {['timer', 'log', 'calculator'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setActiveTab(tab as typeof activeTab)}
          >
            {tab === 'timer' ? '⏱ Таймер' : tab === 'log' ? '📋 Лог' : '🧮 Калькулятор'}
          </Button>
        ))}
      </div>

      <div className={styles.content}>
        {activeTab === 'timer' && (
          <div className={styles.section}>
            <div className={styles.methodSelector}>
              {brewMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={brewMethod === method.id ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => {
                    setBrewMethod(method.id);
                    setTimerValue(0);
                    setTimerActive(false);
                  }}
                >
                  {method.name}
                </Button>
              ))}
            </div>

            <Card>
              <div className={styles.timerCard}>
                <p className={styles.timerLabel}>Время заварки</p>
                <div className={styles.timerDisplay}>{formatTime(timerValue)}</div>
                <p className={styles.timerTarget}>
                  Цель: {formatTime(currentMethod?.targetTime || 0)}
                </p>

                {(currentMethod?.bloomTime ?? 0) > 0 && (
                  <div className={styles.bloomInfo}>
                    <p>Bloom: {currentMethod?.bloomTime}с</p>
                  </div>
                )}

                <div className={styles.timerControls}>
                  <Button
                    variant="primary"
                    onClick={() => setTimerActive(!timerActive)}
                  >
                    {timerActive ? '⏸ Пауза' : '▶ Старт'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setTimerValue(0);
                      setTimerActive(false);
                    }}
                  >
                    🔄 Сброс
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'log' && (
          <div className={styles.section}>
            <Card>
              <div className={styles.logForm}>
                <h3 className={styles.formTitle}>Запись заварки</h3>
                <div className={styles.methodSelector}>
                  {brewMethods.map((method) => (
                    <Button
                      key={method.id}
                      variant={brewMethod === method.id ? 'primary' : 'secondary'}
                      size="small"
                      onClick={() => setBrewMethod(method.id)}
                    >
                      {method.name}
                    </Button>
                  ))}
                </div>
                <div className={styles.formGroup}>
                  <Input label="Кофе" placeholder="Название кофе" value={logCoffee} onChange={(e) => setLogCoffee(e.target.value)} />
                  <Input label="Происхождение" placeholder="Эфиопия, Кения..." value={logOrigin} onChange={(e) => setLogOrigin(e.target.value)} />
                  <Input label="Доза (г)" type="number" value={logDose} onChange={(e) => setLogDose(e.target.value)} />
                  <Input label="Вода (г)" type="number" value={logWater} onChange={(e) => setLogWater(e.target.value)} />
                  <Input label="Соотношение" placeholder="1:16.7" value={logRatio} onChange={(e) => setLogRatio(e.target.value)} />
                  <Input label="Время заварки (сек)" type="number" value={logTime} onChange={(e) => setLogTime(e.target.value)} />
                  <Input label="TDS (%)" type="number" step="0.01" placeholder="1.35" value={logTds} onChange={(e) => setLogTds(e.target.value)} />
                  <Input label="Extraction Yield (%)" type="number" step="0.1" placeholder="20" value={logEy} onChange={(e) => setLogEy(e.target.value)} />
                  <Input label="Оценка (1-5)" type="number" min="1" max="5" value={logRating} onChange={(e) => setLogRating(e.target.value)} />
                </div>
                <Button variant="primary" fullWidth onClick={handleSaveLog}>
                  {logSaved ? '✓ Сохранено' : '💾 Сохранить запись'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className={styles.section}>
            <Card>
              <div className={styles.calculator}>
                <h3 className={styles.formTitle}>Калькулятор отношения</h3>
                <div className={styles.formGroup}>
                  <Input label="Кофе (г)" type="number" value={calcCoffee} onChange={(e) => setCalcCoffee(e.target.value)} />
                  <Input label="Соотношение" placeholder="1:16.7" value={calcRatio} onChange={(e) => setCalcRatio(e.target.value)} />
                </div>
                <div className={styles.result}>
                  <p>Вода: <strong>{calcWaterResult() !== null ? `${calcWaterResult()} г` : '—'}</strong></p>
                </div>
              </div>
            </Card>

            <Card>
              <div className={styles.calculator}>
                <h3 className={styles.formTitle}>Калькулятор Extraction Yield</h3>
                <div className={styles.formGroup}>
                  <Input label="Доза (г)" type="number" value={eyDose} onChange={(e) => setEyDose(e.target.value)} />
                  <Input label="Вес напитка (г)" type="number" value={eyBeverage} onChange={(e) => setEyBeverage(e.target.value)} />
                  <Input label="TDS (%)" type="number" step="0.01" value={eyTds} onChange={(e) => setEyTds(e.target.value)} />
                </div>
                <div className={styles.result}>
                  <p>EY: <strong>{calcEyResult() !== null ? `${calcEyResult()}%` : '—'}</strong></p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
