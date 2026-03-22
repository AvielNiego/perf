import { Act, Level } from './types';

const levels: Level[] = [
  {
    id: '1-1',
    actId: 1,
    levelNumber: 1,
    title: { en: 'First Steps', he: 'צעדים ראשונים' },
    isBoss: false,
    xp: 100,
    prerequisites: [],
    commandsIntroduced: ['whoami', 'pwd', 'echo'],
    conceptsIntroduced: ['terminal basics', 'game UI'],
    preLesson: {
      en: 'Welcome to PerfQuest! In this game you will learn to use performance tools by completing quests in a terminal. Let\'s start with three simple commands: whoami tells you your username, pwd shows your current directory, and echo prints text to the screen.',
      he: 'ברוכים הבאים ל-PerfQuest! במשחק הזה תלמדו להשתמש בכלי ביצועים על ידי השלמת משימות בטרמינל. נתחיל עם שלוש פקודות פשוטות: whoami מראה את שם המשתמש שלכם, pwd מציגה את התיקייה הנוכחית, ו-echo מדפיסה טקסט למסך.',
    },
    postLesson: {
      en: 'Great! You now know how to check who you are, where you are, and how to print messages. These basics will help you throughout the game.',
      he: 'מעולה! עכשיו אתם יודעים לבדוק מי אתם, איפה אתם, ואיך להדפיס הודעות. היסודות האלה ילוו אתכם לאורך כל המשחק.',
    },
    quest: {
      description: {
        en: 'Use the echo command to print the text "PerfQuest" to the terminal.',
        he: 'השתמשו בפקודת echo כדי להדפיס את הטקסט "PerfQuest" לטרמינל.',
      },
      hints: [
        {
          en: 'The echo command prints whatever you write after it.',
          he: 'פקודת echo מדפיסה כל מה שכותבים אחריה.',
        },
        {
          en: 'Try typing: echo PerfQuest',
          he: 'נסו להקליד: echo PerfQuest',
        },
        {
          en: 'Just type echo followed by a space and then PerfQuest, then press Enter.',
          he: 'פשוט הקלידו echo ואז רווח ואז PerfQuest, ולחצו Enter.',
        },
      ],
      validation: {
        type: 'output_contains',
        expected: 'PerfQuest',
      },
    },
    commandPalette: ['whoami', 'pwd', 'echo'],
  },
  {
    id: '1-2',
    actId: 1,
    levelNumber: 2,
    title: { en: 'The Quest Board', he: 'לוח המשימות' },
    isBoss: false,
    xp: 100,
    prerequisites: ['1-1'],
    commandsIntroduced: ['ls', 'ls -a', 'cat'],
    conceptsIntroduced: ['hidden files', 'hint system'],
    preLesson: {
      en: 'Every directory can contain hidden files that start with a dot. The command ls shows regular files, but ls -a shows all files including hidden ones. The command cat reads the content of a file and prints it.',
      he: 'בכל תיקייה יכולים להיות קבצים נסתרים שמתחילים בנקודה. הפקודה ls מראה קבצים רגילים, אבל ls -a מראה את כל הקבצים כולל הנסתרים. הפקודה cat קוראת את תוכן הקובץ ומדפיסה אותו.',
    },
    postLesson: {
      en: 'You found a hidden file! Remember that ls -a reveals secrets the regular ls command hides. Use hints when you get stuck.',
      he: 'מצאתם קובץ נסתר! זכרו ש-ls -a חושף סודות שהפקודה ls הרגילה מסתירה. השתמשו ברמזים כשאתם נתקעים.',
    },
    quest: {
      description: {
        en: 'A hidden file is waiting in the quest directory. Find it and read its contents using cat. What is the secret word inside?',
        he: 'קובץ נסתר מחכה בתיקיית המשימה. מצאו אותו וקראו את תוכנו באמצעות cat. מה המילה הסודית בפנים?',
      },
      hints: [
        {
          en: 'Use ls -a to see hidden files (files starting with a dot).',
          he: 'השתמשו ב-ls -a כדי לראות קבצים נסתרים (קבצים שמתחילים בנקודה).',
        },
        {
          en: 'Look for a file named .secret in the listing.',
          he: 'חפשו קובץ בשם .secret ברשימה.',
        },
        {
          en: 'Run: cat .secret to see what is inside the hidden file.',
          he: 'הריצו: cat .secret כדי לראות מה בתוך הקובץ הנסתר.',
        },
      ],
      validation: {
        type: 'answer_match',
        expected: 'performance',
      },
    },
    commandPalette: ['ls', 'ls -a', 'cat'],
  },
  {
    id: '1-3',
    actId: 1,
    levelNumber: 3,
    title: { en: 'Pipe Dreams', he: 'חלומות צינור' },
    isBoss: false,
    xp: 100,
    prerequisites: ['1-2'],
    commandsIntroduced: ['grep', 'wc -l', 'sort', 'uniq', 'uniq -c', '|', '>'],
    conceptsIntroduced: ['pipes', 'text filtering', 'deduplication', 'output redirection'],
    preLesson: {
      en: 'Pipes let you connect commands together using the | symbol. The output of one command becomes the input of the next. For example, cat file.txt | grep "error" finds lines containing "error". The command wc -l counts lines, sort arranges lines in order, and uniq removes consecutive duplicate lines. Use uniq -c to count how many times each line appears. The > symbol redirects output to a file instead of the screen, e.g., sort names.txt | uniq -c > counts.txt.',
      he: 'צינורות מאפשרים לחבר פקודות יחד באמצעות הסימן |. הפלט של פקודה אחת הופך לקלט של הבאה. לדוגמה, cat file.txt | grep "error" מוצא שורות שמכילות "error". הפקודה wc -l סופרת שורות, sort מסדרת שורות לפי סדר, ו-uniq מסירה שורות כפולות עוקבות. השתמשו ב-uniq -c כדי לספור כמה פעמים כל שורה מופיעה. הסימן > מפנה פלט לקובץ במקום למסך, למשל sort names.txt | uniq -c > counts.txt.',
    },
    postLesson: {
      en: 'Pipes are one of the most powerful ideas in Linux. Chaining simple commands together lets you build complex analysis tools on the fly.',
      he: 'צינורות הם אחד הרעיונות החזקים ביותר בלינוקס. שרשור פקודות פשוטות מאפשר לבנות כלי ניתוח מורכבים תוך כדי תנועה.',
    },
    quest: {
      description: {
        en: 'A log file called app.log is in your directory. Use pipes to count how many lines contain the word "ERROR". Then use grep, cut, sort, uniq -c to find which module has the most errors, and redirect the result to a file called error_counts.txt. Enter the number of ERROR lines.',
        he: 'קובץ לוג בשם app.log נמצא בתיקייה שלכם. השתמשו בצינורות כדי לספור כמה שורות מכילות את המילה "ERROR". אחר כך השתמשו ב-grep, cut, sort, uniq -c כדי למצוא לאיזה מודול יש הכי הרבה שגיאות, והפנו את התוצאה לקובץ בשם error_counts.txt. הזינו את מספר שורות ה-ERROR.',
      },
      hints: [
        {
          en: 'Use grep to filter lines that contain "ERROR".',
          he: 'השתמשו ב-grep כדי לסנן שורות שמכילות "ERROR".',
        },
        {
          en: 'Pipe the grep output to wc -l to count the matching lines.',
          he: 'העבירו את פלט ה-grep ל-wc -l כדי לספור את השורות המתאימות.',
        },
        {
          en: 'The full command is: grep "ERROR" app.log | wc -l',
          he: 'הפקודה המלאה היא: grep "ERROR" app.log | wc -l',
        },
      ],
      validation: {
        type: 'answer_match',
        expected: '42',
      },
    },
    commandPalette: ['grep', 'wc -l', 'sort', 'uniq', 'uniq -c', 'cat', '|', '>'],
  },
  {
    id: '1-4',
    actId: 1,
    levelNumber: 4,
    title: { en: 'The XP Forge', he: 'כור הניסיון' },
    isBoss: false,
    xp: 100,
    prerequisites: ['1-3'],
    commandsIntroduced: ['find', 'wc', 'cut'],
    conceptsIntroduced: ['file search', 'timed challenges'],
    timeLimitSeconds: 90,
    preLesson: {
      en: 'The find command searches for files by name or type. For example, find . -name "*.txt" finds all text files. The cut command extracts parts of each line — cut -d":" -f1 splits by colon and takes the first field. This is a timed challenge — work quickly!',
      he: 'הפקודה find מחפשת קבצים לפי שם או סוג. לדוגמה, find . -name "*.txt" מוצאת את כל קבצי הטקסט. הפקודה cut מחלצת חלקים מכל שורה — cut -d":" -f1 מפצלת לפי נקודתיים ולוקחת את השדה הראשון. זהו אתגר מתוזמן — עבדו מהר!',
    },
    postLesson: {
      en: 'Nice work under pressure! The find and cut commands are essential for navigating and parsing data in performance investigations.',
      he: 'עבודה יפה תחת לחץ! הפקודות find ו-cut חיוניות לניווט ולפירוק נתונים בחקירות ביצועים.',
    },
    quest: {
      description: {
        en: 'Use find to locate all .log files in the current directory tree, then count how many there are. Enter the number.',
        he: 'השתמשו ב-find כדי לאתר את כל קבצי ה-.log בעץ התיקיות הנוכחי, וספרו כמה יש. הזינו את המספר.',
      },
      hints: [
        {
          en: 'Use find . -name "*.log" to locate all log files.',
          he: 'השתמשו ב-find . -name "*.log" כדי לאתר את כל קבצי הלוג.',
        },
        {
          en: 'Pipe the output to wc -l to count the files.',
          he: 'העבירו את הפלט ל-wc -l כדי לספור את הקבצים.',
        },
        {
          en: 'Full command: find . -name "*.log" | wc -l',
          he: 'פקודה מלאה: find . -name "*.log" | wc -l',
        },
      ],
      validation: {
        type: 'answer_match',
        expected: '7',
      },
    },
    commandPalette: ['find', 'wc', 'wc -l', 'cut', 'ls', '|'],
  },
  {
    id: '1-5',
    actId: 1,
    levelNumber: 5,
    title: { en: "Gatekeeper's Trial", he: 'מבחן שומר השער' },
    isBoss: true,
    xp: 300,
    badge: { id: 'tutorial-graduate', name: { en: 'Tutorial Graduate', he: 'סיים הדרכה' }, icon: '🎓' },
    prerequisites: ['1-4'],
    commandsIntroduced: [],
    conceptsIntroduced: ['multi-step analysis'],
    timeLimitSeconds: 300,
    preLesson: {
      en: 'This is your first boss challenge! You must complete several steps in order using everything you have learned so far. There are no hints available — trust your skills. Read each step carefully and work through them one at a time.',
      he: 'זהו אתגר הבוס הראשון שלכם! עליכם להשלים מספר צעדים בסדר תוך שימוש בכל מה שלמדתם עד כה. אין רמזים זמינים — סמכו על הכישורים שלכם. קראו כל צעד בקפידה ועבדו עליהם אחד אחד.',
    },
    postLesson: {
      en: 'You passed the Gatekeeper! You have proven you can navigate the terminal, find files, filter text, and chain commands together. The real journey begins now.',
      he: 'עברתם את שומר השער! הוכחתם שאתם יודעים לנווט בטרמינל, למצוא קבצים, לסנן טקסט ולשרשר פקודות. המסע האמיתי מתחיל עכשיו.',
    },
    quest: {
      description: {
        en: 'Complete the multi-step log analysis challenge. Follow each step to find the answer.',
        he: 'השלימו את אתגר ניתוח הלוגים הרב-שלבי. עקבו אחרי כל צעד כדי למצוא את התשובה.',
      },
      hints: [],
      validation: {
        type: 'multi_step',
        steps: [
          {
            instruction: {
              en: 'Find all .log files in the directory tree and list them.',
              he: 'מצאו את כל קבצי ה-.log בעץ התיקיות והציגו אותם.',
            },
            validation: {
              type: 'command_run',
              expected: 'find . -name "*.log"',
            },
          },
          {
            instruction: {
              en: 'Search all log files for lines containing "CRITICAL" and count them.',
              he: 'חפשו בכל קבצי הלוג שורות שמכילות "CRITICAL" וספרו אותן.',
            },
            validation: {
              type: 'output_contains',
              expected: '13',
            },
          },
          {
            instruction: {
              en: 'From the CRITICAL lines, extract the service name (field 3, colon-delimited) and sort them. What service appears most?',
              he: 'מתוך השורות עם CRITICAL, חלצו את שם השירות (שדה 3, מופרד בנקודתיים) ומיינו אותם. איזה שירות מופיע הכי הרבה?',
            },
            validation: {
              type: 'answer_match',
              expected: 'auth-service',
            },
          },
        ],
      },
    },
    commandPalette: ['find', 'grep', 'wc -l', 'cut', 'sort', 'uniq -c', 'cat', '|'],
  },
];

export const act1: Act = {
  id: 1,
  title: { en: 'Welcome to PerfQuest', he: 'ברוכים הבאים ל-PerfQuest' },
  subtitle: { en: 'Tutorial', he: 'הדרכה' },
  theme: { en: 'Learn the game mechanics and review basic terminal skills', he: 'למדו את מכניקת המשחק ורעננו כישורי טרמינל בסיסיים' },
  levels,
};
