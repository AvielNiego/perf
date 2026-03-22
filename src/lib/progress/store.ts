import { RANKS, ALL_BADGES, Rank, Badge } from '@/lib/levels/types';

export interface PlayerProgress {
  completedLevels: string[];
  currentLevelId: string | null;
  xp: number;
  badges: string[];
  hintsUsed: Record<string, number>;
  levelTimes: Record<string, number>;
  streak: number;
  bestStreak: number;
  levelsWithoutHints: number;
  levelsWithoutFail: number;
}

const STORAGE_KEY = 'perfquest_progress';

const defaultProgress: PlayerProgress = {
  completedLevels: [],
  currentLevelId: '1-1',
  xp: 0,
  badges: [],
  hintsUsed: {},
  levelTimes: {},
  streak: 0,
  bestStreak: 0,
  levelsWithoutHints: 0,
  levelsWithoutFail: 0,
};

export function loadProgress(): PlayerProgress {
  if (typeof window === 'undefined') return defaultProgress;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultProgress, ...JSON.parse(saved) };
  } catch {}
  return defaultProgress;
}

export function saveProgress(progress: PlayerProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function getRank(xp: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.xpRequired) current = rank;
    else break;
  }
  return current;
}

export function getNextRank(xp: number): Rank | null {
  for (const rank of RANKS) {
    if (xp < rank.xpRequired) return rank;
  }
  return null;
}

export function getBadgeInfo(badgeId: string): Badge | undefined {
  return ALL_BADGES.find(b => b.id === badgeId);
}

export function completeLevel(
  progress: PlayerProgress,
  levelId: string,
  xpEarned: number,
  timeTaken: number,
  hintsUsed: number,
  newBadges: string[] = []
): PlayerProgress {
  if (progress.completedLevels.includes(levelId)) {
    return progress;
  }

  const updated = { ...progress };
  updated.completedLevels = [...updated.completedLevels, levelId];
  updated.currentLevelId = null; // Will be set by the game page on navigation
  updated.xp += xpEarned;
  updated.levelTimes = { ...updated.levelTimes, [levelId]: timeTaken };
  updated.hintsUsed = { ...updated.hintsUsed, [levelId]: hintsUsed };
  updated.levelsWithoutFail += 1;
  updated.streak += 1;
  if (updated.streak > updated.bestStreak) {
    updated.bestStreak = updated.streak;
  }

  if (hintsUsed === 0) {
    updated.levelsWithoutHints += 1;
  }

  // Check for auto-badges
  const badgesToAdd = [...newBadges];

  if (timeTaken < 120 && !updated.badges.includes('speed-reader')) {
    badgesToAdd.push('speed-reader');
  }
  if (updated.levelsWithoutHints >= 5 && !updated.badges.includes('no-hints')) {
    badgesToAdd.push('no-hints');
  }
  if (updated.levelsWithoutFail >= 10 && !updated.badges.includes('ten-streak')) {
    badgesToAdd.push('ten-streak');
  }

  updated.badges = [...new Set([...updated.badges, ...badgesToAdd])];

  return updated;
}

export function failLevel(progress: PlayerProgress): PlayerProgress {
  return {
    ...progress,
    levelsWithoutFail: 0,
    streak: 0,
  };
}

export function isLevelUnlocked(progress: PlayerProgress, prerequisites: string[]): boolean {
  return prerequisites.every(pre => progress.completedLevels.includes(pre));
}
