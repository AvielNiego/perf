import { Act, Level } from './types';

const levels: Level[] = [
  {
    id: '5-1',
    actId: 5,
    levelNumber: 1,
    title: { en: 'The Probe Master', he: 'אדון הגששים' },
    isBoss: false,
    xp: 150,
    prerequisites: ['4-7'],
    commandsIntroduced: ['perf probe', 'perf probe -a', 'perf probe -l'],
    conceptsIntroduced: ['dynamic tracing', 'uprobes', 'kprobes', 'custom events'],
    preLesson: {
      en: 'perf probe lets you create custom events on any function in your program or the kernel. With perf probe -x ./program -a function_name, you add a probe that fires every time that function is called. Then you can record and count those events like any other perf event. This is dynamic tracing — no code changes needed!',
      he: 'perf probe מאפשר ליצור אירועים מותאמים על כל פונקציה בתוכנית או בקרנל. עם perf probe -x ./program -a function_name, מוסיפים גשש שמופעל בכל פעם שהפונקציה נקראת. אחר כך אפשר להקליט ולספור את האירועים האלה כמו כל אירוע perf אחר. זהו מעקב דינמי — בלי שינויי קוד!',
    },
    postLesson: {
      en: 'Dynamic probes give you ultimate flexibility. You can instrument any function without recompiling. This is one of the most advanced features of perf.',
      he: 'גששים דינמיים נותנים גמישות מוחלטת. אפשר למדוד כל פונקציה בלי לקמפל מחדש. זו אחת התכונות המתקדמות ביותר של perf.',
    },
    quest: {
      description: {
        en: 'Add a probe on the function "process_request" in the probe_target program using perf probe. Then list all active probes with perf probe -l to confirm it was added.',
        he: 'הוסיפו גשש על הפונקציה "process_request" בתוכנית probe_target באמצעות perf probe. אחר כך הציגו את כל הגששים הפעילים עם perf probe -l כדי לוודא שהוא נוסף.',
      },
      hints: [
        {
          en: 'Add the probe: perf probe -x ./probe_target -a process_request',
          he: 'הוסיפו את הגשש: perf probe -x ./probe_target -a process_request',
        },
        {
          en: 'List probes: perf probe -l to verify it was created.',
          he: 'הציגו גששים: perf probe -l כדי לוודא שנוצר.',
        },
        {
          en: 'You should see the probe listed with its address and function name.',
          he: 'אתם צריכים לראות את הגשש ברשימה עם הכתובת ושם הפונקציה שלו.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf probe',
      },
    },
    commandPalette: ['perf probe', 'perf probe -a', 'perf probe -l', 'perf probe -d', 'perf record -e'],
  },
  {
    id: '5-2',
    actId: 5,
    levelNumber: 2,
    title: { en: "The Scheduler's Diary", he: 'יומן המתזמן' },
    isBoss: false,
    xp: 150,
    badge: { id: 'scheduler-whisperer', name: { en: 'Scheduler Whisperer', he: 'לוחש למתזמן' }, icon: '🗓️' },
    prerequisites: ['5-1'],
    commandsIntroduced: ['perf sched record', 'perf sched latency'],
    conceptsIntroduced: ['scheduling latency', 'wait time', 'run time'],
    preLesson: {
      en: 'perf sched records scheduling events — when processes are put to sleep, woken up, or moved between CPUs. After recording with perf sched record, use perf sched latency to see how long each process waited before getting CPU time.',
      he: 'perf sched מקליט אירועי תזמון — מתי תהליכים מושהים, מתעוררים או עוברים בין מעבדים. אחרי הקלטה עם perf sched record, השתמשו ב-perf sched latency כדי לראות כמה זמן כל תהליך חיכה לפני שקיבל זמן CPU.',
    },
    postLesson: {
      en: 'perf sched reveals the invisible scheduling decisions of the OS. High scheduling latency means your program is being delayed by other tasks or poor scheduling.',
      he: 'perf sched חושף את החלטות התזמון הבלתי נראות של מערכת ההפעלה. חביון תזמון גבוה אומר שהתוכנית שלכם מתעכבת בגלל משימות אחרות או תזמון לקוי.',
    },
    quest: {
      description: {
        en: 'Record scheduling data with perf sched record for 5 seconds while sched_test is running. Then use perf sched latency to find which process has the worst maximum scheduling latency.',
        he: 'הקליטו נתוני תזמון עם perf sched record למשך 5 שניות בזמן ש-sched_test רץ. אחר כך השתמשו ב-perf sched latency כדי למצוא לאיזה תהליך יש את חביון התזמון המקסימלי הגרוע ביותר.',
      },
      hints: [
        {
          en: 'Run: perf sched record sleep 5 (while sched_test is running).',
          he: 'הריצו: perf sched record sleep 5 (בזמן ש-sched_test רץ).',
        },
        {
          en: 'Then run: perf sched latency --sort max to sort by worst latency.',
          he: 'אחר כך הריצו: perf sched latency --sort max כדי למיין לפי חביון גרוע ביותר.',
        },
        {
          en: 'The process at the top with the highest "Maximum" value has the worst latency.',
          he: 'התהליך בראש עם ערך "Maximum" הגבוה ביותר סובל מהחביון הגרוע ביותר.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf sched latency',
      },
    },
    commandPalette: ['perf sched record', 'perf sched latency', 'perf sched timehist'],
  },
  {
    id: '5-3',
    actId: 5,
    levelNumber: 3,
    title: { en: 'Memory Trails', he: 'שבילי הזיכרון' },
    isBoss: false,
    xp: 150,
    badge: { id: 'memory-detective', name: { en: 'Memory Detective', he: 'בלש הזיכרון' }, icon: '🔍' },
    prerequisites: ['5-2'],
    commandsIntroduced: ['perf mem record', 'perf mem report'],
    conceptsIntroduced: ['memory access profiling', 'load latency', 'cache hit levels', 'NUMA'],
    preLesson: {
      en: 'perf mem profiles memory accesses, showing you where each load and store goes: L1 cache hit, L2 hit, L3 hit, or all the way to RAM. Loads that miss all caches are hundreds of times slower than L1 hits. Use perf mem record to capture and perf mem report to analyze. This reveals cache-unfriendly access patterns.',
      he: 'perf mem עושה פרופיילינג לגישות זיכרון, ומראה לאן כל טעינה ואחסון הולכים: פגיעה ב-L1 cache, פגיעה ב-L2, פגיעה ב-L3, או עד ל-RAM. טעינות שמחמיצות את כל המטמונים איטיות פי מאות מפגיעות ב-L1. השתמשו ב-perf mem record ללכידה ו-perf mem report לניתוח. זה חושף דפוסי גישה לא ידידותיים למטמון.',
    },
    postLesson: {
      en: 'Memory access patterns are often the key to performance. If most loads miss the cache, restructuring your data to be cache-friendly can give 10x speedups.',
      he: 'דפוסי גישה לזיכרון הם לעיתים קרובות המפתח לביצועים. אם רוב הטעינות מחמיצות את המטמון, ארגון מחדש של הנתונים להיות ידידותיים למטמון יכול לתת שיפור פי 10.',
    },
    quest: {
      description: {
        en: 'Record memory access patterns of the cache_test program using perf mem record, then analyze with perf mem report. What percentage of loads hit L1 cache?',
        he: 'הקליטו דפוסי גישה לזיכרון של תוכנית cache_test באמצעות perf mem record, ואז נתחו עם perf mem report. כמה אחוז מהטעינות פגעו ב-L1 cache?',
      },
      hints: [
        {
          en: 'Run: perf mem record ./cache_test to capture memory events.',
          he: 'הריצו: perf mem record ./cache_test ללכידת אירועי זיכרון.',
        },
        {
          en: 'Then: perf mem report --sort=mem to see the memory hierarchy breakdown.',
          he: 'אחר כך: perf mem report --sort=mem כדי לראות את פירוט היררכיית הזיכרון.',
        },
        {
          en: 'Look for "L1 hit" or "L1" entries and note their percentage.',
          he: 'חפשו ערכים של "L1 hit" או "L1" ורשמו את האחוז שלהם.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf mem report',
      },
    },
    commandPalette: ['perf mem record', 'perf mem report', 'perf mem report --sort=mem'],
  },
  {
    id: '5-4',
    actId: 5,
    levelNumber: 4,
    title: { en: 'The Sharing Problem', he: 'בעיית השיתוף' },
    isBoss: false,
    xp: 150,
    prerequisites: ['5-3'],
    commandsIntroduced: ['perf c2c record', 'perf c2c report'],
    conceptsIntroduced: ['false sharing', 'cache line contention', 'HITM', 'multi-core conflicts'],
    preLesson: {
      en: 'When multiple CPU cores access the same cache line and at least one writes to it, the cache line bounces between cores — this is called cache line contention. False sharing happens when unrelated variables happen to be on the same cache line. perf c2c detects this by tracking HITM (Hit In The Modified) events, where one core reads data another core just modified.',
      he: 'כשכמה ליבות CPU ניגשות לאותו קו מטמון ולפחות אחת כותבת אליו, קו המטמון קופץ בין הליבות — זה נקרא תחרות על קו מטמון. שיתוף שקרי קורה כשמשתנים לא קשורים נמצאים במקרה על אותו קו מטמון. perf c2c מזהה זאת על ידי מעקב אחרי אירועי HITM, שבהם ליבה אחת קוראת נתונים שליבה אחרת שינתה.',
    },
    postLesson: {
      en: 'False sharing is a sneaky performance killer in multi-threaded programs. perf c2c makes it visible. The fix is usually padding or separating hot variables to different cache lines.',
      he: 'שיתוף שקרי הוא רוצח ביצועים ערמומי בתוכניות מרובות חוטים. perf c2c הופך אותו לגלוי. התיקון הוא בדרך כלל ריפוד או הפרדת משתנים חמים לקווי מטמון שונים.',
    },
    quest: {
      description: {
        en: 'Record the false_sharing program with perf c2c record, then analyze with perf c2c report. Does the report show HITM events indicating cache line contention? Type "yes" or "no".',
        he: 'הקליטו את תוכנית false_sharing עם perf c2c record, ואז נתחו עם perf c2c report. האם הדוח מראה אירועי HITM שמצביעים על תחרות על קווי מטמון? הקלידו "yes" או "no".',
      },
      hints: [
        {
          en: 'Run: perf c2c record ./false_sharing to capture sharing events.',
          he: 'הריצו: perf c2c record ./false_sharing ללכידת אירועי שיתוף.',
        },
        {
          en: 'Then: perf c2c report to see cache line contention data.',
          he: 'אחר כך: perf c2c report כדי לראות נתוני תחרות על קווי מטמון.',
        },
        {
          en: 'HITM events in the report confirm false sharing is happening.',
          he: 'אירועי HITM בדוח מאשרים ששיתוף שקרי קורה.',
        },
      ],
      validation: {
        type: 'answer_match',
        expected: 'yes|כן',
      },
    },
    commandPalette: ['perf c2c record', 'perf c2c report', 'perf c2c report --stdio'],
  },
  {
    id: '5-5',
    actId: 5,
    levelNumber: 5,
    title: { en: 'The Waiting Game', he: 'משחק ההמתנה' },
    isBoss: false,
    xp: 150,
    prerequisites: ['5-4'],
    commandsIntroduced: ['perf record -e sched:sched_switch', 'off-CPU flame graphs'],
    conceptsIntroduced: ['off-CPU analysis', 'blocked time', 'I/O wait', 'sleep analysis'],
    preLesson: {
      en: 'Sometimes a program is slow not because it uses too much CPU, but because it is waiting — for I/O, locks, or sleep. Regular perf record only captures on-CPU time. For off-CPU analysis, record scheduling events with perf record -e sched:sched_switch -a -g. The -g flag is important here because it captures call stacks, so you can see what code path led to the program being switched off the CPU. Off-CPU flame graphs show you what the program was doing when it was NOT running.',
      he: 'לפעמים תוכנית איטית לא כי היא משתמשת ביותר מדי CPU, אלא כי היא ממתינה — ל-I/O, נעילות או שינה. perf record רגיל לוכד רק זמן on-CPU. לניתוח off-CPU, הקליטו אירועי תזמון עם perf record -e sched:sched_switch -a -g. הדגל g- חשוב כאן כי הוא לוכד סטאקים של קריאות, כך שתוכלו לראות איזה נתיב קוד הוביל להורדת התוכנית מה-CPU. גרפי להבה off-CPU מראים מה התוכנית עשתה כשהיא לא רצה.',
    },
    postLesson: {
      en: 'Off-CPU analysis completes the picture. On-CPU profiling tells you where time is spent computing. Off-CPU profiling tells you where time is spent waiting. Together, they account for all time.',
      he: 'ניתוח off-CPU משלים את התמונה. פרופיילינג on-CPU מגלה איפה מושקע זמן חישוב. פרופיילינג off-CPU מגלה איפה מושקע זמן המתנה. יחד, הם מכסים את כל הזמן.',
    },
    quest: {
      description: {
        en: 'The io_heavy program spends most of its time waiting for I/O. Record scheduling events to identify where it blocks. Use perf record -e sched:sched_switch. What type of operation is it waiting for most?',
        he: 'תוכנית io_heavy מבלה את רוב זמנה בהמתנה ל-I/O. הקליטו אירועי תזמון כדי לזהות איפה היא נחסמת. השתמשו ב-perf record -e sched:sched_switch. לאיזה סוג פעולה היא ממתינה הכי הרבה?',
      },
      hints: [
        {
          en: 'Run: perf record -e sched:sched_switch -a -g sleep 5 while io_heavy is running.',
          he: 'הריצו: perf record -e sched:sched_switch -a -g sleep 5 בזמן ש-io_heavy רץ.',
        },
        {
          en: 'Use perf script to see the raw events and look for what io_heavy was doing before being switched out.',
          he: 'השתמשו ב-perf script כדי לראות אירועים גולמיים וחפשו מה io_heavy עשה לפני שהוחלף.',
        },
        {
          en: 'The program is I/O bound — it spends most time waiting for disk read/write operations.',
          he: 'התוכנית תלויית I/O — היא מבלה את רוב הזמן בהמתנה לפעולות קריאה/כתיבה מדיסק.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf record -e sched:sched_switch',
      },
    },
    commandPalette: ['perf record -e sched:sched_switch', 'perf script', 'perf report', 'stackcollapse-perf.pl', 'flamegraph.pl'],
  },
  {
    id: '5-6',
    actId: 5,
    levelNumber: 6,
    title: { en: 'The Investigation Method', he: 'שיטת החקירה' },
    isBoss: false,
    xp: 150,
    badge: { id: 'bug-hunter', name: { en: 'Bug Hunter', he: 'צייד באגים' }, icon: '🐛' },
    prerequisites: ['5-5'],
    commandsIntroduced: [],
    conceptsIntroduced: ['performance methodology', 'USE method', 'systematic investigation'],
    preLesson: {
      en: 'A systematic investigation method prevents you from guessing. Step 1: Use perf stat for a high-level overview (IPC, cache misses, branch misses). Step 2: Use perf record + report to find the hot function. Step 3: Use perf annotate to find the hot line. Step 4: Use flame graphs to understand the call context. Step 5: Form a hypothesis and verify it.',
      he: 'שיטת חקירה שיטתית מונעת מכם לנחש. שלב 1: השתמשו ב-perf stat לסקירה ברמה גבוהה (IPC, החמצות מטמון, החמצות ענפים). שלב 2: השתמשו ב-perf record + report כדי למצוא את הפונקציה החמה. שלב 3: השתמשו ב-perf annotate כדי למצוא את השורה החמה. שלב 4: השתמשו בגרפי להבה כדי להבין את הקשר הקריאות. שלב 5: גבשו השערה ואמתו אותה.',
    },
    postLesson: {
      en: 'You now have a complete methodology for performance investigation. Start broad, narrow down, and always verify your hypothesis. This disciplined approach separates experts from guessers.',
      he: 'עכשיו יש לכם מתודולוגיה מלאה לחקירת ביצועים. התחילו רחב, צמצמו, ותמיד אמתו את ההשערה. גישה ממושמעת זו מפרידה בין מומחים למנחשים.',
    },
    quest: {
      description: {
        en: 'Apply the full investigation method on the buggy_app program. Follow all 5 steps systematically. What is the root cause: "cpu-bound", "memory-bound", or "io-bound"?',
        he: 'ישמו את שיטת החקירה המלאה על תוכנית buggy_app. עקבו אחרי כל 5 השלבים בשיטתיות. מה הסיבה השורשית: "cpu-bound", "memory-bound" או "io-bound"?',
      },
      hints: [
        {
          en: 'Start with perf stat ./buggy_app to check IPC and cache miss rate.',
          he: 'התחילו עם perf stat ./buggy_app כדי לבדוק IPC ואחוז החמצות מטמון.',
        },
        {
          en: 'Then perf record -g ./buggy_app and perf report to find the hot function.',
          he: 'אחר כך perf record -g ./buggy_app ו-perf report כדי למצוא את הפונקציה החמה.',
        },
        {
          en: 'Check if the bottleneck is CPU computation, memory access patterns, or waiting for I/O.',
          he: 'בדקו אם צוואר הבקבוק הוא חישוב CPU, דפוסי גישה לזיכרון, או המתנה ל-I/O.',
        },
      ],
      validation: {
        type: 'answer_match',
        expected: 'memory-bound|תלוי זיכרון',
      },
    },
    commandPalette: ['perf stat', 'perf stat -e', 'perf record -g', 'perf report', 'perf annotate', 'perf script', 'flamegraph.pl', 'stackcollapse-perf.pl'],
  },
  {
    id: '5-7',
    actId: 5,
    levelNumber: 7,
    title: { en: 'The Final Crisis', he: 'המשבר האחרון' },
    isBoss: true,
    xp: 300,
    badge: { id: 'perf-master', name: { en: 'Perf Master', he: 'מאסטר perf' }, icon: '👑' },
    prerequisites: ['5-6'],
    commandsIntroduced: [],
    conceptsIntroduced: ['complete performance engineering'],
    timeLimitSeconds: 900,
    preLesson: {
      en: 'This is the final challenge of PerfQuest. A complex application has multiple performance problems — CPU hotspots, cache misses, scheduling issues, and possible false sharing. You must use everything you have learned to diagnose and characterize all the problems. There are no hints. Trust your skills and your methodology.',
      he: 'זהו האתגר האחרון של PerfQuest. לאפליקציה מורכבת יש מספר בעיות ביצועים — נקודות חמות ב-CPU, החמצות מטמון, בעיות תזמון ואולי שיתוף שקרי. עליכם להשתמש בכל מה שלמדתם כדי לאבחן ולאפיין את כל הבעיות. אין רמזים. סמכו על הכישורים ועל המתודולוגיה שלכם.',
    },
    postLesson: {
      en: 'Congratulations, Performance Master! You have completed PerfQuest. You can now use the full power of Linux perf to investigate, diagnose, and characterize performance problems. Go forth and optimize!',
      he: 'מזל טוב, אדון הביצועים! השלמתם את PerfQuest. עכשיו אתם יכולים להשתמש בכוח המלא של Linux perf כדי לחקור, לאבחן ולאפיין בעיות ביצועים. לכו ובצעו אופטימיזציה!',
    },
    quest: {
      description: {
        en: 'Complete the final multi-layered performance investigation. Diagnose all problems in the crisis_app.',
        he: 'השלימו את חקירת הביצועים הרב-שכבתית הסופית. אבחנו את כל הבעיות ב-crisis_app.',
      },
      hints: [],
      validation: {
        type: 'multi_step',
        steps: [
          {
            instruction: {
              en: 'Run perf stat on crisis_app. Is the IPC above or below 1.0? Type "above" or "below".',
              he: 'הריצו perf stat על crisis_app. האם ה-IPC מעל או מתחת ל-1.0? הקלידו "above" או "below" (או "מעל"/"מתחת").',
            },
            validation: {
              type: 'answer_match',
              expected: 'below|מתחת',
            },
          },
          {
            instruction: {
              en: 'Record crisis_app with call graphs and generate a flame graph. Save it as crisis_flame.svg. What is the hottest function name?',
              he: 'הקליטו crisis_app עם גרפי קריאות וצרו גרף להבה. שמרו אותו כ-crisis_flame.svg. מה שם הפונקציה החמה ביותר?',
            },
            validation: {
              type: 'file_exists',
              expected: 'crisis_flame.svg',
            },
          },
          {
            instruction: {
              en: 'Use perf mem to check memory access patterns. What percentage of loads miss L1 cache? Type "high" (>30%) or "low" (<10%).',
              he: 'השתמשו ב-perf mem כדי לבדוק דפוסי גישה לזיכרון. כמה אחוז מהטעינות מחמיצות L1 cache? הקלידו "high" (>30%) או "low" (<10%) (או "גבוה"/"נמוך").',
            },
            validation: {
              type: 'answer_match',
              expected: 'high|גבוה',
            },
          },
          {
            instruction: {
              en: 'Use perf c2c to check for false sharing. Are there significant HITM events? Type "yes" or "no".',
              he: 'השתמשו ב-perf c2c כדי לבדוק שיתוף שקרי. האם יש אירועי HITM משמעותיים? הקלידו "yes" או "no" (או "כן"/"לא").',
            },
            validation: {
              type: 'answer_match',
              expected: 'yes|כן',
            },
          },
          {
            instruction: {
              en: 'Based on your full investigation, what is the primary bottleneck: "cpu-compute", "cache-misses", "false-sharing", or "io-wait"?',
              he: 'בהתבסס על החקירה המלאה שלכם, מהו צוואר הבקבוק העיקרי: "cpu-compute", "cache-misses", "false-sharing" או "io-wait" (או "שיתוף שקרי")?',
            },
            validation: {
              type: 'answer_match',
              expected: 'false-sharing|שיתוף שקרי',
            },
          },
        ],
      },
    },
    commandPalette: ['perf stat', 'perf stat -e', 'perf record --call-graph dwarf', 'perf report', 'perf annotate', 'perf script', 'perf mem record', 'perf mem report', 'perf c2c record', 'perf c2c report', 'perf sched record', 'perf sched latency', 'stackcollapse-perf.pl', 'flamegraph.pl', '|', '>'],
  },
];

export const act5: Act = {
  id: 5,
  title: { en: "The Master's Path", he: 'נתיב האדון' },
  subtitle: { en: 'Advanced perf', he: 'perf מתקדם' },
  theme: { en: 'Master probes, scheduling analysis, memory profiling, false sharing detection, and complete investigation methodology', he: 'שלטו בגששים, ניתוח תזמון, פרופיילינג זיכרון, זיהוי שיתוף שקרי ומתודולוגיית חקירה מלאה' },
  levels,
};
