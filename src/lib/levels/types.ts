export interface Lesson {
  he: string;
  en: string;
}

export interface Quest {
  description: Lesson;
  hints: Lesson[];
  validation: {
    type: 'output_contains' | 'file_exists' | 'answer_match' | 'command_run' | 'multi_step';
    expected?: string;
    question?: Lesson;
    answer?: string;
    steps?: ValidationStep[];
  };
}

export interface ValidationStep {
  instruction: Lesson;
  validation: {
    type: 'output_contains' | 'file_exists' | 'answer_match' | 'command_run';
    expected?: string;
    question?: Lesson;
    answer?: string;
  };
}

export interface Level {
  id: string;
  actId: number;
  levelNumber: number;
  title: { en: string; he: string };
  isBoss: boolean;
  xp: number;
  badge?: { id: string; name: { en: string; he: string }; icon: string };
  prerequisites: string[];
  commandsIntroduced: string[];
  conceptsIntroduced: string[];
  preLesson: Lesson;
  postLesson: Lesson;
  quest: Quest;
  timeLimitSeconds?: number;
  commandPalette: string[];
}

export interface Act {
  id: number;
  title: { en: string; he: string };
  subtitle: { en: string; he: string };
  theme: { en: string; he: string };
  levels: Level[];
}

export interface Rank {
  level: number;
  title: { en: string; he: string };
  xpRequired: number;
}

export interface Badge {
  id: string;
  name: { en: string; he: string };
  description: { en: string; he: string };
  icon: string;
}

export const RANKS: Rank[] = [
  { level: 1, title: { en: 'Rookie Observer', he: 'צופה טירון' }, xpRequired: 0 },
  { level: 2, title: { en: 'System Scout', he: 'סייר מערכת' }, xpRequired: 300 },
  { level: 3, title: { en: 'Process Tracker', he: 'עוקב תהליכים' }, xpRequired: 800 },
  { level: 4, title: { en: 'Perf Apprentice', he: 'חניך ביצועים' }, xpRequired: 1500 },
  { level: 5, title: { en: 'Performance Analyst', he: 'מנתח ביצועים' }, xpRequired: 2500 },
  { level: 6, title: { en: 'Optimization Knight', he: 'אביר האופטימיזציה' }, xpRequired: 3500 },
  { level: 7, title: { en: 'Profiling Wizard', he: 'קוסם הפרופיילינג' }, xpRequired: 4800 },
  { level: 8, title: { en: 'Performance Master', he: 'אדון הביצועים' }, xpRequired: 6500 },
];

export const ALL_BADGES: Badge[] = [
  { id: 'tutorial-graduate', name: { en: 'Tutorial Graduate', he: 'סיים הדרכה' }, description: { en: 'Complete Act 1', he: 'השלם את פרק 1' }, icon: '🎓' },
  { id: 'system-thinker', name: { en: 'System Thinker', he: 'חושב מערכתי' }, description: { en: 'Complete Act 2', he: 'השלם את פרק 2' }, icon: '🧠' },
  { id: 'perf-beginner', name: { en: 'Perf Beginner', he: 'מתחיל perf' }, description: { en: 'Complete Act 3', he: 'השלם את פרק 3' }, icon: '📊' },
  { id: 'perf-intermediate', name: { en: 'Perf Intermediate', he: 'perf בינוני' }, description: { en: 'Complete Act 4', he: 'השלם את פרק 4' }, icon: '🔬' },
  { id: 'perf-master', name: { en: 'Perf Master', he: 'מאסטר perf' }, description: { en: 'Complete Act 5', he: 'השלם את פרק 5' }, icon: '👑' },
  { id: 'speed-reader', name: { en: 'Speed Reader', he: 'קורא מהיר' }, description: { en: 'Complete any level in under 2 minutes', he: 'השלם שלב בפחות מ-2 דקות' }, icon: '⚡' },
  { id: 'no-hints', name: { en: 'No Hints Needed', he: 'בלי רמזים' }, description: { en: 'Complete 5 levels without hints', he: 'השלם 5 שלבים בלי רמזים' }, icon: '🎯' },
  { id: 'flame-tamer', name: { en: 'Flame Tamer', he: 'מאלף להבות' }, description: { en: 'Generate your first flame graph', he: 'צור את ה-flame graph הראשון שלך' }, icon: '🔥' },
  { id: 'bug-hunter', name: { en: 'Bug Hunter', he: 'צייד באגים' }, description: { en: 'Find a real performance bug', he: 'מצא באג ביצועים אמיתי' }, icon: '🐛' },
  { id: 'deep-diver', name: { en: 'Deep Diver', he: 'צולל עמוק' }, description: { en: 'Use perf annotate to find a hot instruction', he: 'השתמש ב-perf annotate כדי למצוא הוראה חמה' }, icon: '🤿' },
  { id: 'scheduler-whisperer', name: { en: 'Scheduler Whisperer', he: 'לוחש למתזמן' }, description: { en: 'Analyze scheduling with perf sched', he: 'נתח תזמון עם perf sched' }, icon: '🗓️' },
  { id: 'memory-detective', name: { en: 'Memory Detective', he: 'בלש הזיכרון' }, description: { en: 'Find a cache miss pattern', he: 'מצא דפוס של cache miss' }, icon: '🔍' },
  { id: 'full-stack', name: { en: 'Full Stack', he: 'מלא סטאק' }, description: { en: 'Use record+report+annotate+script in one investigation', he: 'השתמש ב-record+report+annotate+script בחקירה אחת' }, icon: '🏗️' },
  { id: 'ten-streak', name: { en: 'Ten Streak', he: 'רצף עשר' }, description: { en: '10 levels in a row without failing', he: '10 שלבים רצופים בלי לכשול' }, icon: '🔟' },
];
