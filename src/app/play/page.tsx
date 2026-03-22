'use client';

import { useProgress } from '@/hooks/useProgress';
import ProgressBar from '@/components/ProgressBar';
import LevelMap from '@/components/LevelMap';
import Link from 'next/link';
import { acts, allLevels } from '@/lib/levels';

export default function PlayPage() {
  const { progress, rank, nextRank } = useProgress();

  if (!progress || !rank) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen h-[100dvh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--bg-tertiary)]">
        <Link
          href="/"
          className="tap-target text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          ← חזרה
        </Link>
        <h1 className="font-bold">
          <span className="text-[var(--accent-green)]">Perf</span>
          <span className="text-[var(--accent-blue)]">Quest</span>
        </h1>
        <Link
          href="/profile"
          className="tap-target text-lg"
        >
          ⭐
        </Link>
      </div>

      {/* Progress bar */}
      <ProgressBar
        xp={progress.xp}
        rank={rank}
        nextRank={nextRank}
        completedLevels={progress.completedLevels.length}
        totalLevels={allLevels.length}
      />

      {/* Level map */}
      <div className="flex-1 overflow-hidden">
        <LevelMap
          acts={acts}
          completedLevels={progress.completedLevels}
          currentLevelId={progress.currentLevelId}
        />
      </div>
    </div>
  );
}
