'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';
import { getLevelById, allLevels, ALL_BADGES } from '@/lib/levels';
import { useProgress } from '@/hooks/useProgress';
import { useLevel } from '@/hooks/useLevel';
import Terminal from '@/components/Terminal';
import QuestPanel from '@/components/QuestPanel';
import CommandPalette from '@/components/CommandPalette';
import LessonModal from '@/components/LessonModal';
import Link from 'next/link';

export default function GameClient() {
  const params = useParams();
  const router = useRouter();
  const levelId = params.levelId as string;
  const level = getLevelById(levelId);
  const { progress, rank, completeLevel: completeLevelProgress, failLevel: failLevelProgress, checkUnlocked, updateProgress } = useProgress();
  const {
    phase,
    hintsUsed,
    questStepIndex,
    startPlaying,
    useHint,
    completeQuest,
    finishLevel,
    getTimeTaken,
    advanceStep,
    failLevel,
    resetLevel,
  } = useLevel(level ?? null);

  const insertTextRef = useRef<((text: string) => void) | null>(null);
  const [currentHint, setCurrentHint] = useState<{ he: string; en: string } | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [terminalWsUrl] = useState<string | null>(
    typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_TERMINAL_WS_URL || `ws://${window.location.host}/ws/level/${levelId}`)
      : null
  );
  const [newBadges, setNewBadges] = useState<{ name: { en: string; he: string }; icon: string }[]>([]);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const completedRef = useRef(false);

  // Reset local state when level changes
  useEffect(() => {
    setElapsedSeconds(0);
    setCurrentHint(null);
    setNewBadges([]);
    setWrongAnswer(false);
    completedRef.current = false;
  }, [levelId]);

  // Timer
  useEffect(() => {
    if (phase !== 'playing') return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Time limit enforcement
  useEffect(() => {
    if (level?.timeLimitSeconds && elapsedSeconds >= level.timeLimitSeconds && phase === 'playing') {
      failLevel();
      failLevelProgress();
    }
  }, [elapsedSeconds, level, phase, failLevel, failLevelProgress]);

  const handleInsertText = useCallback((text: string) => {
    insertTextRef.current?.(text);
  }, []);

  const handleUseHint = useCallback(() => {
    const hint = useHint();
    if (hint) {
      setCurrentHint(hint);
    }
  }, [useHint]);

  const getExpectedAnswer = useCallback((validation: { type: string; expected?: string; answer?: string }) => {
    return (validation.answer || validation.expected || '').toLowerCase().trim();
  }, []);

  const handleCompleteQuest = useCallback(() => {
    if (!level || !progress || completedRef.current) return;
    completedRef.current = true;
    const timeTaken = getTimeTaken();
    const levelBadges = level.badge ? [level.badge.id] : [];
    const updatedProgress = completeLevelProgress(levelId, level.xp, timeTaken, hintsUsed, levelBadges);

    if (updatedProgress) {
      const earned = updatedProgress.badges.filter((b: string) => !progress.badges.includes(b));
      const badgeInfos = earned.map((id: string) => ALL_BADGES.find((b) => b.id === id)).filter(Boolean) as typeof ALL_BADGES;
      setNewBadges(badgeInfos);
    }

    completeQuest();
  }, [level, progress, getTimeTaken, completeLevelProgress, levelId, hintsUsed, completeQuest]);

  const handleFinishLevel = useCallback(() => {
    finishLevel();
    const currentIndex = allLevels.findIndex((l) => l.id === levelId);
    if (currentIndex < allLevels.length - 1) {
      router.push(`/play/${allLevels[currentIndex + 1].id}`);
    } else {
      router.push('/play');
    }
  }, [finishLevel, levelId, router]);

  const handleSubmitAnswer = useCallback(
    (answer: string) => {
      if (!level) return;

      const currentValidation =
        level.quest.validation.steps?.[questStepIndex]?.validation ||
        level.quest.validation;

      const expectedRaw = getExpectedAnswer(currentValidation);
      const given = answer.toLowerCase().trim();
      const acceptedAnswers = expectedRaw.split('|').map(a => a.trim());
      if (acceptedAnswers.some(a => a === given)) {
        setWrongAnswer(false);
        if (level.quest.validation.steps && questStepIndex < level.quest.validation.steps.length - 1) {
          advanceStep();
        } else {
          handleCompleteQuest();
        }
      } else {
        setWrongAnswer(true);
        setTimeout(() => setWrongAnswer(false), 2000);
      }
    },
    [level, questStepIndex, advanceStep, getExpectedAnswer, handleCompleteQuest]
  );

  const handleRetry = useCallback(() => {
    resetLevel();
    setElapsedSeconds(0);
    setCurrentHint(null);
    setWrongAnswer(false);
  }, [resetLevel]);

  if (!level) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="rtl-content text-[var(--text-secondary)]">שלב לא נמצא</p>
          <Link href="/play" className="text-[var(--accent-blue)] mt-2 block">חזרה למפה</Link>
        </div>
      </div>
    );
  }

  if (!progress || !rank) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  if (!checkUnlocked(level.prerequisites)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="rtl-content text-[var(--text-secondary)]">השלם את השלבים הקודמים תחילה</p>
          <Link href="/play" className="text-[var(--accent-blue)] mt-2 block">חזרה למפה</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen h-[100dvh] flex flex-col">
      {phase === 'pre-lesson' && (
        <LessonModal lesson={level.preLesson} type="pre" levelTitle={level.title} onContinue={startPlaying} />
      )}

      {phase === 'post-lesson' && (
        <LessonModal lesson={level.postLesson} type="post" levelTitle={level.title} onContinue={handleFinishLevel} xpEarned={level.xp} badges={newBadges} />
      )}

      {phase === 'failed' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="text-4xl">&#x23F0;</div>
            <div className="rtl-content text-lg font-bold text-[var(--accent-red)]">נגמר הזמן!</div>
            <div className="text-sm text-[var(--text-secondary)]">Time&apos;s up! Try again.</div>
            <div className="flex gap-3">
              <button onClick={handleRetry} className="flex-1 py-3 rounded-lg text-sm font-medium bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30 active:scale-95 transition-all">
                נסה שוב
              </button>
              <Link href="/play" className="flex-1 py-3 rounded-lg text-sm font-medium text-center bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--bg-tertiary)] active:scale-95 transition-all">
                חזרה למפה
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--bg-secondary)] border-b border-[var(--bg-tertiary)]">
        <Link href="/play" className="tap-target text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">&#x2190;</Link>
        <div className="text-xs text-[var(--text-secondary)]">{level.id} &mdash; {level.title.he}</div>
        <div className="text-xs text-[var(--accent-orange)]">{level.xp} XP{level.isBoss && ' ⚔️'}</div>
      </div>

      {phase === 'playing' && (
        <QuestPanel quest={level.quest} isBoss={level.isBoss} currentHint={currentHint} hintsUsed={hintsUsed} maxHints={level.quest.hints.length} onUseHint={handleUseHint} timeLimitSeconds={level.timeLimitSeconds} elapsedSeconds={elapsedSeconds} questStepIndex={questStepIndex} onSubmitAnswer={handleSubmitAnswer} wrongAnswer={wrongAnswer} />
      )}

      {phase === 'playing' && (
        <CommandPalette commands={level.commandPalette} onInsertText={handleInsertText} />
      )}

      <div className="flex-1 min-h-0">
        <Terminal wsUrl={terminalWsUrl} insertTextRef={insertTextRef} />
      </div>
    </div>
  );
}
