import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

interface Question {
  id: string;
  text: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

const QUESTIONS: Question[] = [
  { id: 'q1', text: 'Pytanie 1', options: { A: 'Odp A', B: 'Odp B', C: 'Odp C', D: 'Odp D' }, correctAnswer: 'A' },
  { id: 'q2', text: 'Pytanie 2', options: { A: 'Odp A', B: 'Odp B', C: 'Odp C', D: 'Odp D' }, correctAnswer: 'B' },
  { id: 'q3', text: 'Pytanie 3', options: { A: 'Odp A', B: 'Odp B', C: 'Odp C', D: 'Odp D' }, correctAnswer: 'C' },
  { id: 'q4', text: 'Pytanie 4', options: { A: 'Odp A', B: 'Odp B', C: 'Odp C', D: 'Odp D' }, correctAnswer: 'D' },
  { id: 'q5', text: 'Pytanie 5', options: { A: 'Odp A', B: 'Odp B', C: 'Odp C', D: 'Odp D' }, correctAnswer: 'A' },
  { id: 'q6', text: 'Pytanie 6', options: { A: 'Odp A', B: 'Odp B', C: 'Odp C', D: 'Odp D' }, correctAnswer: 'B' },
  { id: 'q7', text: 'Pytanie 7', options: { A: 'Odp A', B: 'Odp B', C: 'Odp C', D: 'Odp D' }, correctAnswer: 'C' },
  { id: 'q8', text: 'Pytanie 8', options: { A: 'Odp A', B: 'Odp B', C: 'Odp C', D: 'Odp D' }, correctAnswer: 'D' },
  { id: 'q9', text: 'Pytanie 9', options: { A: 'Odp A', B: 'Odp B', C: 'Odp C', D: 'Odp D' }, correctAnswer: 'A' },
  { id: 'q10', text: 'Pytanie 10', options: { A: 'Odp A', B: 'Odp B', C: 'Odp C', D: 'Odp D' }, correctAnswer: 'B' },
];

const Etap1Screen: React.FC = () => {
  const { uczestnik, token } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!uczestnik || !token) {
    return <div>Brak dostępu.</div>;
  }

  const handleAnswer = (optionKey: string) => {
    const question = QUESTIONS[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: optionKey }));
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const calculateScore = () => {
    let score = 0;
    QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    const score = calculateScore();

    try {
      const docRef = doc(db, 'Uczestnicy', token);
      await updateDoc(docRef, {
        'Etap1.wynik': score,
        'Etap1.zakonczono': true,
      });
      setIsCompleted(true);
    } catch (err) {
      console.error('Błąd podczas zapisywania wyniku:', err);
      setError('Wystąpił błąd podczas wysyłania wyników. Spróbuj ponownie.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return <div>Zakończono etap 1. Dziękujemy za udział!</div>;
  }

  if (currentQuestionIndex >= QUESTIONS.length) {
    return (
      <div>
        <h2>Podsumowanie</h2>
        <p>Odpowiedziałeś na wszystkie pytania.</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Wysyłanie...' : 'Zatwierdź i wyślij'}
        </button>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <div>
      <h2>Pytanie {currentQuestionIndex + 1} z {QUESTIONS.length}</h2>
      <p>{currentQuestion.text}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(Object.entries(currentQuestion.options) as [keyof typeof currentQuestion.options, string][]).map(([key, value]) => (
          <button key={key} onClick={() => handleAnswer(key)}>
            {key}: {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Etap1Screen;
