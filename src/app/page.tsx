'use client';

import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import BadgeDisplay from '@/components/BadgeDisplay';
import { useState, useEffect } from 'react';

const STORY_LINES = [
  { he: 'השרתים של החברה איטיים...', en: 'The company servers are slow...' },
  { he: 'הלקוחות כועסים. הבוס רוצה תשובות.', en: 'Customers are angry. The boss wants answers.' },
  { he: 'רק את/ה יכול/ה למצוא את הבעיה.', en: 'Only YOU can find the problem.' },
  { he: 'למד את הכלים. חקור את המערכת. הצל את היום.', en: 'Learn the tools. Investigate the system. Save the day.' },
];

function TypingText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text, onDone]);
  return <span>{displayed}<span className="animate-pulse">_</span></span>;
}

export default function HomePage() {
  const { progress, rank } = useProgress();
  const [storyStep, setStoryStep] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const isReturning = progress && progress.completedLevels.length > 0;

  useEffect(() => {
    if (isReturning) {
      setShowContent(true);
      return;
    }
    // Auto-advance story for new users
    if (storyStep < STORY_LINES.length) {
      const timer = setTimeout(() => setStoryStep(s => s + 1), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowContent(true);
    }
  }, [storyStep, isReturning]);

  return (
    <div className="h-screen h-[100dvh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] overflow-hidden">
      {/* Animated terminal frame */}
      <div className="w-full max-w-md mb-6">
        <div className="bg-black border border-[var(--accent-green)]/30 rounded-xl overflow-hidden shadow-2xl shadow-green-900/20">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--bg-tertiary)]">
            <div className="w-3 h-3 rounded-full bg-[var(--accent-red)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--accent-orange)]" />
            <div className="w-3 h-3 rounded-full bg-[var(--accent-green)]" />
            <span className="text-xs text-[var(--text-secondary)] ml-2 font-mono">perfquest@server:~$</span>
          </div>

          {/* Terminal content */}
          <div className="p-4 font-mono text-sm min-h-[160px]">
            {!isReturning ? (
              <div className="space-y-2">
                {STORY_LINES.slice(0, storyStep).map((line, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="rtl-content text-[var(--accent-green)]">{line.he}</div>
                    <div className="ltr-content text-[var(--text-secondary)] text-xs">{line.en}</div>
                  </div>
                ))}
                {storyStep < STORY_LINES.length && (
                  <div className="rtl-content text-[var(--accent-green)]">
                    <TypingText text={STORY_LINES[storyStep].he} />
                  </div>
                )}
                {storyStep >= STORY_LINES.length && (
                  <div className="ltr-content text-[var(--accent-blue)] mt-3 animate-pulse">
                    $ ./start_investigation
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <div className="ltr-content text-[var(--accent-green)]">$ perfquest --status</div>
                <div className="ltr-content text-[var(--text-secondary)]">
                  Rank: {rank?.title.en} | XP: {progress?.xp} | Levels: {progress?.completedLevels.length}/36
                </div>
                <div className="ltr-content text-[var(--accent-blue)] mt-2 animate-pulse">
                  $ ./continue_investigation
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logo */}
      <h1 className="text-4xl font-bold mb-1 text-center">
        <span className="text-[var(--accent-green)]">Perf</span>
        <span className="text-[var(--accent-blue)]">Quest</span>
      </h1>
      <p className="rtl-content text-sm text-[var(--text-secondary)] mb-6">
        חקור ביצועים. מצא בעיות. הפוך למומחה.
      </p>

      {/* Returning player badges */}
      {isReturning && rank && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">⭐</span>
          <span className="rtl-content text-sm font-bold text-[var(--accent-orange)]">{rank.title.he}</span>
          <span className="text-xs text-[var(--text-secondary)]">&middot; {progress?.xp} XP</span>
          <BadgeDisplay earnedBadges={progress?.badges ?? []} compact />
        </div>
      )}

      {/* Action buttons */}
      <div
        className={`space-y-3 w-full max-w-sm transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Link
          href="/play"
          className="tap-target block w-full py-4 rounded-xl font-bold text-lg text-center
            bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-blue)]
            text-white shadow-lg shadow-green-900/30 active:scale-95 transition-all"
        >
          {isReturning ? '▶ המשך לחקור' : '▶ התחל חקירה'}
        </Link>

        {isReturning && (
          <Link
            href="/profile"
            className="tap-target block w-full py-3 rounded-xl font-medium text-center
              bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--bg-tertiary)]
              hover:border-[var(--accent-blue)]/30 active:scale-95 transition-all"
          >
            📊 פרופיל והתקדמות
          </Link>
        )}
      </div>

      {/* Skip intro for new users */}
      {!isReturning && !showContent && (
        <button
          onClick={() => { setStoryStep(STORY_LINES.length); setShowContent(true); }}
          className="mt-4 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          דלג על ההקדמה →
        </button>
      )}
    </div>
  );
}
