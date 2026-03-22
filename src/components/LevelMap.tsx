'use client';

import { Act } from '@/lib/levels/types';
import Link from 'next/link';

interface LevelMapProps {
  acts: Act[];
  completedLevels: string[];
  currentLevelId: string | null;
}

const ACT_COLORS = [
  'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  'from-green-500/20 to-emerald-500/20 border-green-500/30',
  'from-orange-500/20 to-amber-500/20 border-orange-500/30',
  'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  'from-red-500/20 to-rose-500/20 border-red-500/30',
];

const ACT_ICONS = ['🎮', '🧠', '📊', '🔬', '👑'];

export default function LevelMap({ acts, completedLevels, currentLevelId }: LevelMapProps) {
  const isLevelAccessible = (prerequisites: string[]) =>
    prerequisites.every((pre) => completedLevels.includes(pre));

  return (
    <div className="space-y-6 p-4 overflow-y-auto max-h-[calc(100dvh-120px)]">
      {acts.map((act, actIndex) => {
        const actCompleted = act.levels.every((l) =>
          completedLevels.includes(l.id)
        );

        return (
          <div key={act.id} className="space-y-2">
            {/* Act header */}
            <div
              className={`bg-gradient-to-r ${ACT_COLORS[actIndex]} border rounded-xl p-4`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ACT_ICONS[actIndex]}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="rtl-content font-bold text-lg truncate">
                    {act.title.he}
                    {actCompleted && ' ✅'}
                  </h2>
                  <p className="ltr-content text-sm text-[var(--text-secondary)] truncate">
                    {act.title.en}
                  </p>
                  <p className="rtl-content text-xs text-[var(--text-secondary)] mt-1">
                    {act.subtitle.he}
                  </p>
                </div>
              </div>
            </div>

            {/* Level buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 px-2">
              {act.levels.map((level) => {
                const completed = completedLevels.includes(level.id);
                const accessible = isLevelAccessible(level.prerequisites);
                const isCurrent = level.id === currentLevelId;

                return (
                  <Link
                    key={level.id}
                    href={accessible ? `/play/${level.id}` : '#'}
                    className={`tap-target flex flex-col items-center p-3 rounded-xl border transition-all
                      ${
                        completed
                          ? 'bg-[var(--accent-green)]/10 border-[var(--accent-green)]/30 text-[var(--accent-green)]'
                          : isCurrent
                          ? 'bg-[var(--accent-blue)]/10 border-[var(--accent-blue)]/50 text-[var(--accent-blue)] quest-active'
                          : accessible
                          ? 'bg-[var(--bg-tertiary)] border-[var(--bg-tertiary)] text-[var(--text-primary)] hover:border-[var(--accent-blue)]/30'
                          : 'bg-[var(--bg-secondary)] border-[var(--bg-tertiary)] text-[var(--text-secondary)] opacity-40 cursor-not-allowed'
                      }
                      ${!accessible ? 'pointer-events-none' : 'active:scale-95'}
                    `}
                  >
                    <span className="text-lg font-bold">
                      {completed ? '✅' : level.isBoss ? '⚔️' : level.id}
                    </span>
                    <span className="text-xs text-center mt-1 rtl-content line-clamp-1">
                      {level.title.he}
                    </span>
                    {level.isBoss && (
                      <span className="text-xs text-[var(--accent-orange)] mt-0.5">
                        BOSS
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
