'use client';

import { Lesson } from '@/lib/levels/types';

interface LessonModalProps {
  lesson: Lesson;
  type: 'pre' | 'post';
  levelTitle: { en: string; he: string };
  onContinue: () => void;
  xpEarned?: number;
  badges?: { name: { en: string; he: string }; icon: string }[];
}

export default function LessonModal({
  lesson,
  type,
  levelTitle,
  onContinue,
  xpEarned,
  badges,
}: LessonModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--bg-secondary)] border border-[var(--bg-tertiary)] shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div
          className={`px-6 py-4 ${
            type === 'pre'
              ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/30'
              : 'bg-gradient-to-r from-green-600/30 to-emerald-600/30'
          }`}
        >
          <div className="text-sm text-[var(--text-secondary)] mb-1">
            {type === 'pre' ? '📖 לפני שמתחילים' : '✅ סיכום'}
          </div>
          <h2 className="rtl-content text-xl font-bold">{levelTitle.he}</h2>
          <p className="ltr-content text-sm text-[var(--text-secondary)] mt-1">
            {levelTitle.en}
          </p>
        </div>

        {/* Lesson content */}
        <div className="p-6 space-y-4">
          {/* Hebrew */}
          <div className="rtl-content bg-[var(--bg-tertiary)] rounded-xl p-4">
            <div className="text-xs text-blue-400 mb-2 font-semibold">🇮🇱 עברית</div>
            <p className="text-base leading-relaxed">{lesson.he}</p>
          </div>

          {/* English */}
          <div className="ltr-content bg-[var(--bg-tertiary)] rounded-xl p-4">
            <div className="text-xs text-blue-400 mb-2 font-semibold">🇬🇧 English</div>
            <p className="text-base leading-relaxed">{lesson.en}</p>
          </div>

          {/* XP earned (post-lesson only) */}
          {type === 'post' && xpEarned !== undefined && (
            <div className="text-center py-2">
              <span className="xp-pulse inline-block text-2xl font-bold text-[var(--accent-orange)]">
                +{xpEarned} XP
              </span>
            </div>
          )}

          {/* Badges earned (post-lesson only) */}
          {type === 'post' && badges && badges.length > 0 && (
            <div className="text-center space-y-2">
              <div className="text-sm text-[var(--text-secondary)]">🏆 תגים חדשים!</div>
              <div className="flex justify-center gap-3 flex-wrap">
                {badges.map((badge, i) => (
                  <div
                    key={i}
                    className="badge-unlock flex flex-col items-center bg-[var(--bg-primary)] rounded-xl px-4 py-3"
                  >
                    <span className="text-3xl">{badge.icon}</span>
                    <span className="text-xs mt-1 rtl-content">{badge.name.he}</span>
                    <span className="text-xs text-[var(--text-secondary)] ltr-content">
                      {badge.name.en}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Continue button */}
        <div className="px-6 pb-6">
          <button
            onClick={onContinue}
            className="tap-target w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95
              bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400
              text-white shadow-lg"
          >
            {type === 'pre' ? '!בואו נתחיל' : 'המשך ▶'}
          </button>
        </div>
      </div>
    </div>
  );
}
