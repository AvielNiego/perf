import { Act, Level } from './types';

const levels: Level[] = [
  {
    id: '2-1',
    actId: 2,
    levelNumber: 1,
    title: { en: 'The Workers', he: 'העובדים' },
    isBoss: false,
    xp: 100,
    prerequisites: ['1-5'],
    commandsIntroduced: ['ps aux'],
    conceptsIntroduced: ['processes', 'PID', 'PPID'],
    preLesson: {
      en: 'Every program running on your computer is a process. Each process has a unique number called PID (Process ID) and a parent process called PPID. The command ps aux lists all running processes with details like CPU usage and memory.',
      he: 'כל תוכנית שרצה על המחשב שלכם היא תהליך. לכל תהליך יש מספר ייחודי שנקרא PID ותהליך אב שנקרא PPID. הפקודה ps aux מציגה את כל התהליכים הרצים עם פרטים כמו שימוש במעבד ובזיכרון.',
    },
    postLesson: {
      en: 'You can now see every process on the system. Understanding PIDs is essential — you will use them constantly when profiling with perf.',
      he: 'עכשיו אתם יכולים לראות כל תהליך במערכת. הבנת PID-ים היא חיונית — תשתמשו בהם כל הזמן בפרופיילינג עם perf.',
    },
    quest: {
      description: {
        en: 'Use ps aux to find the process using the most CPU. What is its PID?',
        he: 'השתמשו ב-ps aux כדי למצוא את התהליך שצורך הכי הרבה CPU. מה ה-PID שלו?',
      },
      hints: [
        {
          en: 'Run ps aux and look at the %CPU column.',
          he: 'הריצו ps aux והסתכלו על העמודה %CPU.',
        },
        {
          en: 'You can sort by CPU: ps aux --sort=-%cpu | head',
          he: 'אפשר למיין לפי CPU: ps aux --sort=-%cpu | head',
        },
        {
          en: 'The PID is in the second column. Look at the top line after the header.',
          he: 'ה-PID נמצא בעמודה השנייה. הסתכלו על השורה העליונה אחרי הכותרת.',
        },
      ],
      validation: {
        type: 'answer_match',
        expected: '1337',
      },
    },
    commandPalette: ['ps aux', 'head', '|'],
  },
  {
    id: '2-2',
    actId: 2,
    levelNumber: 2,
    title: { en: 'Workshop Threads', he: 'חוטי המלאכה' },
    isBoss: false,
    xp: 100,
    prerequisites: ['2-1'],
    commandsIntroduced: ['ps -T'],
    conceptsIntroduced: ['threads', 'TID', 'multithreading'],
    preLesson: {
      en: 'A process can have multiple threads — lightweight workers that share the same memory. The command ps -T -p <PID> shows all threads of a specific process. Each thread has its own TID (Thread ID). Multi-threaded programs are common in performance work.',
      he: 'לתהליך יכולים להיות מספר חוטים — עובדים קלים שחולקים את אותו זיכרון. הפקודה ps -T -p <PID> מראה את כל החוטים של תהליך מסוים. לכל חוט יש TID (מזהה חוט) משלו. תוכניות מרובות חוטים נפוצות בעבודת ביצועים.',
    },
    postLesson: {
      en: 'Threads let programs do multiple things at once. When profiling, you will often need to focus on a specific thread to find the bottleneck.',
      he: 'חוטים מאפשרים לתוכניות לעשות כמה דברים במקביל. בפרופיילינג, לעיתים קרובות תצטרכו להתמקד בחוט מסוים כדי למצוא את צוואר הבקבוק.',
    },
    quest: {
      description: {
        en: 'Process 1337 is multi-threaded. Use ps -T to find how many threads it has. Enter the number.',
        he: 'תהליך 1337 הוא מרובה חוטים. השתמשו ב-ps -T כדי למצוא כמה חוטים יש לו. הזינו את המספר.',
      },
      hints: [
        {
          en: 'Use ps -T -p 1337 to see the threads of process 1337.',
          he: 'השתמשו ב-ps -T -p 1337 כדי לראות את החוטים של תהליך 1337.',
        },
        {
          en: 'Count the output lines (minus the header) or pipe to wc -l and subtract 1.',
          he: 'ספרו את שורות הפלט (פחות הכותרת) או העבירו ל-wc -l וחסרו 1.',
        },
        {
          en: 'Try: ps -T -p 1337 | tail -n +2 | wc -l',
          he: 'נסו: ps -T -p 1337 | tail -n +2 | wc -l',
        },
      ],
      validation: {
        type: 'answer_match',
        expected: '4',
      },
    },
    commandPalette: ['ps -T', 'wc -l', 'tail', '|'],
  },
  {
    id: '2-3',
    actId: 2,
    levelNumber: 3,
    title: { en: 'The Heartbeat', he: 'פעימת הלב' },
    isBoss: false,
    xp: 100,
    prerequisites: ['2-2'],
    commandsIntroduced: ['lscpu', 'time', 'sleep'],
    conceptsIntroduced: ['CPU frequency', 'cycles', 'wall clock vs CPU time'],
    preLesson: {
      en: 'Your CPU has a clock that ticks billions of times per second — each tick is a cycle. The command lscpu shows your CPU details including its frequency. The time command measures how long a program runs, showing real (wall clock), user (CPU), and sys (kernel) time. sleep N pauses for N seconds — useful for timing experiments.',
      he: 'למעבד שלכם יש שעון שמתקתק מיליארדי פעמים בשנייה — כל תקתוק הוא מחזור. הפקודה lscpu מראה את פרטי המעבד כולל התדר שלו. הפקודה time מודדת כמה זמן תוכנית רצה, ומציגה זמן אמיתי, זמן משתמש וזמן מערכת. sleep N משהה את הביצוע למשך N שניות — שימושי לניסויי תזמון.',
    },
    postLesson: {
      en: 'Now you understand CPU cycles and the difference between wall time and CPU time. If user+sys is less than real, the program was probably waiting for something.',
      he: 'עכשיו אתם מבינים מחזורי CPU ואת ההבדל בין זמן שעון לזמן CPU. אם user+sys קטן מ-real, התוכנית כנראה חיכתה למשהו.',
    },
    quest: {
      description: {
        en: 'Run lscpu and find the CPU model name. Then run time sleep 2 and observe the output. What is the "real" time reported (in seconds, like 2.00)?',
        he: 'הריצו lscpu ומצאו את שם דגם המעבד. אחר כך הריצו time sleep 2 וצפו בפלט. מה הזמן ה-"real" שדווח (בשניות, כמו 2.00)?',
      },
      hints: [
        {
          en: 'Run lscpu to see CPU info, then run time sleep 2.',
          he: 'הריצו lscpu כדי לראות מידע על המעבד, ואז הריצו time sleep 2.',
        },
        {
          en: 'The "real" line shows wall-clock time. sleep 2 should take about 2 seconds.',
          he: 'שורת ה-"real" מראה זמן שעון קיר. sleep 2 אמור לקחת בערך 2 שניות.',
        },
        {
          en: 'The answer should be approximately 2.00 seconds.',
          he: 'התשובה צריכה להיות בערך 2.00 שניות.',
        },
      ],
      validation: {
        type: 'output_contains',
        expected: 'real',
      },
    },
    commandPalette: ['lscpu', 'time', 'sleep'],
  },
  {
    id: '2-4',
    actId: 2,
    levelNumber: 4,
    title: { en: 'The Storage Rooms', he: 'חדרי האחסון' },
    isBoss: false,
    xp: 100,
    prerequisites: ['2-3'],
    commandsIntroduced: ['free -h'],
    conceptsIntroduced: ['RAM', 'memory hierarchy', 'cache levels'],
    preLesson: {
      en: 'Your computer has a memory hierarchy: CPU registers are fastest, then L1/L2/L3 caches, then RAM, then disk. The command free -h shows how much memory is used and available. Understanding this hierarchy is key to performance — accessing L1 cache is 100x faster than RAM!',
      he: 'למחשב שלכם יש היררכיית זיכרון: רגיסטרים של המעבד הם המהירים ביותר, אחר כך מטמוני L1/L2/L3, אחר כך RAM, ואז דיסק. הפקודה free -h מראה כמה זיכרון בשימוש וזמין. הבנת היררכיה זו היא מפתח לביצועים — גישה ל-L1 cache מהירה פי 100 מ-RAM!',
    },
    postLesson: {
      en: 'Memory hierarchy matters enormously for performance. Cache misses — when data is not in the fast cache — are one of the top causes of slow programs.',
      he: 'היררכיית הזיכרון משפיעה מאוד על ביצועים. החמצות מטמון — כשנתונים לא נמצאים במטמון המהיר — הן אחת הסיבות המרכזיות לתוכניות איטיות.',
    },
    quest: {
      description: {
        en: 'Run free -h and find how much total memory (RAM) your system has. Enter the value as shown (e.g., "16Gi" or "8Gi").',
        he: 'הריצו free -h ומצאו כמה זיכרון (RAM) יש למערכת. הזינו את הערך כפי שמוצג (למשל "16Gi" או "8Gi").',
      },
      hints: [
        {
          en: 'Run free -h and look at the "Mem:" row, "total" column.',
          he: 'הריצו free -h והסתכלו על שורת "Mem:", עמודת "total".',
        },
        {
          en: 'The output has columns: total, used, free, shared, buff/cache, available.',
          he: 'לפלט יש עמודות: total, used, free, shared, buff/cache, available.',
        },
        {
          en: 'Copy the exact value from the "total" column in the "Mem:" row.',
          he: 'העתיקו את הערך המדויק מעמודת "total" בשורת "Mem:".',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'free -h',
      },
    },
    commandPalette: ['free -h', 'lscpu'],
  },
  {
    id: '2-5',
    actId: 2,
    levelNumber: 5,
    title: { en: 'The Scheduler King', he: 'מלך המתזמן' },
    isBoss: false,
    xp: 100,
    prerequisites: ['2-4'],
    commandsIntroduced: ['nproc', 'vmstat'],
    conceptsIntroduced: ['scheduler', 'context switches', 'CPU cores'],
    preLesson: {
      en: 'The Linux scheduler decides which process runs on which CPU core and for how long. The command nproc tells you how many CPU cores you have. Context switches happen when the scheduler swaps one process for another — they have a performance cost. You can see system-wide context switches with vmstat 1.',
      he: 'המתזמן של לינוקס מחליט איזה תהליך רץ על איזה ליבת CPU ולכמה זמן. הפקודה nproc אומרת כמה ליבות CPU יש לכם. החלפות הקשר קורות כשהמתזמן מחליף תהליך אחד באחר — יש להן עלות ביצועים. אפשר לראות החלפות הקשר ברמת המערכת עם vmstat 1.',
    },
    postLesson: {
      en: 'The scheduler is the invisible conductor of your system. Too many context switches can slow things down, and perf can measure them precisely.',
      he: 'המתזמן הוא המנצח הבלתי נראה של המערכת שלכם. יותר מדי החלפות הקשר יכולות להאט דברים, ו-perf יכול למדוד אותן במדויק.',
    },
    quest: {
      description: {
        en: 'Run nproc to find out how many CPU cores your system has, then run vmstat 1 3 and observe the "cs" (context switches) column. How many CPU cores do you have?',
        he: 'הריצו nproc כדי לגלות כמה ליבות CPU יש למערכת, ואז הריצו vmstat 1 3 וצפו בעמודת "cs" (החלפות הקשר). כמה ליבות CPU יש לכם?',
      },
      hints: [
        {
          en: 'nproc prints the number of available CPU cores.',
          he: 'nproc מדפיסה את מספר ליבות ה-CPU הזמינות.',
        },
        {
          en: 'vmstat 1 3 shows system stats every second, 3 times. The "cs" column shows context switches.',
          he: 'vmstat 1 3 מציג נתוני מערכת כל שנייה, 3 פעמים. העמודה "cs" מראה החלפות הקשר.',
        },
        {
          en: 'Just run nproc and enter the number it shows.',
          he: 'פשוט הריצו nproc והזינו את המספר שהוא מציג.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'nproc',
      },
    },
    commandPalette: ['nproc', 'vmstat', '|'],
  },
  {
    id: '2-6',
    actId: 2,
    levelNumber: 6,
    title: { en: 'The Royal Gates', he: 'שערי המלוכה' },
    isBoss: false,
    xp: 100,
    prerequisites: ['2-5'],
    commandsIntroduced: ['strace -c'],
    conceptsIntroduced: ['system calls', 'user space vs kernel space'],
    preLesson: {
      en: 'When a program needs to do something like read a file or send data over the network, it asks the kernel through a system call (syscall). The command strace -c <command> shows a summary of all syscalls a program makes and how much time each takes. Think of syscalls as gates between your program and the kernel.',
      he: 'כשתוכנית צריכה לעשות משהו כמו לקרוא קובץ או לשלוח נתונים ברשת, היא מבקשת מהקרנל דרך קריאת מערכת (syscall). הפקודה strace -c <command> מציגה סיכום של כל קריאות המערכת שתוכנית עושה וכמה זמן כל אחת לוקחת. חשבו על syscalls כשערים בין התוכנית שלכם לקרנל.',
    },
    postLesson: {
      en: 'System calls are where your program meets the operating system. Excessive syscalls often indicate performance problems. perf can trace syscalls even more efficiently than strace.',
      he: 'קריאות מערכת הן המקום בו התוכנית שלכם פוגשת את מערכת ההפעלה. יותר מדי קריאות מערכת מצביעות לעיתים קרובות על בעיות ביצועים. perf יכול לעקוב אחרי קריאות מערכת ביעילות רבה יותר מ-strace.',
    },
    quest: {
      description: {
        en: 'Run strace -c ls /tmp and observe the syscall summary. Which syscall was called the most times?',
        he: 'הריצו strace -c ls /tmp וצפו בסיכום קריאות המערכת. איזו קריאת מערכת נקראה הכי הרבה פעמים?',
      },
      hints: [
        {
          en: 'Run strace -c ls /tmp to see a table of all system calls used.',
          he: 'הריצו strace -c ls /tmp כדי לראות טבלה של כל קריאות המערכת שנעשו.',
        },
        {
          en: 'Look at the "calls" column to see how many times each syscall was made.',
          he: 'הסתכלו על העמודה "calls" כדי לראות כמה פעמים כל קריאת מערכת נעשתה.',
        },
        {
          en: 'The syscall with the highest number in the "calls" column is the answer.',
          he: 'קריאת המערכת עם המספר הגבוה ביותר בעמודת "calls" היא התשובה.',
        },
      ],
      validation: {
        type: 'command_run',
        expected: 'strace -c',
      },
    },
    commandPalette: ['strace -c', 'ls', '|'],
  },
  {
    id: '2-7',
    actId: 2,
    levelNumber: 7,
    title: { en: "The Blacksmith's Mark", he: 'חותם הנפח' },
    isBoss: false,
    xp: 100,
    prerequisites: ['2-6'],
    commandsIntroduced: ['gcc -g', 'gcc -O2', 'gcc -fno-omit-frame-pointer', 'file'],
    conceptsIntroduced: ['debug symbols', 'compilation flags', 'symbol tables', 'compiler (translates source to machine code)'],
    preLesson: {
      en: 'A compiler like gcc translates your human-readable C code into machine instructions the CPU can execute. When you compile a C program for profiling, you should use BOTH -O2 and -g together: gcc -O2 -g program.c. The -O2 flag tells the compiler to optimize the code (so you profile realistic performance), and -g includes debug symbols — a map connecting machine code back to your source lines and function names. Without -g, perf can only show you hex addresses instead of readable function names. Without -O2, the code runs slower than it would in production.',
      he: 'קומפיילר כמו gcc מתרגם את קוד ה-C הקריא לבני אדם להוראות מכונה שה-CPU יכול לבצע. כשמקמפלים תוכנית C לפרופיילינג, צריך להשתמש בשני הדגלים -O2 ו-g- ביחד: gcc -O2 -g program.c. הדגל O2- אומר לקומפיילר לבצע אופטימיזציה לקוד (כדי לעשות פרופיילינג לביצועים ריאליסטיים), ו-g- כולל סמלי ניפוי — מפה שמחברת קוד מכונה בחזרה לשורות המקור ושמות הפונקציות. בלי g-, perf יכול להראות רק כתובות הקסדצימליות במקום שמות פונקציות קריאים. בלי O2-, הקוד רץ יותר לאט ממה שירוץ בייצור.',
    },
    postLesson: {
      en: 'Debug symbols are the blacksmith\'s mark — they let you identify where performance issues originate. Always compile with -O2 -g when profiling. Also consider adding -fno-omit-frame-pointer so that perf can reliably walk the call stack using frame pointers — without it, call stacks may appear broken.',
      he: 'סמלי ניפוי הם חותם הנפח — הם מאפשרים לזהות מאיפה בעיות ביצועים מגיעות. תמיד קמפלו עם O2 -g- כשעושים פרופיילינג. שקלו גם להוסיף fno-omit-frame-pointer- כדי ש-perf יוכל לעקוב אחרי סטאק הקריאות באופן אמין באמצעות frame pointers — בלי זה, סטאקים של קריאות עלולים להיראות שבורים.',
    },
    quest: {
      description: {
        en: 'Compile the file slow.c twice: once without -g and once with -g. Use the file command on both outputs. What extra information does the -g version show?',
        he: 'קמפלו את הקובץ slow.c פעמיים: פעם בלי -g ופעם עם -g. השתמשו בפקודת file על שני הפלטים. איזה מידע נוסף מופיע בגרסה עם -g?',
      },
      hints: [
        {
          en: 'Run: gcc slow.c -o slow_no_debug && gcc -g slow.c -o slow_debug',
          he: 'הריצו: gcc slow.c -o slow_no_debug && gcc -g slow.c -o slow_debug',
        },
        {
          en: 'Then run: file slow_no_debug && file slow_debug',
          he: 'ואז הריצו: file slow_no_debug && file slow_debug',
        },
        {
          en: 'The -g version should say "with debug_info" or similar. That\'s what perf needs.',
          he: 'הגרסה עם -g צריכה להגיד "with debug_info" או משהו דומה. זה מה ש-perf צריך.',
        },
      ],
      validation: {
        type: 'output_contains',
        expected: 'debug_info',
      },
    },
    commandPalette: ['gcc', 'gcc -g', 'gcc -O2', 'gcc -O2 -g', 'gcc -fno-omit-frame-pointer', 'file', 'ls'],
  },
  {
    id: '2-8',
    actId: 2,
    levelNumber: 8,
    title: { en: 'Counting vs Tasting', he: 'ספירה מול טעימה' },
    isBoss: false,
    xp: 100,
    prerequisites: ['2-7'],
    commandsIntroduced: [],
    conceptsIntroduced: ['sampling', 'counting', 'profiling methods'],
    preLesson: {
      en: 'There are two ways to measure performance. Counting (ספירה) means tracking every single event (like counting every car on a road). Sampling (דגימה) means checking periodically (like looking at the road every 10 seconds and noting what you see). Counting gives totals, but when you measure many event types at once the CPU may not have enough hardware counters, so it multiplexes and estimates some values. Sampling is lightweight and gives a statistical picture of where time is spent. perf supports both!',
      he: 'יש שתי דרכים למדוד ביצועים. ספירה (counting) אומרת לעקוב אחרי כל אירוע בודד (כמו לספור כל מכונית בכביש). דגימה (sampling) אומרת לבדוק מדי פעם (כמו להסתכל על הכביש כל 10 שניות ולרשום מה רואים). ספירה נותנת סכומים, אבל כשמודדים סוגי אירועים רבים בו-זמנית ייתכן שלמעבד אין מספיק מוני חומרה, אז הוא עושה מולטיפלקסינג ומעריך חלק מהערכים. דגימה קלת משקל ונותנת תמונה סטטיסטית של איפה מושקע הזמן. perf תומך בשתיהן!',
    },
    postLesson: {
      en: 'Counting (perf stat) gives totals for events. Sampling (perf record) shows where the program spends time. You will use both techniques in the coming levels.',
      he: 'ספירה (perf stat) נותנת סכומים לאירועים. דגימה (perf record) מראה איפה התוכנית מבלה זמן. תשתמשו בשתי הטכניקות בשלבים הבאים.',
    },
    quest: {
      description: {
        en: 'Based on what you learned in the lesson, which method would you use to find the TOTAL number of cache misses in a program — counting or sampling?',
        he: 'בהתבסס על מה שלמדתם בשיעור, באיזו שיטה הייתם משתמשים כדי למצוא את המספר הכולל של החמצות מטמון בתוכנית — ספירה או דגימה?',
      },
      hints: [
        {
          en: 'Counting tracks every single event and gives exact totals. Sampling checks periodically and gives a statistical picture.',
          he: 'ספירה עוקבת אחרי כל אירוע בודד ונותנת סכומים מדויקים. דגימה בודקת מדי פעם ונותנת תמונה סטטיסטית.',
        },
        {
          en: 'If you need a total count of events (like total cache misses), you want the method that counts every event.',
          he: 'אם צריכים ספירה כוללת של אירועים (כמו סך החמצות מטמון), רוצים את השיטה שסופרת כל אירוע.',
        },
        {
          en: 'Counting gives totals. Sampling gives a statistical picture of where time is spent.',
          he: 'ספירה נותנת סכומים. דגימה נותנת תמונה סטטיסטית של איפה מושקע הזמן.',
        },
      ],
      validation: {
        type: 'answer_match',
        expected: 'counting|ספירה',
      },
    },
    commandPalette: [],
  },
  {
    id: '2-9',
    actId: 2,
    levelNumber: 9,
    title: { en: 'Knowledge Tribunal', he: 'בית הדין של הידע' },
    isBoss: true,
    xp: 300,
    badge: { id: 'system-thinker', name: { en: 'System Thinker', he: 'חושב מערכתי' }, icon: '🧠' },
    prerequisites: ['2-8'],
    commandsIntroduced: [],
    conceptsIntroduced: ['system concepts synthesis'],
    timeLimitSeconds: 300,
    preLesson: {
      en: 'The Knowledge Tribunal tests everything you have learned about how systems work: processes, threads, CPU, memory, scheduling, system calls, and debug symbols. No hints here — prove your understanding!',
      he: 'בית הדין של הידע בוחן את כל מה שלמדתם על איך מערכות עובדות: תהליכים, חוטים, CPU, זיכרון, תזמון, קריאות מערכת וסמלי ניפוי. אין רמזים כאן — הוכיחו את ההבנה שלכם!',
    },
    postLesson: {
      en: 'You have mastered the foundations. You understand how processes, memory, and the CPU work together. Now you are ready to wield perf itself.',
      he: 'שלטתם ביסודות. אתם מבינים איך תהליכים, זיכרון וה-CPU עובדים יחד. עכשיו אתם מוכנים להשתמש ב-perf עצמו.',
    },
    quest: {
      description: {
        en: 'Answer the multi-step system knowledge challenge to prove your understanding.',
        he: 'ענו על אתגר הידע הרב-שלבי כדי להוכיח את ההבנה שלכם.',
      },
      hints: [],
      validation: {
        type: 'multi_step',
        steps: [
          {
            instruction: {
              en: 'Use ps aux to find the process named "cpu_hog" and report its PID.',
              he: 'השתמשו ב-ps aux כדי למצוא את התהליך בשם "cpu_hog" ודווחו את ה-PID שלו.',
            },
            validation: {
              type: 'command_run',
              expected: 'ps aux',
            },
          },
          {
            instruction: {
              en: 'How many threads does the cpu_hog process have? Use ps -T.',
              he: 'כמה חוטים יש לתהליך cpu_hog? השתמשו ב-ps -T.',
            },
            validation: {
              type: 'answer_match',
              expected: '8',
            },
          },
          {
            instruction: {
              en: 'Run strace -c on the provided test_io program. Which syscall takes the most total time?',
              he: 'הריצו strace -c על תוכנית test_io שסופקה. איזו קריאת מערכת לוקחת הכי הרבה זמן?',
            },
            validation: {
              type: 'answer_match',
              expected: 'write',
            },
          },
          {
            instruction: {
              en: 'For profiling with perf, you should use BOTH -O2 and -g together. Which flags should you pass to gcc for profiling? (type the flags)',
              he: 'לפרופיילינג עם perf, צריך להשתמש בשני הדגלים O2- ו-g- ביחד. אילו דגלים צריך להעביר ל-gcc לפרופיילינג? (הקלידו את הדגלים)',
            },
            validation: {
              type: 'answer_match',
              expected: '-O2 -g|-g|-g -O2',
            },
          },
        ],
      },
    },
    commandPalette: ['ps aux', 'ps -T', 'strace -c', 'gcc -g', 'nproc', 'free -h', 'lscpu'],
  },
];

export const act2: Act = {
  id: 2,
  title: { en: 'The Inner Kingdom', he: 'הממלכה הפנימית' },
  subtitle: { en: 'System Concepts', he: 'מושגי מערכת' },
  theme: { en: 'Understand how processes, memory, CPU, and the OS kernel work together', he: 'הבינו איך תהליכים, זיכרון, CPU וקרנל מערכת ההפעלה עובדים יחד' },
  levels,
};
