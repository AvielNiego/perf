'use client';

import { useProgress } from '@/hooks/useProgress';
import { RANKS, allLevels, acts } from '@/lib/levels';
import BadgeDisplay from '@/components/BadgeDisplay';
import Link from 'next/link';

export default function ProfilePage() {
  const { progress, rank, nextRank } = useProgress();

  if (!progress || !rank) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-[var(--text-secondary)]">Loading...</div>
      </div>
    );
  }

  const xpToNext = nextRank ? nextRank.xpRequired - progress.xp : 0;
  const xpProgress = nextRank
    ? ((progress.xp - rank.xpRequired) / (nextRank.xpRequired - rank.xpRequired)) * 100
    : 100;

  return (
    <div className="h-screen h-[100dvh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-secondary)] border-b border-[var(--bg-tertiary)]">
        <Link
          href="/play"
          className="tap-target text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          ← חזרה
        </Link>
        <h1 className="font-bold rtl-content">📊 פרופיל</h1>
        <div />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Rank card */}
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">⭐</div>
          <h2 className="rtl-content text-2xl font-bold text-[var(--accent-orange)]">
            {rank.title.he}
          </h2>
          <p className="ltr-content text-sm text-[var(--text-secondary)]">
            {rank.title.en}
          </p>
          <div className="mt-4">
            <div className="text-3xl font-bold">{progress.xp}</div>
            <div className="text-sm text-[var(--text-secondary)]">XP</div>
          </div>

          {nextRank && (
            <div className="mt-4">
              <div className="h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-green)] rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-1 rtl-content">
                {xpToNext} XP לדרגה הבאה: {nextRank.title.he}
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--accent-green)]">
              {progress.completedLevels.length}
            </div>
            <div className="text-xs text-[var(--text-secondary)] rtl-content">שלבים שהושלמו</div>
            <div className="text-xs text-[var(--text-secondary)] ltr-content">Levels completed</div>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--accent-purple)]">
              {progress.badges.length}
            </div>
            <div className="text-xs text-[var(--text-secondary)] rtl-content">תגים</div>
            <div className="text-xs text-[var(--text-secondary)] ltr-content">Badges</div>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--accent-blue)]">
              {progress.bestStreak}
            </div>
            <div className="text-xs text-[var(--text-secondary)] rtl-content">רצף שיא</div>
            <div className="text-xs text-[var(--text-secondary)] ltr-content">Best streak</div>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--accent-orange)]">
              {progress.streak}
            </div>
            <div className="text-xs text-[var(--text-secondary)] rtl-content">רצף נוכחי</div>
            <div className="text-xs text-[var(--text-secondary)] ltr-content">Current streak</div>
          </div>
        </div>

        {/* Act progress */}
        <div>
          <h3 className="rtl-content font-bold text-lg mb-3">התקדמות לפי פרק</h3>
          <div className="space-y-2">
            {acts.map((act) => {
              const completed = act.levels.filter((l) =>
                progress.completedLevels.includes(l.id)
              ).length;
              const total = act.levels.length;
              const pct = (completed / total) * 100;

              return (
                <div
                  key={act.id}
                  className="bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] rounded-xl p-3"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="rtl-content text-sm font-medium">{act.title.he}</span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {completed}/{total}
                    </span>
                  </div>
                  <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent-green)] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h3 className="rtl-content font-bold text-lg mb-3">תגים</h3>
          <BadgeDisplay earnedBadges={progress.badges} />
        </div>

        {/* Ranks roadmap */}
        <div>
          <h3 className="rtl-content font-bold text-lg mb-3">דרגות</h3>
          <div className="space-y-2">
            {RANKS.map((r) => {
              const achieved = progress.xp >= r.xpRequired;
              return (
                <div
                  key={r.level}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all
                    ${
                      achieved
                        ? 'bg-[var(--accent-orange)]/10 border-[var(--accent-orange)]/30'
                        : 'bg-[var(--bg-secondary)] border-[var(--bg-tertiary)] opacity-50'
                    }`}
                >
                  <span className="text-xl">{achieved ? '⭐' : '🔒'}</span>
                  <div className="flex-1">
                    <div className="rtl-content text-sm font-medium">{r.title.he}</div>
                    <div className="ltr-content text-xs text-[var(--text-secondary)]">
                      {r.title.en}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {r.xpRequired} XP
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
