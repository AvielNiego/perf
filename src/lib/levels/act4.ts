import { Act, Level } from './types';

const levels: Level[] = [
  {
    id: '4-1',
    actId: 4,
    levelNumber: 1,
    title: { en: 'The Magnifying Lens', he: 'הזכוכית המגדלת' },
    isBoss: false,
    xp: 100,
    badge: { id: 'deep-diver', name: { en: 'Deep Diver', he: 'צולל עמוק' }, icon: '🤿' },
    prerequisites: ['3-8'],
    commandsIntroduced: ['perf annotate'],
    conceptsIntroduced: ['source annotation', 'hot instructions', 'assembly view'],
    preLesson: {
      en: 'perf annotate shows you exactly which lines of source code (or assembly instructions) are consuming the most CPU. After recording with perf record, run perf annotate to zoom in on the hottest function and see a line-by-line breakdown. Hot lines are marked with their percentage of samples.',
      he: 'perf annotate מראה בדיוק אילו שורות קוד מקור (או הוראות אסמבלי) צורכות הכי הרבה CPU. אחרי הקלטה עם perf record, הריצו perf annotate כדי להתמקד בפונקציה החמה ביותר ולראות פירוט שורה אחר שורה. שורות חמות מסומנות באחוז הדגימות שלהן.',
    },
    postLesson: {
      en: 'perf annotate is your magnifying glass. It takes you from knowing which function is slow to knowing which exact line is slow. This precision is what makes perf so powerful.',
      he: 'perf annotate היא הזכוכית המגדלת שלכם. היא לוקחת אתכם מלדעת איזו פונקציה איטית לדעת בדיוק איזו שורה איטית. דיוק זה הוא מה שהופך את perf לכל כך חזק.',
    },
    quest: {
      description: {
        en: 'Record slow_app with perf record, then use perf annotate to find the hottest source line in the hottest function. What line number has the highest percentage?',
        he: 'הקליטו slow_app עם perf record, אחר כך השתמשו ב-perf annotate כדי למצוא את שורת המקור החמה ביותר בפונקציה החמה ביותר. לאיזה מספר שורה יש את האחוז הגבוה ביותר?',
      },
      hints: [
        {
          en: 'First run: perf record ./slow_app to collect samples.',
          he: 'קודם הריצו: perf record ./slow_app כדי לאסוף דגימות.',
        },
        {
          en: 'Then run: perf annotate to see source-level breakdown.',
          he: 'אחר כך הריצו: perf annotate כדי לראות פירוט ברמת הקוד.',
        },
        {
          en: 'Look for the line with the highest percentage number — that is the hot instruction.',
          he: 'חפשו את השורה עם מספר האחוזים הגבוה ביותר — זו ההוראה החמה.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf annotate',
      },
    },
    commandPalette: ['perf record', 'perf annotate', 'perf annotate --stdio'],
  },
  {
    id: '4-2',
    actId: 4,
    levelNumber: 2,
    title: { en: 'The Flame Forge', he: 'כור הלהבות' },
    isBoss: false,
    xp: 150,
    badge: { id: 'flame-tamer', name: { en: 'Flame Tamer', he: 'מאלף להבות' }, icon: '🔥' },
    prerequisites: ['4-1'],
    commandsIntroduced: ['perf script', 'stackcollapse-perf.pl', 'flamegraph.pl'],
    conceptsIntroduced: ['flame graphs', 'stack visualization', 'call hierarchy width'],
    preLesson: {
      en: 'Flame graphs are a visual way to see where CPU time is spent. They are generated from perf data in three steps: perf script dumps raw samples, stackcollapse-perf.pl folds them into stacks, and flamegraph.pl creates an interactive SVG. Each box\'s width shows how much CPU time that function used. Wider means more time.',
      he: 'גרפי להבה הם דרך ויזואלית לראות איפה זמן CPU מושקע. הם נוצרים מנתוני perf בשלושה צעדים: perf script מוציא דגימות גולמיות, stackcollapse-perf.pl מקפל אותן לסטאקים, ו-flamegraph.pl יוצר SVG אינטראקטיבי. הרוחב של כל תיבה מראה כמה זמן CPU הפונקציה השתמשה. רחב יותר אומר יותר זמן.',
    },
    postLesson: {
      en: 'You created your first flame graph! Flame graphs are one of the most popular tools in performance engineering. They make complex call stacks easy to understand at a glance.',
      he: 'יצרתם את גרף הלהבה הראשון שלכם! גרפי להבה הם אחד הכלים הפופולריים ביותר בהנדסת ביצועים. הם הופכים סטאקים מורכבים לקלים להבנה במבט.',
    },
    quest: {
      description: {
        en: 'Generate a flame graph from the existing perf.data file. Use perf script, pipe it through stackcollapse-perf.pl, then flamegraph.pl to create an SVG. What is the widest function at the base of the flame graph (besides the root)?',
        he: 'צרו גרף להבה מקובץ perf.data הקיים. השתמשו ב-perf script, העבירו דרך stackcollapse-perf.pl ואז flamegraph.pl ליצירת SVG. מהי הפונקציה הרחבה ביותר בבסיס גרף הלהבה (חוץ מהשורש)?',
      },
      hints: [
        {
          en: 'The pipeline is: perf script | stackcollapse-perf.pl | flamegraph.pl > flame.svg',
          he: 'הצינור הוא: perf script | stackcollapse-perf.pl | flamegraph.pl > flame.svg',
        },
        {
          en: 'Open the SVG file in a browser to see the interactive flame graph.',
          he: 'פתחו את קובץ ה-SVG בדפדפן כדי לראות את גרף הלהבה האינטראקטיבי.',
        },
        {
          en: 'The widest function at the bottom of the graph (after the root) uses the most total CPU.',
          he: 'הפונקציה הרחבה ביותר בתחתית הגרף (אחרי השורש) משתמשת בהכי הרבה CPU סה"כ.',
        },
      ],
      validation: {
        type: 'file_exists',
        expected: 'flame.svg',
      },
    },
    commandPalette: ['perf script', 'stackcollapse-perf.pl', 'flamegraph.pl', '|', '>'],
  },
  {
    id: '4-3',
    actId: 4,
    levelNumber: 3,
    title: { en: 'Forging Flames', he: 'מחשלים להבות' },
    isBoss: false,
    xp: 150,
    prerequisites: ['4-2'],
    commandsIntroduced: ['grep filtering with perf script'],
    conceptsIntroduced: ['filtered flame graphs', 'differential analysis', 'focused profiling'],
    preLesson: {
      en: 'You can filter flame graphs to focus on specific areas. For example, pipe perf script output through grep to keep only stacks containing a function of interest, then generate the flame graph. You can also compare two flame graphs to see what changed between runs using differential flame graphs.',
      he: 'אפשר לסנן גרפי להבה כדי להתמקד באזורים מסוימים. לדוגמה, העבירו פלט perf script דרך grep כדי לשמור רק סטאקים שמכילים פונקציה מעניינת, ואז צרו את גרף הלהבה. אפשר גם להשוות שני גרפי להבה כדי לראות מה השתנה בין הרצות באמצעות גרפי להבה דיפרנציאליים.',
    },
    postLesson: {
      en: 'Filtered flame graphs let you cut through the noise and focus on what matters. This skill is essential when profiling large applications with many functions.',
      he: 'גרפי להבה מסוננים מאפשרים לחתוך דרך הרעש ולהתמקד במה שחשוב. כישור זה חיוני בפרופיילינג של אפליקציות גדולות עם הרבה פונקציות.',
    },
    quest: {
      description: {
        en: 'Create a filtered flame graph that shows only call stacks containing the function "process_data". Save it as filtered_flame.svg.',
        he: 'צרו גרף להבה מסונן שמציג רק סטאקים של קריאות שמכילים את הפונקציה "process_data". שמרו אותו כ-filtered_flame.svg.',
      },
      hints: [
        {
          en: 'Use grep to filter: perf script | grep -A1 process_data',
          he: 'השתמשו ב-grep לסינון: perf script | grep -A1 process_data',
        },
        {
          en: 'Or use stackcollapse and then grep: perf script | stackcollapse-perf.pl | grep process_data | flamegraph.pl > filtered_flame.svg',
          he: 'או השתמשו ב-stackcollapse ואז grep: perf script | stackcollapse-perf.pl | grep process_data | flamegraph.pl > filtered_flame.svg',
        },
        {
          en: 'The key is filtering the collapsed stacks before passing to flamegraph.pl.',
          he: 'המפתח הוא סינון הסטאקים המקופלים לפני העברה ל-flamegraph.pl.',
        },
      ],
      validation: {
        type: 'file_exists',
        expected: 'filtered_flame.svg',
      },
    },
    commandPalette: ['perf script', 'stackcollapse-perf.pl', 'flamegraph.pl', 'grep', '|', '>'],
  },
  {
    id: '4-4',
    actId: 4,
    levelNumber: 4,
    title: { en: 'Event Types', he: 'סוגי אירועים' },
    isBoss: false,
    xp: 100,
    prerequisites: ['4-3'],
    commandsIntroduced: ['perf stat -e with hw/sw/tracepoint events'],
    conceptsIntroduced: ['hardware counters', 'software counters', 'tracepoint events', 'PMU'],
    preLesson: {
      en: 'perf events come in three flavors. Hardware events (like cycles, instructions, cache-misses) are counted by the CPU\'s Performance Monitoring Unit (PMU). Software events (like page-faults, context-switches) are counted by the kernel. Tracepoints are hooks in kernel code for specific operations like disk I/O or network activity.',
      he: 'אירועי perf באים בשלושה סוגים. אירועי חומרה (כמו cycles, instructions, cache-misses) נספרים על ידי יחידת ניטור הביצועים (PMU) של המעבד. אירועי תוכנה (כמו page-faults, context-switches) נספרים על ידי הקרנל. Tracepoints הם נקודות מעקב בקוד הקרנל לפעולות ספציפיות כמו I/O דיסק או פעילות רשת.',
    },
    postLesson: {
      en: 'Knowing which event type to use is crucial. Hardware events for CPU-bound analysis, software events for OS-level behavior, and tracepoints for specific kernel operations.',
      he: 'לדעת באיזה סוג אירוע להשתמש זה קריטי. אירועי חומרה לניתוח תלוי CPU, אירועי תוכנה להתנהגות ברמת מערכת ההפעלה, ו-tracepoints לפעולות קרנל ספציפיות.',
    },
    quest: {
      description: {
        en: 'Run perf stat with one hardware event (cycles), one software event (page-faults), and one combined: perf stat -e cycles,page-faults ./compute_heavy. How many page faults occurred?',
        he: 'הריצו perf stat עם אירוע חומרה אחד (cycles), אירוע תוכנה אחד (page-faults), ואחד משולב: perf stat -e cycles,page-faults ./compute_heavy. כמה page faults קרו?',
      },
      hints: [
        {
          en: 'Run: perf stat -e cycles,page-faults ./compute_heavy',
          he: 'הריצו: perf stat -e cycles,page-faults ./compute_heavy',
        },
        {
          en: 'Look at the page-faults line in the output for the count.',
          he: 'חפשו את שורת page-faults בפלט כדי לראות את הספירה.',
        },
        {
          en: 'The number before "page-faults" in the output is your answer.',
          he: 'המספר לפני "page-faults" בפלט הוא התשובה.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf stat -e cycles,page-faults',
      },
    },
    commandPalette: ['perf stat -e', 'perf list hw', 'perf list sw', 'perf list tracepoint'],
  },
  {
    id: '4-5',
    actId: 4,
    levelNumber: 5,
    title: { en: 'Filtering the Noise', he: 'מסננים את הרעש' },
    isBoss: false,
    xp: 100,
    prerequisites: ['4-4'],
    commandsIntroduced: ['perf record -p'],
    conceptsIntroduced: ['PID filtering', 'targeted profiling'],
    preLesson: {
      en: 'On a busy system, perf record captures everything by default. You can focus on a specific process using -p PID. This profiles only that process, reducing noise and file size while focusing on what matters.',
      he: 'במערכת עמוסה, perf record לוכד הכל כברירת מחדל. אפשר להתמקד בתהליך ספציפי עם -p PID. זה עושה פרופיילינג רק לתהליך הזה, מפחית רעש וגודל קובץ תוך התמקדות במה שחשוב.',
    },
    postLesson: {
      en: 'Filtering is essential in real-world profiling. Production systems run many processes — you need to focus perf on exactly what you are investigating.',
      he: 'סינון חיוני בפרופיילינג בעולם האמיתי. מערכות ייצור מריצות הרבה תהליכים — צריך למקד את perf בדיוק במה שחוקרים.',
    },
    quest: {
      description: {
        en: 'The stress_test program is running. Use perf record -p with its PID to profile only that process for 5 seconds. Then check perf report — does it show only stress_test functions?',
        he: 'תוכנית stress_test רצה. השתמשו ב-perf record -p עם ה-PID שלה כדי לעשות פרופיילינג רק לתהליך הזה למשך 5 שניות. אחר כך בדקו ב-perf report — האם הוא מראה רק פונקציות של stress_test?',
      },
      hints: [
        {
          en: 'First find the PID: ps aux | grep stress_test',
          he: 'קודם מצאו את ה-PID: ps aux | grep stress_test',
        },
        {
          en: 'Then record: perf record -p <PID> sleep 5',
          he: 'אחר כך הקליטו: perf record -p <PID> sleep 5',
        },
        {
          en: 'Run perf report --stdio to verify only stress_test symbols appear.',
          he: 'הריצו perf report --stdio כדי לוודא שרק סמלים של stress_test מופיעים.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf record -p',
      },
    },
    commandPalette: ['perf record -p', 'perf report', 'ps aux', 'grep'],
  },
  {
    id: '4-6',
    actId: 4,
    levelNumber: 6,
    title: { en: 'Stack Detective', he: 'בלש הסטאק' },
    isBoss: false,
    xp: 150,
    prerequisites: ['4-5'],
    commandsIntroduced: ['perf record --call-graph dwarf'],
    conceptsIntroduced: ['DWARF unwinding', 'frame pointers', 'accurate call stacks'],
    preLesson: {
      en: 'The default -g flag in perf uses frame pointers to unwind call stacks, but modern compilers often omit them. Frame pointer unwinding only works if the program was compiled with -fno-omit-frame-pointer. For accurate stacks without recompiling, use --call-graph dwarf — it uses debug info and works everywhere. DWARF is the safest choice when you cannot recompile.',
      he: 'הדגל -g הרגיל ב-perf משתמש ב-frame pointers כדי לפרום סטאקים, אבל קומפיילרים מודרניים לעיתים משמיטים אותם. פריסה באמצעות frame pointers עובדת רק אם התוכנית קומפלה עם fno-omit-frame-pointer-. לסטאקים מדויקים בלי קומפילציה מחדש, השתמשו ב---call-graph dwarf — הוא משתמש במידע ניפוי ועובד בכל מקום. DWARF הוא הבחירה הבטוחה ביותר כשלא ניתן לקמפל מחדש.',
    },
    postLesson: {
      en: 'Accurate call stacks are critical for understanding program behavior. When you see broken or incomplete stacks, switch to --call-graph dwarf for reliable results.',
      he: 'סטאקים מדויקים קריטיים להבנת התנהגות תוכנית. כשרואים סטאקים שבורים או חלקיים, עברו ל---call-graph dwarf לתוצאות אמינות.',
    },
    quest: {
      description: {
        en: 'Record slow_app with DWARF call graph unwinding: perf record --call-graph dwarf ./slow_app. Then check perf report — are the call stacks complete compared to the default -g? Type "yes" if they are more complete.',
        he: 'הקליטו slow_app עם פריסת גרף קריאות DWARF: perf record --call-graph dwarf ./slow_app. אחר כך בדקו ב-perf report — האם סטאקים של קריאות מלאים יותר בהשוואה ל-g- הרגיל? הקלידו "yes" אם הם מלאים יותר.',
      },
      hints: [
        {
          en: 'Run: perf record --call-graph dwarf ./slow_app',
          he: 'הריצו: perf record --call-graph dwarf ./slow_app',
        },
        {
          en: 'Then check: perf report --stdio and look at the call chain depth.',
          he: 'אחר כך בדקו: perf report --stdio והסתכלו על עומק שרשרת הקריאות.',
        },
        {
          en: 'DWARF unwinding typically gives more complete stacks than frame pointer based unwinding.',
          he: 'פריסת DWARF בדרך כלל נותנת סטאקים מלאים יותר מפריסה מבוססת frame pointers.',
        },
      ],
      validation: {
        type: 'answer_match',
        expected: 'yes|כן',
      },
    },
    commandPalette: ['perf record --call-graph dwarf', 'perf report', 'perf report --stdio', 'gcc -fno-omit-frame-pointer'],
  },
  {
    id: '4-7',
    actId: 4,
    levelNumber: 7,
    title: { en: 'Guild Examination', he: 'מבחן הגילדה' },
    isBoss: true,
    xp: 300,
    badge: { id: 'perf-intermediate', name: { en: 'Perf Intermediate', he: 'perf בינוני' }, icon: '🔬' },
    prerequisites: ['4-6'],
    commandsIntroduced: [],
    conceptsIntroduced: ['full perf workflow'],
    timeLimitSeconds: 600,
    preLesson: {
      en: 'The Guild Examination is your most challenging test yet. You must use record, report, annotate, and script together to perform a complete investigation. This is how real performance engineers work — combining multiple tools to find and understand performance problems.',
      he: 'מבחן הגילדה הוא המבחן המאתגר ביותר שלכם עד כה. עליכם להשתמש ב-record, report, annotate ו-script יחד כדי לבצע חקירה מלאה. כך עובדים מהנדסי ביצועים אמיתיים — משלבים כמה כלים כדי למצוא ולהבין בעיות ביצועים.',
    },
    postLesson: {
      en: 'You passed the Guild Examination! You can now use the full perf toolkit for intermediate-level performance investigations. The advanced arts of probing, scheduling, and memory analysis await.',
      he: 'עברתם את מבחן הגילדה! עכשיו אתם יכולים להשתמש בערכת הכלים המלאה של perf לחקירות ביצועים ברמה בינונית. האומנויות המתקדמות של גישוש, תזמון וניתוח זיכרון מחכות.',
    },
    quest: {
      description: {
        en: 'Complete the full investigation challenge using record, report, annotate, and script.',
        he: 'השלימו את אתגר החקירה המלא באמצעות record, report, annotate ו-script.',
      },
      hints: [],
      validation: {
        type: 'multi_step',
        steps: [
          {
            instruction: {
              en: 'Record the guild_challenge program with DWARF call graphs: perf record --call-graph dwarf ./guild_challenge',
              he: 'הקליטו את תוכנית guild_challenge עם גרפי קריאות DWARF: perf record --call-graph dwarf ./guild_challenge',
            },
            validation: {
              type: 'command_run',
              expected: 'perf record --call-graph dwarf',
            },
          },
          {
            instruction: {
              en: 'Use perf report --stdio to find the function with the highest self overhead. What is its name?',
              he: 'השתמשו ב-perf report --stdio כדי למצוא את הפונקציה עם ה-self overhead הגבוה ביותר. מה שמה?',
            },
            validation: {
              type: 'answer_match',
              expected: 'matrix_multiply',
            },
          },
          {
            instruction: {
              en: 'Use perf annotate to find the hottest line in matrix_multiply. What percentage of samples hit that line?',
              he: 'השתמשו ב-perf annotate כדי למצוא את השורה החמה ביותר ב-matrix_multiply. כמה אחוזים מהדגימות פגעו בשורה הזו?',
            },
            validation: {
              type: 'command_run',
              expected: 'perf annotate',
            },
          },
          {
            instruction: {
              en: 'Generate a flame graph from the data. Save it as guild_flame.svg.',
              he: 'צרו גרף להבה מהנתונים. שמרו אותו כ-guild_flame.svg.',
            },
            validation: {
              type: 'file_exists',
              expected: 'guild_flame.svg',
            },
          },
        ],
      },
    },
    commandPalette: ['perf record --call-graph dwarf', 'perf report --stdio', 'perf annotate', 'perf script', 'stackcollapse-perf.pl', 'flamegraph.pl', '|', '>'],
  },
];

export const act4: Act = {
  id: 4,
  title: { en: 'The Deeper Arts', he: 'האומנויות העמוקות' },
  subtitle: { en: 'Intermediate perf', he: 'perf בינוני' },
  theme: { en: 'Master annotate, flame graphs, event types, filtering, and call graph methods', he: 'שלטו ב-annotate, גרפי להבה, סוגי אירועים, סינון ושיטות גרפי קריאות' },
  levels,
};
