'use client';

import { Rank } from '@/lib/levels/types';

interface ProgressBarProps {
  xp: number;
  rank: Rank;
  nextRank: Rank | null;
  completedLevels: number;
  totalLevels: number;
}

export default function ProgressBar({
  xp,
  rank,
  nextRank,
  completedLevels,
  totalLevels,
}: ProgressBarProps) {
  const xpProgress = nextRank
    ? ((xp - rank.xpRequired) / (nextRank.xpRequired - rank.xpRequired)) * 100
    : 100;

  return (
    <div className="bg-[var(--bg-secondary)] border-b border-[var(--bg-tertiary)] px-4 py-2">
      <div className="flex items-center justify-between gap-3">
        {/* Rank + XP */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg">⭐</span>
          <div className="min-w-0">
            <div className="text-xs font-bold text-[var(--accent-orange)] truncate rtl-content">
              {rank.title.he}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">{xp} XP</div>
          </div>
        </div>

        {/* XP bar */}
        <div className="flex-1 max-w-[200px]">
          <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-green)] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, xpProgress)}%` }}
            />
          </div>
        </div>

        {/* Level count */}
        <div className="text-xs text-[var(--text-secondary)] whitespace-nowrap">
          {completedLevels}/{totalLevels}
        </div>
      </div>
    </div>
  );
}
