'use client';

import { ALL_BADGES } from '@/lib/levels/types';

interface BadgeDisplayProps {
  earnedBadges: string[];
  compact?: boolean;
}

export default function BadgeDisplay({ earnedBadges, compact = false }: BadgeDisplayProps) {
  if (compact) {
    return (
      <div className="flex gap-1 flex-wrap">
        {ALL_BADGES.map((badge) => {
          const earned = earnedBadges.includes(badge.id);
          return (
            <span
              key={badge.id}
              className={`text-xl ${earned ? '' : 'grayscale opacity-30'}`}
              title={`${badge.name.he} / ${badge.name.en}`}
            >
              {badge.icon}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
      {ALL_BADGES.map((badge) => {
        const earned = earnedBadges.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center p-3 rounded-xl border transition-all
              ${
                earned
                  ? 'bg-[var(--bg-tertiary)] border-[var(--accent-orange)]/30'
                  : 'bg-[var(--bg-secondary)] border-[var(--bg-tertiary)] grayscale opacity-40'
              }`}
          >
            <span className="text-3xl mb-1">{badge.icon}</span>
            <span className="text-xs text-center rtl-content font-medium">
              {badge.name.he}
            </span>
            <span className="text-xs text-center ltr-content text-[var(--text-secondary)]">
              {badge.name.en}
            </span>
          </div>
        );
      })}
    </div>
  );
}
