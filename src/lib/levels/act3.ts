import { Act, Level } from './types';

const levels: Level[] = [
  {
    id: '3-1',
    actId: 3,
    levelNumber: 1,
    title: { en: 'Event Catalog', he: 'קטלוג האירועים' },
    isBoss: false,
    xp: 100,
    prerequisites: ['2-9'],
    commandsIntroduced: ['perf list', 'sudo'],
    conceptsIntroduced: ['hardware events', 'software events', 'tracepoints'],
    preLesson: {
      en: 'perf can measure many different events happening inside your CPU and operating system. The command perf list shows all available events. Events are grouped into hardware events (like CPU cycles and cache misses), software events (like page faults), and tracepoints (kernel-level hooks). Some perf commands need elevated privileges — use sudo before the command to run it with administrator rights. Note: perf may need permissions to access hardware counters. Run cat /proc/sys/kernel/perf_event_paranoid to check the current setting — a value of 2 or higher restricts perf to your own processes, and higher values may block hardware events entirely. If you get permission errors, ask your admin to lower this value or use sudo.',
      he: 'perf יכול למדוד הרבה אירועים שונים שקורים בתוך המעבד ומערכת ההפעלה. הפקודה perf list מציגה את כל האירועים הזמינים. אירועים מחולקים לאירועי חומרה (כמו מחזורי CPU והחמצות מטמון), אירועי תוכנה (כמו page faults) ו-tracepoints (נקודות מעקב ברמת הקרנל). חלק מפקודות perf צריכות הרשאות מוגברות — השתמשו ב-sudo לפני הפקודה כדי להריץ אותה עם הרשאות מנהל. שימו לב: ייתכן ש-perf צריך הרשאות כדי לגשת למוני חומרה. הריצו cat /proc/sys/kernel/perf_event_paranoid כדי לבדוק את ההגדרה הנוכחית — ערך של 2 או יותר מגביל את perf לתהליכים שלכם בלבד, וערכים גבוהים יותר עלולים לחסום אירועי חומרה לגמרי. אם מקבלים שגיאות הרשאה, בקשו מהמנהל להוריד את הערך או השתמשו ב-sudo.',
    },
    postLesson: {
      en: 'perf list is your event catalog. Whenever you need to measure something specific, check this list first to find the right event name.',
      he: 'perf list הוא קטלוג האירועים שלכם. כשתצטרכו למדוד משהו מסוים, בדקו את הרשימה הזו קודם כדי למצוא את שם האירוע הנכון.',
    },
    quest: {
      description: {
        en: 'Run perf list and find the name of the hardware event that counts CPU cycles. Write the event name exactly as shown.',
        he: 'הריצו perf list ומצאו את שם אירוע החומרה שסופר מחזורי CPU. כתבו את שם האירוע בדיוק כפי שמוצג.',
      },
      hints: [
        {
          en: 'Run perf list and look under "Hardware event" section.',
          he: 'הריצו perf list וחפשו תחת "Hardware event".',
        },
        {
          en: 'Look for an event related to CPU cycles — it measures clock ticks.',
          he: 'חפשו אירוע שקשור למחזורי CPU — הוא מודד תקתוקי שעון.',
        },
        {
          en: 'The event is called "cycles" or "cpu-cycles". If perf gives a permission error, check: cat /proc/sys/kernel/perf_event_paranoid — you may need sudo.',
          he: 'האירוע נקרא "cycles" או "cpu-cycles". אם perf נותן שגיאת הרשאה, בדקו: cat /proc/sys/kernel/perf_event_paranoid — ייתכן שתצטרכו sudo.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf list',
      },
    },
    commandPalette: ['perf list', 'perf list hw', 'perf list sw', 'perf list tracepoint', 'cat /proc/sys/kernel/perf_event_paranoid'],
  },
  {
    id: '3-2',
    actId: 3,
    levelNumber: 2,
    title: { en: "The Counter's Art", he: 'אומנות הספירה' },
    isBoss: false,
    xp: 100,
    prerequisites: ['3-1'],
    commandsIntroduced: ['perf stat'],
    conceptsIntroduced: ['IPC', 'instructions', 'cycles', 'counting mode'],
    preLesson: {
      en: 'perf stat runs a command and counts hardware events during its execution. It shows you cycles, instructions, cache misses, and more. The most important metric is IPC (Instructions Per Cycle) — it tells you how efficiently the CPU is working. IPC varies by CPU type and workload, so there is no single "good" number. Compare your program\'s IPC to a simple baseline (like a tight loop) to see if it is efficient. Low IPC often means the CPU is waiting for memory.',
      he: 'perf stat מריץ פקודה וסופר אירועי חומרה במהלך הריצה. הוא מראה מחזורים, הוראות, החמצות מטמון ועוד. המדד החשוב ביותר הוא IPC (הוראות למחזור) — הוא אומר כמה יעיל המעבד. IPC משתנה לפי סוג המעבד ואופי העבודה, אז אין מספר "טוב" יחיד. השוו את ה-IPC של התוכנית שלכם לבסיס פשוט (כמו לולאה צפופה) כדי לראות אם היא יעילה. IPC נמוך לרוב אומר שהמעבד ממתין לזיכרון.',
    },
    postLesson: {
      en: 'perf stat is your first real profiling tool! IPC is the vital sign of your program — high IPC means the CPU is busy computing, low IPC means it is stalling.',
      he: 'perf stat הוא כלי הפרופיילינג האמיתי הראשון שלכם! IPC הוא הסימן החיוני של התוכנית — IPC גבוה אומר שה-CPU עסוק בחישובים, IPC נמוך אומר שהוא תקוע.',
    },
    quest: {
      description: {
        en: 'Run perf stat on the provided compute_heavy program. What is the IPC (instructions per cycle) value? Round to one decimal place.',
        he: 'הריצו perf stat על תוכנית compute_heavy שסופקה. מה ערך ה-IPC (הוראות למחזור)? עגלו לספרה עשרונית אחת.',
      },
      hints: [
        {
          en: 'Run: perf stat ./compute_heavy',
          he: 'הריצו: perf stat ./compute_heavy',
        },
        {
          en: 'Look for the line that says "insn per cycle" or "IPC" in the output.',
          he: 'חפשו את השורה שאומרת "insn per cycle" או "IPC" בפלט.',
        },
        {
          en: 'The IPC value appears next to "insn per cycle". Round 2.35 to 2.4, for example.',
          he: 'ערך ה-IPC מופיע ליד "insn per cycle". עגלו 2.35 ל-2.4, לדוגמה.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf stat',
      },
    },
    commandPalette: ['perf stat', 'perf list'],
  },
  {
    id: '3-3',
    actId: 3,
    levelNumber: 3,
    title: { en: 'Choosing What to Count', he: 'בוחרים מה לספור' },
    isBoss: false,
    xp: 100,
    prerequisites: ['3-2'],
    commandsIntroduced: ['perf stat -e'],
    conceptsIntroduced: ['event selection', 'cache-misses', 'branch-misses'],
    preLesson: {
      en: 'You can tell perf stat exactly which events to count using the -e flag. For example, perf stat -e cache-misses,cache-references ./program counts only cache events. You can combine multiple events separated by commas. This lets you focus on specific performance aspects like cache behavior or branch prediction.',
      he: 'אפשר להגיד ל-perf stat בדיוק אילו אירועים לספור עם הדגל -e. לדוגמה, perf stat -e cache-misses,cache-references ./program סופר רק אירועי מטמון. אפשר לשלב כמה אירועים מופרדים בפסיקים. זה מאפשר להתמקד בהיבטי ביצועים ספציפיים כמו התנהגות מטמון או חיזוי ענפים.',
    },
    postLesson: {
      en: 'Now you can choose exactly what to measure. This is like choosing which instruments to use in a lab — picking the right events is key to diagnosing the right problem.',
      he: 'עכשיו אתם יכולים לבחור בדיוק מה למדוד. זה כמו לבחור אילו מכשירים להשתמש במעבדה — בחירת האירועים הנכונים היא המפתח לאבחון הבעיה הנכונה.',
    },
    quest: {
      description: {
        en: 'Run perf stat with the events cache-misses and cache-references on the provided cache_test program. What is the cache miss rate percentage?',
        he: 'הריצו perf stat עם האירועים cache-misses ו-cache-references על תוכנית cache_test שסופקה. מה אחוז החמצות המטמון?',
      },
      hints: [
        {
          en: 'Run: perf stat -e cache-misses,cache-references ./cache_test',
          he: 'הריצו: perf stat -e cache-misses,cache-references ./cache_test',
        },
        {
          en: 'Look for the cache-misses line — it shows the miss rate as a percentage of cache-references.',
          he: 'חפשו את שורת cache-misses — היא מראה את אחוז ההחמצות מתוך cache-references.',
        },
        {
          en: 'The percentage appears after the cache-misses count, something like "25.3% of all cache refs".',
          he: 'האחוז מופיע אחרי ספירת cache-misses, משהו כמו "25.3% of all cache refs".',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf stat -e',
      },
    },
    commandPalette: ['perf stat -e', 'perf list hw', 'perf list sw'],
  },
  {
    id: '3-4',
    actId: 3,
    levelNumber: 4,
    title: { en: 'The Live Mirror', he: 'המראה החיה' },
    isBoss: false,
    xp: 100,
    prerequisites: ['3-3'],
    commandsIntroduced: ['perf top'],
    conceptsIntroduced: ['live profiling', 'hotspot detection'],
    preLesson: {
      en: 'perf top shows you a live, continuously updating view of which functions are using the most CPU right now — like a "top" command but for CPU functions instead of processes. Press q to quit. This is great for quickly finding hotspots on a running system without recording anything.',
      he: 'perf top מראה תצוגה חיה ומתעדכנת של אילו פונקציות משתמשות בהכי הרבה CPU כרגע — כמו פקודת "top" אבל לפונקציות CPU במקום תהליכים. לחצו q ליציאה. זה מעולה למציאה מהירה של נקודות חמות במערכת רצה בלי להקליט כלום.',
    },
    postLesson: {
      en: 'perf top gives you an instant X-ray of your system. Use it when you want a quick look at what is consuming CPU before diving deeper with perf record.',
      he: 'perf top נותן צילום רנטגן מיידי של המערכת. השתמשו בו כשרוצים מבט מהיר על מה צורך CPU לפני צלילה עמוקה עם perf record.',
    },
    quest: {
      description: {
        en: 'Run perf top for a few seconds while the stress_test program is running. What function name appears at the top of the list (consuming the most CPU)?',
        he: 'הריצו perf top לכמה שניות בזמן שתוכנית stress_test רצה. איזה שם פונקציה מופיע בראש הרשימה (צורך הכי הרבה CPU)?',
      },
      hints: [
        {
          en: 'The stress_test process is already running on the server. Just run perf top to see it.',
          he: 'תהליך stress_test כבר רץ על השרת. פשוט הריצו perf top כדי לראות אותו.',
        },
        {
          en: 'The function at the top of the perf top display uses the most CPU.',
          he: 'הפונקציה בראש תצוגת perf top צורכת הכי הרבה CPU.',
        },
        {
          en: 'Press q to quit perf top. The top function name is your answer.',
          he: 'לחצו q ליציאה מ-perf top. שם הפונקציה העליונה הוא התשובה.',
        },
      ],
      validation: {
        type: 'answer_match',
        expected: 'hot_loop',
      },
    },
    commandPalette: ['perf top', 'perf top -p'],
  },
  {
    id: '3-5',
    actId: 3,
    levelNumber: 5,
    title: { en: 'Record and Report', he: 'מקליט ומדווח' },
    isBoss: false,
    xp: 150,
    prerequisites: ['3-4'],
    commandsIntroduced: ['perf record', 'perf report'],
    conceptsIntroduced: ['sampling', 'perf.data', 'overhead column'],
    preLesson: {
      en: 'perf record samples a running program and saves the data to a file called perf.data. Then perf report reads that file and shows you which functions took the most CPU time. This two-step process lets you record once and analyze many times. The "Overhead" column in the report shows each function\'s percentage of total samples.',
      he: 'perf record דוגם תוכנית רצה ושומר את הנתונים לקובץ בשם perf.data. אחר כך perf report קורא את הקובץ ומראה אילו פונקציות לקחו הכי הרבה זמן CPU. התהליך הדו-שלבי הזה מאפשר להקליט פעם אחת ולנתח כמה פעמים. עמודת "Overhead" בדוח מראה את אחוז הדגימות של כל פונקציה.',
    },
    postLesson: {
      en: 'perf record + perf report is the bread and butter of performance analysis. You will use this pair constantly in real-world profiling work.',
      he: 'perf record + perf report הם הלחם והחמאה של ניתוח ביצועים. תשתמשו בצמד הזה כל הזמן בעבודת פרופיילינג אמיתית.',
    },
    quest: {
      description: {
        en: 'Record the provided slow_app program with perf record, then open the report with perf report. Which function has the highest overhead percentage?',
        he: 'הקליטו את תוכנית slow_app עם perf record, ואז פתחו את הדוח עם perf report. לאיזו פונקציה יש את אחוז ה-overhead הגבוה ביותר?',
      },
      hints: [
        {
          en: 'Run: perf record ./slow_app to record samples.',
          he: 'הריצו: perf record ./slow_app כדי להקליט דגימות.',
        },
        {
          en: 'Then run: perf report to see the results. Look at the Overhead column.',
          he: 'ואז הריצו: perf report כדי לראות תוצאות. הסתכלו על עמודת Overhead.',
        },
        {
          en: 'The function with the highest percentage number in the Overhead column is the answer.',
          he: 'הפונקציה עם האחוז הגבוה ביותר בעמודת Overhead היא התשובה.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf report',
      },
    },
    commandPalette: ['perf record', 'perf report', 'perf report --stdio'],
  },
  {
    id: '3-6',
    actId: 3,
    levelNumber: 6,
    title: { en: 'Reading the Report', he: 'קוראים את הדוח' },
    isBoss: false,
    xp: 150,
    prerequisites: ['3-5'],
    commandsIntroduced: ['perf report --stdio'],
    conceptsIntroduced: ['self vs children', 'overhead interpretation'],
    preLesson: {
      en: 'In perf report, each function has two overhead numbers. "Self" means time spent executing code inside that function directly. "Children" means time spent in that function plus all functions it calls. A function with high Children but low Self is a caller — the real work happens in functions it calls. Use --stdio for text output.',
      he: 'ב-perf report, לכל פונקציה יש שני מספרי overhead. "Self" אומר זמן שהושקע בהרצת קוד בתוך הפונקציה ישירות. "Children" אומר זמן בפונקציה ובכל הפונקציות שהיא קוראת. פונקציה עם Children גבוה אבל Self נמוך היא קוראת — העבודה האמיתית קורית בפונקציות שהיא קוראת. השתמשו ב---stdio לפלט טקסטואלי.',
    },
    postLesson: {
      en: 'Understanding self vs children is crucial. If main() shows 99% children but 0% self, the bottleneck is not in main — it is in what main calls. Always look at "self" to find the real hotspot.',
      he: 'הבנת self מול children היא קריטית. אם main() מראה 99% children אבל 0% self, צוואר הבקבוק הוא לא ב-main — הוא במה ש-main קורא. תמיד הסתכלו על "self" כדי למצוא את נקודת החום האמיתית.',
    },
    quest: {
      description: {
        en: 'Run perf report --stdio on the existing perf.data. Find a function with high Children overhead but low Self overhead. What is main()\'s Self overhead percentage?',
        he: 'הריצו perf report --stdio על perf.data הקיים. מצאו פונקציה עם Children overhead גבוה אבל Self overhead נמוך. מה אחוז ה-Self overhead של main()?',
      },
      hints: [
        {
          en: 'Run: perf report --stdio to see the text report.',
          he: 'הריצו: perf report --stdio כדי לראות את הדוח הטקסטואלי.',
        },
        {
          en: 'Look for main in the output. It will have two percentage columns.',
          he: 'חפשו את main בפלט. תהיה לו שתי עמודות אחוזים.',
        },
        {
          en: 'The first column is Children, the second is Self. Report the Self value for main.',
          he: 'העמודה הראשונה היא Children, השנייה היא Self. דווחו את ערך ה-Self של main.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf report --stdio',
      },
    },
    commandPalette: ['perf report', 'perf report --stdio', 'perf report --sort=dso'],
  },
  {
    id: '3-7',
    actId: 3,
    levelNumber: 7,
    title: { en: 'The Call Map', he: 'מפת הקריאות' },
    isBoss: false,
    xp: 150,
    prerequisites: ['3-6'],
    commandsIntroduced: ['perf record -g'],
    conceptsIntroduced: ['call graph', 'call stack', 'caller-callee chains'],
    preLesson: {
      en: 'Adding -g to perf record captures call stacks — not just which function was running, but the entire chain of function calls that led there. This is like seeing not just which room someone is in, but the exact path they took through the building. perf report then shows call trees you can expand to trace the execution path.',
      he: 'הוספת -g ל-perf record לוכדת סטאקים של קריאות — לא רק איזו פונקציה רצה, אלא כל שרשרת הקריאות שהובילה לשם. זה כמו לראות לא רק באיזה חדר מישהו נמצא, אלא את כל הנתיב שהוא עבר דרך הבניין. perf report מציג עצי קריאות שאפשר לפתוח כדי לעקוב אחרי נתיב הריצה.',
    },
    postLesson: {
      en: 'Call graphs are incredibly powerful. They answer the question "why is this function being called?" by showing you the entire call chain. This is fundamental to understanding program behavior.',
      he: 'גרפי קריאות הם חזקים להפליא. הם עונים על השאלה "למה הפונקציה הזו נקראת?" על ידי הצגת כל שרשרת הקריאות. זה בסיסי להבנת התנהגות התוכנית.',
    },
    quest: {
      description: {
        en: 'Record the slow_app program with call graphs enabled using perf record -g. Then use perf report to find the call chain. What function calls the hottest function?',
        he: 'הקליטו את תוכנית slow_app עם גרפי קריאות מופעלים באמצעות perf record -g. אחר כך השתמשו ב-perf report כדי למצוא את שרשרת הקריאות. איזו פונקציה קוראת לפונקציה החמה ביותר?',
      },
      hints: [
        {
          en: 'Run: perf record -g ./slow_app to capture call stacks.',
          he: 'הריצו: perf record -g ./slow_app כדי ללכוד סטאקים של קריאות.',
        },
        {
          en: 'Run: perf report and expand the top function to see its callers.',
          he: 'הריצו: perf report ופתחו את הפונקציה העליונה כדי לראות מי קורא לה.',
        },
        {
          en: 'The function directly above the hottest function in the call chain is the answer.',
          he: 'הפונקציה ישירות מעל הפונקציה החמה ביותר בשרשרת הקריאות היא התשובה.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'perf record -g',
      },
    },
    commandPalette: ['perf record -g', 'perf report', 'perf report --stdio'],
  },
  {
    id: '3-8',
    actId: 3,
    levelNumber: 8,
    title: { en: 'Performance Trial', he: 'מבחן הביצועים' },
    isBoss: true,
    xp: 300,
    badge: { id: 'perf-beginner', name: { en: 'Perf Beginner', he: 'מתחיל perf' }, icon: '📊' },
    prerequisites: ['3-7'],
    commandsIntroduced: [],
    conceptsIntroduced: ['perf workflow synthesis'],
    timeLimitSeconds: 420,
    preLesson: {
      en: 'This boss challenge tests your ability to use perf stat, perf record, and perf report together to investigate a real performance problem. You will need to count events, record samples, and read reports. No hints — show what you have learned!',
      he: 'אתגר הבוס הזה בוחן את היכולת שלכם להשתמש ב-perf stat, perf record ו-perf report יחד כדי לחקור בעיית ביצועים אמיתית. תצטרכו לספור אירועים, להקליט דגימות ולקרוא דוחות. בלי רמזים — הראו מה למדתם!',
    },
    postLesson: {
      en: 'Excellent! You can now use the core perf tools to investigate performance. You know how to count, record, and report. The intermediate arts await.',
      he: 'מצוין! עכשיו אתם יכולים להשתמש בכלי perf הבסיסיים לחקירת ביצועים. אתם יודעים לספור, להקליט ולדווח. האומנויות המתקדמות מחכות.',
    },
    quest: {
      description: {
        en: 'Complete the full performance investigation challenge using perf stat, perf record, and perf report.',
        he: 'השלימו את אתגר חקירת הביצועים המלא באמצעות perf stat, perf record ו-perf report.',
      },
      hints: [],
      validation: {
        type: 'multi_step',
        steps: [
          {
            instruction: {
              en: 'Run perf stat on the mystery_app program. Is the IPC high (>1.0) or low (<0.5)? Type "high" or "low".',
              he: 'הריצו perf stat על תוכנית mystery_app. האם ה-IPC גבוה (>1.0) או נמוך (<0.5)? הקלידו "high" או "low" (או "גבוה"/"נמוך").',
            },
            validation: {
              type: 'answer_match',
              expected: 'low|נמוך',
            },
          },
          {
            instruction: {
              en: 'Run perf stat -e cache-misses,cache-references on mystery_app. Is the cache miss rate above 10%? Type "yes" or "no".',
              he: 'הריצו perf stat -e cache-misses,cache-references על mystery_app. האם אחוז החמצות המטמון מעל 10%? הקלידו "yes" או "no" (או "כן"/"לא").',
            },
            validation: {
              type: 'answer_match',
              expected: 'yes|כן',
            },
          },
          {
            instruction: {
              en: 'Record mystery_app with call graphs: perf record -g ./mystery_app. Then use perf report to find the function with the highest self overhead. What is its name?',
              he: 'הקליטו mystery_app עם גרפי קריאות: perf record -g ./mystery_app. אחר כך השתמשו ב-perf report כדי למצוא את הפונקציה עם ה-self overhead הגבוה ביותר. מה שמה?',
            },
            validation: {
              type: 'answer_match',
              expected: 'random_access',
            },
          },
        ],
      },
    },
    commandPalette: ['perf stat', 'perf stat -e', 'perf record', 'perf record -g', 'perf report', 'perf report --stdio'],
  },
];

export const act3: Act = {
  id: 3,
  title: { en: 'The Measurement Arts', he: 'אומנויות המדידה' },
  subtitle: { en: 'perf Fundamentals', he: 'יסודות perf' },
  theme: { en: 'Master the core perf tools: list, stat, top, record, and report', he: 'שלטו בכלי perf הבסיסיים: list, stat, top, record ו-report' },
  levels,
};
