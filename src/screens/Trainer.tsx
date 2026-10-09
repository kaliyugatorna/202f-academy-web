import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { useTrainerStore } from '../store/trainerStore';
import styles from './Trainer.module.css';

const DEMO_USER_ID = '1';

type TrainerMode = 'TRAINER' | 'GUEST' | 'EXAM';

const Trainer: React.FC = () => {
  const mode = useTrainerStore((s) => s.currentMode);
  const setMode = useTrainerStore((s) => s.setMode);
  const messages = useTrainerStore((s) => s.messages);
  const addMessage = useTrainerStore((s) => s.addMessage);
  const [input, setInput] = useState('');

  const userMessages = messages.filter((m) => m.userId === DEMO_USER_ID);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const modeAtSend: TrainerMode = mode;
    const messageId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setInput('');

    const responses: Record<TrainerMode, string> = {
      TRAINER:
        'Начни с самого вероятного фактора: что бы ты изменил первым — помол, дозу или выход?',
      GUEST: 'Вот несколько советов по вашему вопросу...',
      EXAM: 'Пожалуйста, ответьте на этот вопрос без помощи.',
    };

    setTimeout(() => {
      addMessage({
        id: messageId,
        userId: DEMO_USER_ID,
        mode: modeAtSend,
        userMessage: text,
        trainerResponse: responses[modeAtSend],
        isCoaching: modeAtSend === 'TRAINER',
        createdAt: new Date(),
      });
    }, 500);
  };

  return (
    <div className={styles.trainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Тренер</h1>
      </div>

      <div className={styles.modeSelector}>
        {(['TRAINER', 'GUEST', 'EXAM'] as const).map((m) => (
          <Button
            key={m}
            variant={mode === m ? 'primary' : 'secondary'}
            size="small"
            onClick={() => setMode(m)}
          >
            {m === 'TRAINER' ? '💪 Тренер' : m === 'GUEST' ? '👥 Гость' : '📝 Экзамен'}
          </Button>
        ))}
      </div>

      <div className={styles.messagesContainer}>
        {userMessages.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.icon}>🤖</p>
            <p className={styles.text}>
              {mode === 'TRAINER'
                ? 'Я помогу тебе разобраться, но не буду давать прямые ответы'
                : mode === 'GUEST'
                  ? 'Задай мне любой вопрос о кофе'
                  : 'Экзаменационный режим. Показывай свои знания!'}
            </p>
          </div>
        ) : (
          <div className={styles.messages}>
            {userMessages.map((msg) => (
              <React.Fragment key={msg.id}>
                <div className={`${styles.message} ${styles.user}`}>
                  <Card>
                    <p>{msg.userMessage}</p>
                  </Card>
                </div>
                <div className={`${styles.message} ${styles.trainer}`}>
                  <Card>
                    <p>{msg.trainerResponse}</p>
                  </Card>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className={styles.inputForm}>
        <Input
          placeholder="Введи свой вопрос..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
        />
        <Button type="submit" variant="primary">Отправить</Button>
      </form>
    </div>
  );
};

export default Trainer;
