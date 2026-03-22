'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Level } from '@/lib/levels/types';

export type LevelPhase = 'pre-lesson' | 'playing' | 'post-lesson' | 'completed' | 'failed';

export function useLevel(level: Level | null) {
  const [phase, setPhase] = useState<LevelPhase>('pre-lesson');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const startTimeRef = useRef<number>(Date.now());
  const [questStepIndex, setQuestStepIndex] = useState(0);
  const levelIdRef = useRef<string | null>(null);

  // Reset all state when the level changes (navigation between levels)
  useEffect(() => {
    const newId = level?.id ?? null;
    if (newId !== levelIdRef.current) {
      levelIdRef.current = newId;
      setPhase('pre-lesson');
      setHintsUsed(0);
      setCurrentHintIndex(-1);
      setQuestStepIndex(0);
      startTimeRef.current = Date.now();
    }
  }, [level?.id]);

  const startPlaying = useCallback(() => {
    setPhase('playing');
    startTimeRef.current = Date.now();
  }, []);

  const useHint = useCallback(() => {
    if (!level) return null;
    const maxHints = level.quest.hints.length;
    if (currentHintIndex + 1 >= maxHints) return null;
    const nextIndex = currentHintIndex + 1;
    setCurrentHintIndex(nextIndex);
    setHintsUsed(h => h + 1);
    return level.quest.hints[nextIndex];
  }, [level, currentHintIndex]);

  const completeQuest = useCallback(() => {
    setPhase('post-lesson');
  }, []);

  const finishLevel = useCallback(() => {
    setPhase('completed');
  }, []);

  const getTimeTaken = useCallback(() => {
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  const advanceStep = useCallback(() => {
    setQuestStepIndex(i => i + 1);
  }, []);

  const failLevel = useCallback(() => {
    setPhase('failed');
  }, []);

  const resetLevel = useCallback(() => {
    setPhase('pre-lesson');
    setHintsUsed(0);
    setCurrentHintIndex(-1);
    setQuestStepIndex(0);
    startTimeRef.current = Date.now();
  }, []);

  return {
    phase,
    hintsUsed,
    currentHintIndex,
    questStepIndex,
    startPlaying,
    useHint,
    completeQuest,
    finishLevel,
    getTimeTaken,
    advanceStep,
    failLevel,
    resetLevel,
  };
}
