'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  PlayerProgress,
  loadProgress,
  saveProgress,
  completeLevel as completeLevelFn,
  failLevel as failLevelFn,
  getRank,
  getNextRank,
  isLevelUnlocked,
} from '@/lib/progress/store';

export function useProgress() {
  const [progress, setProgress] = useState<PlayerProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const updateProgress = useCallback((newProgress: PlayerProgress) => {
    setProgress(newProgress);
    saveProgress(newProgress);
  }, []);

  const completeLevel = useCallback(
    (levelId: string, xp: number, timeTaken: number, hintsUsed: number, badges: string[] = []) => {
      if (!progress) return;
      const updated = completeLevelFn(progress, levelId, xp, timeTaken, hintsUsed, badges);
      updateProgress(updated);
      return updated;
    },
    [progress, updateProgress]
  );

  const failLevel = useCallback(() => {
    if (!progress) return;
    updateProgress(failLevelFn(progress));
  }, [progress, updateProgress]);

  const checkUnlocked = useCallback(
    (prerequisites: string[]) => {
      if (!progress) return false;
      return isLevelUnlocked(progress, prerequisites);
    },
    [progress]
  );

  const rank = progress ? getRank(progress.xp) : null;
  const nextRank = progress ? getNextRank(progress.xp) : null;

  return {
    progress,
    rank,
    nextRank,
    completeLevel,
    failLevel,
    checkUnlocked,
    updateProgress,
  };
}
