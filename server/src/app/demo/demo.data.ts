/**
 * Invented content for the "Try the demo" seed. Every name, bio, course and
 * review here is fictional. Pairs are [English, Arabic].
 */
import { DEMO_ACCOUNTS } from "./demo.constants";

type Pair = [string, string];

export type DemoCategory = { slug: string; name: Pair; description: Pair; icon: string };
export type DemoInstructor = {
  key: string;
  email: string;
  fullName: string;
  country: string;
  headline: Pair;
  bio: Pair;
  expertise: string[];
};
export type DemoLesson = [en: string, ar: string, minutes: number];
export type DemoSection = { title: Pair; lessons: DemoLesson[] };
export type DemoQuestion = { prompt: Pair; options: Pair[]; correct: number; explanation: Pair };
export type DemoCourse = {
  slug: string;
  category: string;
  instructor: string;
  title: Pair;
  short: Pair;
  description: Pair;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  language: "EN" | "AR" | "BOTH";
  price: number;
  accessTier: "FREE" | "STARTER" | "PRO";
  featured: boolean;
  sections: DemoSection[];
  quiz: DemoQuestion[];
};

export const DEMO_CATEGORIES: DemoCategory[] = [
  {
    slug: "web-development",
    name: ["Web Development", "تطوير الويب"],
    description: ["Build modern websites and apps.", "ابنِ مواقع وتطبيقات حديثة."],
    icon: "code",
  },
  {
    slug: "design",
    name: ["Design", "التصميم"],
    description: ["Interfaces, brands and visual thinking.", "الواجهات والهويات والتفكير البصري."],
    icon: "palette",
  },
  {
    slug: "arabic-calligraphy",
    name: ["Arabic Calligraphy", "الخط العربي"],
    description: ["Classic scripts, one stroke at a time.", "الخطوط الكلاسيكية، ضربة قلم تلو الأخرى."],
    icon: "pen-tool",
  },
  {
    slug: "business",
    name: ["Business", "الأعمال"],
    description: ["Start, run and grow your own work.", "ابدأ عملك الخاص وأدِره وطوّره."],
    icon: "briefcase",
  },
  {
    slug: "languages",
    name: ["Languages", "اللغات"],
    description: ["Speak with confidence.", "تحدّث بثقة."],
    icon: "languages",
  },
];

export const DEMO_INSTRUCTORS: DemoInstructor[] = [
  {
    key: "karim",
    email: DEMO_ACCOUNTS.instructor,
    fullName: "Karim Nasser",
    country: "Egypt",
    headline: ["Full-stack developer & teacher", "مطوّر ويب متكامل ومعلّم"],
    bio: [
      "Karim has built web products for twelve years and loves turning complex ideas into small, clear steps. (Demo instructor: this profile is fictional.)",
      "يبني كريم منتجات الويب منذ اثني عشر عامًا ويحب تحويل الأفكار المعقدة إلى خطوات صغيرة وواضحة. (مدرّب تجريبي: هذا الملف خيالي.)",
    ],
    expertise: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  },
  {
    key: "laila",
    email: "laila.mansour@example.com",
    fullName: "Laila Mansour",
    country: "Jordan",
    headline: ["Product designer & calligrapher", "مصممة منتجات وخطّاطة"],
    bio: [
      "Laila splits her time between designing apps and practising Naskh and Thuluth. She teaches both with the same patience. (Fictional profile.)",
      "تقسّم ليلى وقتها بين تصميم التطبيقات وممارسة خطَّي النسخ والثلث، وتدرّس كليهما بالصبر نفسه. (ملف خيالي.)",
    ],
    expertise: ["UI design", "Figma", "Naskh", "Branding"],
  },
  {
    key: "sara",
    email: "sara.whitfield@example.com",
    fullName: "Sara Whitfield",
    country: "United Kingdom",
    headline: ["Small-business coach & language teacher", "مدرّبة أعمال صغيرة ومعلّمة لغات"],
    bio: [
      "Sara has helped hundreds of freelancers price their work and find clients, and teaches business English on the side. (Fictional profile.)",
      "ساعدت سارة مئات المستقلين على تسعير عملهم وإيجاد العملاء، وتدرّس الإنجليزية للأعمال أيضًا. (ملف خيالي.)",
    ],
    expertise: ["Freelancing", "Marketing", "Personal finance", "English"],
  },
];

export const DEMO_STUDENT = { email: DEMO_ACCOUNTS.student, fullName: "Nour Hassan", country: "Egypt" };
export const DEMO_ADMIN = { email: DEMO_ACCOUNTS.admin, fullName: "Demo Admin", country: "Egypt" };

export const DEMO_LEARNERS: { email: string; fullName: string; country: string; locale: "en" | "ar" }[] =
  [
    { email: "learner01@example.com", fullName: "Youssef Amin", country: "Egypt", locale: "ar" },
    { email: "learner02@example.com", fullName: "Hana Saleh", country: "Saudi Arabia", locale: "ar" },
    { email: "learner03@example.com", fullName: "Daniel Brooks", country: "Canada", locale: "en" },
    { email: "learner04@example.com", fullName: "Mariam Farouk", country: "Egypt", locale: "ar" },
    { email: "learner05@example.com", fullName: "Omar Khalil", country: "UAE", locale: "en" },
    { email: "learner06@example.com", fullName: "Lina Haddad", country: "Lebanon", locale: "ar" },
    { email: "learner07@example.com", fullName: "Priya Raman", country: "India", locale: "en" },
    { email: "learner08@example.com", fullName: "Tariq Aziz", country: "Morocco", locale: "ar" },
    { email: "learner09@example.com", fullName: "Emma Novak", country: "Germany", locale: "en" },
    { email: "learner10@example.com", fullName: "Salma Ibrahim", country: "Qatar", locale: "ar" },
    { email: "learner11@example.com", fullName: "Lucas Moreau", country: "France", locale: "en" },
    { email: "learner12@example.com", fullName: "Reem Al-Sayed", country: "Kuwait", locale: "ar" },
  ];

/**
 * 40-second 480p excerpts of Blender Foundation open films (CC BY), bundled in
 * frontend/public/demo/videos and played through the plain-MP4 provider.
 */
export const DEMO_VIDEOS: { url: string; credit: string }[] = [
  { url: "/demo/videos/tears-of-steel-1.mp4", credit: "Tears of Steel © Blender Foundation (mango.blender.org), CC BY 3.0" },
  { url: "/demo/videos/elephants-dream-1.mp4", credit: "Elephants Dream © Blender Foundation (orange.blender.org), CC BY 2.5" },
  { url: "/demo/videos/tears-of-steel-2.mp4", credit: "Tears of Steel © Blender Foundation (mango.blender.org), CC BY 3.0" },
  { url: "/demo/videos/elephants-dream-2.mp4", credit: "Elephants Dream © Blender Foundation (orange.blender.org), CC BY 2.5" },
];

export const DEMO_COURSES: DemoCourse[] = [
  {
    slug: "demo-react-typescript",
    category: "web-development",
    instructor: "karim",
    title: ["Modern Web Apps with React & TypeScript", "تطبيقات ويب حديثة باستخدام React و TypeScript"],
    short: [
      "Build a real, typed React app from an empty folder to deployment.",
      "ابنِ تطبيق React حقيقيًا بأنواع TypeScript من مجلد فارغ حتى النشر.",
    ],
    description: [
      "A hands-on course where you build a task manager step by step: components, state, data fetching, forms, routing and deployment. Every lesson ends with a small exercise.",
      "دورة عملية تبني فيها مدير مهام خطوة بخطوة: المكوّنات والحالة وجلب البيانات والنماذج والتوجيه والنشر. كل درس ينتهي بتمرين صغير.",
    ],
    level: "INTERMEDIATE",
    language: "BOTH",
    price: 49,
    accessTier: "PRO",
    featured: true,
    sections: [
      {
        title: ["Getting started", "البداية"],
        lessons: [
          ["Welcome and project tour", "مرحبًا وجولة في المشروع", 6],
          ["Setting up Vite and TypeScript", "إعداد Vite و TypeScript", 12],
          ["Your first typed component", "أول مكوّن بأنواع TypeScript", 14],
        ],
      },
      {
        title: ["State and data", "الحالة والبيانات"],
        lessons: [
          ["useState and useReducer in practice", "useState و useReducer عمليًا", 18],
          ["Fetching data with loading states", "جلب البيانات مع حالات التحميل", 16],
          ["Forms that validate themselves", "نماذج تتحقق من نفسها", 20],
        ],
      },
      {
        title: ["Shipping it", "النشر"],
        lessons: [
          ["Routing between pages", "التنقل بين الصفحات", 13],
          ["Deploying for free", "النشر مجانًا", 10],
        ],
      },
    ],
    quiz: [
      {
        prompt: ["Which hook is best for complex state transitions?", "أي خطّاف أنسب لانتقالات الحالة المعقدة؟"],
        options: [
          ["useReducer", "useReducer"],
          ["useRef", "useRef"],
          ["useId", "useId"],
        ],
        correct: 0,
        explanation: ["useReducer keeps transitions in one pure function.", "يجمع useReducer الانتقالات في دالة نقية واحدة."],
      },
      {
        prompt: ["What does TypeScript add to a React component?", "ماذا تضيف TypeScript إلى مكوّن React؟"],
        options: [
          ["Faster rendering", "عرض أسرع"],
          ["Checked prop types at build time", "فحص أنواع الخصائص وقت البناء"],
          ["Server-side rendering", "العرض من جهة الخادم"],
        ],
        correct: 1,
        explanation: ["Types are checked before the code runs.", "تُفحص الأنواع قبل تشغيل الشيفرة."],
      },
      {
        prompt: ["Where should a loading state live?", "أين يجب أن توضع حالة التحميل؟"],
        options: [
          ["In a global variable", "في متغير عام"],
          ["Next to the data it describes", "بجانب البيانات التي تصفها"],
          ["In the CSS", "في ملف CSS"],
        ],
        correct: 1,
        explanation: ["Keep state close to where it is used.", "أبقِ الحالة قريبة من مكان استخدامها."],
      },
    ],
  },
  {
    slug: "demo-node-postgres-api",
    category: "web-development",
    instructor: "karim",
    title: ["Build REST APIs with Node.js & PostgreSQL", "بناء واجهات REST باستخدام Node.js و PostgreSQL"],
    short: [
      "Design, secure and test a production-style API.",
      "صمّم واجهة برمجية بأسلوب الإنتاج وأمّنها واختبرها.",
    ],
    description: [
      "Learn Express routing, input validation, SQL with an ORM, authentication with refresh tokens and automated tests, all on a sample bookstore API.",
      "تعلّم توجيه Express والتحقق من المدخلات و SQL عبر ORM والمصادقة برموز التحديث والاختبارات الآلية، كل ذلك على واجهة متجر كتب تجريبي.",
    ],
    level: "INTERMEDIATE",
    language: "EN",
    price: 39,
    accessTier: "PRO",
    featured: false,
    sections: [
      {
        title: ["Foundations", "الأساسيات"],
        lessons: [
          ["How HTTP APIs work", "كيف تعمل واجهات HTTP", 9],
          ["Express routes and middleware", "مسارات Express والوسائط", 15],
        ],
      },
      {
        title: ["Data", "البيانات"],
        lessons: [
          ["Modelling tables", "تصميم الجداول", 17],
          ["Queries, relations and pagination", "الاستعلامات والعلاقات والترقيم", 19],
        ],
      },
      {
        title: ["Security and tests", "الأمان والاختبارات"],
        lessons: [
          ["Access and refresh tokens", "رموز الوصول والتحديث", 21],
          ["Writing API tests", "كتابة اختبارات الواجهة", 16],
        ],
      },
    ],
    quiz: [
      {
        prompt: ["Which status code means 'created'?", "أي رمز حالة يعني «تم الإنشاء»؟"],
        options: [
          ["200", "200"],
          ["201", "201"],
          ["204", "204"],
        ],
        correct: 1,
        explanation: ["201 Created is returned after a successful POST.", "يُعاد 201 بعد طلب POST ناجح."],
      },
      {
        prompt: ["Why paginate list endpoints?", "لماذا نقسّم نتائج القوائم إلى صفحات؟"],
        options: [
          ["To keep responses small and fast", "لإبقاء الاستجابات صغيرة وسريعة"],
          ["Because SQL requires it", "لأن SQL يتطلب ذلك"],
          ["To hide data", "لإخفاء البيانات"],
        ],
        correct: 0,
        explanation: ["Large lists slow down both server and client.", "القوائم الكبيرة تبطئ الخادم والعميل."],
      },
    ],
  },
  {
    slug: "demo-html-css-basics",
    category: "web-development",
    instructor: "karim",
    title: ["HTML & CSS from Zero", "HTML و CSS من الصفر"],
    short: ["Your first web page, explained line by line.", "صفحتك الأولى على الويب، مشروحة سطرًا بسطر."],
    description: [
      "A free starter course: structure a page with HTML, style it with CSS and make it work on phones.",
      "دورة مجانية للمبتدئين: نظّم الصفحة بـ HTML ونسّقها بـ CSS واجعلها تعمل على الهواتف.",
    ],
    level: "BEGINNER",
    language: "BOTH",
    price: 0,
    accessTier: "FREE",
    featured: false,
    sections: [
      {
        title: ["HTML", "HTML"],
        lessons: [
          ["Tags, elements and attributes", "الوسوم والعناصر والخصائص", 8],
          ["Headings, lists and links", "العناوين والقوائم والروابط", 10],
        ],
      },
      {
        title: ["CSS", "CSS"],
        lessons: [
          ["Selectors and colours", "المحددات والألوان", 11],
          ["Flexbox layouts", "التخطيط باستخدام Flexbox", 14],
          ["Making it responsive", "جعل الصفحة متجاوبة", 12],
        ],
      },
    ],
    quiz: [
      {
        prompt: ["Which tag creates a link?", "أي وسم ينشئ رابطًا؟"],
        options: [
          ["<a>", "<a>"],
          ["<link>", "<link>"],
          ["<p>", "<p>"],
        ],
        correct: 0,
        explanation: ["<a href> creates a hyperlink.", "الوسم <a href> ينشئ رابطًا."],
      },
      {
        prompt: ["Flexbox is mainly used for…", "يُستخدم Flexbox أساسًا من أجل…"],
        options: [
          ["Animations", "الحركات"],
          ["Laying out items in a row or column", "ترتيب العناصر في صف أو عمود"],
          ["Loading fonts", "تحميل الخطوط"],
        ],
        correct: 1,
        explanation: ["Flexbox arranges items along one axis.", "يرتّب Flexbox العناصر على محور واحد."],
      },
    ],
  },
  {
    slug: "demo-ui-design-figma",
    category: "design",
    instructor: "laila",
    title: ["UI Design Fundamentals in Figma", "أساسيات تصميم الواجهات في Figma"],
    short: ["Spacing, type and colour for interfaces that feel right.", "المسافات والخطوط والألوان لواجهات مريحة."],
    description: [
      "Design a mobile banking screen from scratch while learning grids, typography scales, colour systems and reusable components.",
      "صمّم شاشة تطبيق مصرفي من الصفر وتعلّم الشبكات ومقاييس الخطوط وأنظمة الألوان والمكوّنات القابلة لإعادة الاستخدام.",
    ],
    level: "BEGINNER",
    language: "BOTH",
    price: 35,
    accessTier: "STARTER",
    featured: true,
    sections: [
      {
        title: ["Seeing like a designer", "أن ترى كمصمم"],
        lessons: [
          ["Hierarchy and contrast", "التسلسل والتباين", 10],
          ["The 8-point spacing grid", "شبكة المسافات بثماني نقاط", 12],
        ],
      },
      {
        title: ["Type and colour", "الخط واللون"],
        lessons: [
          ["Building a type scale", "بناء مقياس للخطوط", 14],
          ["Accessible colour palettes", "لوحات ألوان سهلة الوصول", 15],
        ],
      },
      {
        title: ["Components", "المكوّنات"],
        lessons: [
          ["Auto layout basics", "أساسيات التخطيط التلقائي", 16],
          ["Variants and a mini design system", "المتغيرات ونظام تصميم مصغّر", 18],
        ],
      },
    ],
    quiz: [
      {
        prompt: ["Why use a spacing grid?", "لماذا نستخدم شبكة للمسافات؟"],
        options: [
          ["Consistent rhythm across screens", "إيقاع متناسق عبر الشاشات"],
          ["Smaller file size", "حجم ملف أصغر"],
          ["Faster exports", "تصدير أسرع"],
        ],
        correct: 0,
        explanation: ["Consistent spacing makes layouts feel calm.", "المسافات المتناسقة تجعل التصميم هادئًا."],
      },
      {
        prompt: ["Minimum contrast for body text (WCAG AA)?", "الحد الأدنى للتباين لنص المحتوى (WCAG AA)؟"],
        options: [
          ["2:1", "2:1"],
          ["4.5:1", "4.5:1"],
          ["10:1", "10:1"],
        ],
        correct: 1,
        explanation: ["AA asks for 4.5:1 on normal text.", "يتطلب معيار AA نسبة 4.5:1 للنص العادي."],
      },
    ],
  },
  {
    slug: "demo-arabic-calligraphy-naskh",
    category: "arabic-calligraphy",
    instructor: "laila",
    title: ["Arabic Calligraphy: Naskh for Beginners", "الخط العربي: خط النسخ للمبتدئين"],
    short: ["Hold the qalam, measure with dots, write your first words.", "أمسك القلم، وقِس بالنقاط، واكتب كلماتك الأولى."],
    description: [
      "Learn the tools, letter proportions and joining rules of Naskh, then write a short phrase you can frame.",
      "تعرّف على الأدوات ونِسَب الحروف وقواعد الوصل في خط النسخ، ثم اكتب عبارة قصيرة تصلح للتأطير.",
    ],
    level: "BEGINNER",
    language: "AR",
    price: 29,
    accessTier: "STARTER",
    featured: true,
    sections: [
      {
        title: ["Tools", "الأدوات"],
        lessons: [
          ["Choosing and cutting a qalam", "اختيار القلم وبَريه", 9],
          ["Ink, paper and posture", "الحبر والورق وجلسة الكتابة", 7],
        ],
      },
      {
        title: ["Letters", "الحروف"],
        lessons: [
          ["Measuring with rhombic dots", "القياس بالنقاط المعيّنة", 12],
          ["Alif, Ba and their family", "الألف والباء وأخواتها", 15],
          ["Round letters: Nun and Ya", "الحروف المستديرة: النون والياء", 14],
        ],
      },
      {
        title: ["Words", "الكلمات"],
        lessons: [
          ["Joining letters", "وصل الحروف", 13],
          ["Your first framed phrase", "أول عبارة مؤطّرة", 18],
        ],
      },
    ],
    quiz: [
      {
        prompt: ["What unit measures letter size in Naskh?", "ما وحدة قياس حجم الحروف في خط النسخ؟"],
        options: [
          ["The rhombic dot", "النقطة المعيّنة"],
          ["Centimetres", "السنتيمتر"],
          ["The line height", "ارتفاع السطر"],
        ],
        correct: 0,
        explanation: ["Proportions are counted in dots made by the qalam.", "تُحسب النِّسَب بالنقاط التي يرسمها القلم."],
      },
      {
        prompt: ["Which letter is the reference for proportions?", "أي حرف هو مرجع النِّسَب؟"],
        options: [
          ["Mim", "الميم"],
          ["Alif", "الألف"],
          ["Kaf", "الكاف"],
        ],
        correct: 1,
        explanation: ["The alif sets the scale for the whole script.", "الألف يحدد مقياس الخط كله."],
      },
      {
        prompt: ["A qalam is cut at…", "يُبرى القلم…"],
        options: [
          ["A slanted angle", "بزاوية مائلة"],
          ["A perfect right angle", "بزاوية قائمة تمامًا"],
          ["A round tip", "برأس مستدير"],
        ],
        correct: 0,
        explanation: ["The slanted nib creates thick and thin strokes.", "السنّ المائل يصنع الخطوط العريضة والرفيعة."],
      },
    ],
  },
  {
    slug: "demo-start-online-business",
    category: "business",
    instructor: "sara",
    title: ["Start Your Online Business", "ابدأ عملك عبر الإنترنت"],
    short: ["Validate an idea, find first customers, price with confidence.", "اختبر فكرتك، وابحث عن أول عملائك، وسعّر بثقة."],
    description: [
      "A practical playbook for solo founders: pick a niche, test demand in a weekend, set prices and land your first ten customers.",
      "دليل عملي لروّاد الأعمال المنفردين: اختر مجالًا، واختبر الطلب في عطلة نهاية أسبوع، وحدّد الأسعار، واحصل على أول عشرة عملاء.",
    ],
    level: "ALL_LEVELS",
    language: "BOTH",
    price: 45,
    accessTier: "PRO",
    featured: true,
    sections: [
      {
        title: ["The idea", "الفكرة"],
        lessons: [
          ["Finding a problem worth solving", "إيجاد مشكلة تستحق الحل", 11],
          ["A weekend demand test", "اختبار الطلب في عطلة أسبوع", 14],
        ],
      },
      {
        title: ["Customers", "العملاء"],
        lessons: [
          ["Writing an offer people understand", "كتابة عرض يفهمه الناس", 12],
          ["Pricing without guessing", "التسعير دون تخمين", 16],
          ["Your first ten customers", "أول عشرة عملاء", 15],
        ],
      },
    ],
    quiz: [
      {
        prompt: ["The cheapest way to test demand is…", "أرخص طريقة لاختبار الطلب هي…"],
        options: [
          ["Building the full product", "بناء المنتج كاملًا"],
          ["A simple page that collects sign-ups", "صفحة بسيطة تجمع التسجيلات"],
          ["Renting an office", "استئجار مكتب"],
        ],
        correct: 1,
        explanation: ["Sign-ups show real interest before you build.", "التسجيلات تُظهر اهتمامًا حقيقيًا قبل البناء."],
      },
      {
        prompt: ["Price should mainly reflect…", "يجب أن يعكس السعر أساسًا…"],
        options: [
          ["The value to the customer", "القيمة للعميل"],
          ["Your hours only", "ساعات عملك فقط"],
          ["Competitors' lowest price", "أقل سعر لدى المنافسين"],
        ],
        correct: 0,
        explanation: ["Customers pay for outcomes, not hours.", "يدفع العملاء مقابل النتائج لا الساعات."],
      },
    ],
  },
  {
    slug: "demo-freelancer-finance",
    category: "business",
    instructor: "sara",
    title: ["Personal Finance for Freelancers", "الإدارة المالية الشخصية للمستقلين"],
    short: ["Irregular income, steady life: budgets, taxes and savings.", "دخل غير منتظم وحياة مستقرة: الميزانية والضرائب والادخار."],
    description: [
      "Set up a simple money system that survives slow months: income buffers, tax pots, invoices and a savings habit.",
      "أنشئ نظامًا ماليًا بسيطًا يصمد في الأشهر الهادئة: احتياطي الدخل وحصالات الضرائب والفواتير وعادة الادخار.",
    ],
    level: "BEGINNER",
    language: "EN",
    price: 25,
    accessTier: "STARTER",
    featured: false,
    sections: [
      {
        title: ["Your money system", "نظامك المالي"],
        lessons: [
          ["Paying yourself a salary", "أن تدفع لنفسك راتبًا", 10],
          ["The three-pot method", "طريقة الحصالات الثلاث", 12],
        ],
      },
      {
        title: ["Staying ahead", "البقاء في المقدمة"],
        lessons: [
          ["Invoices that get paid on time", "فواتير تُدفع في موعدها", 11],
          ["Planning for slow months", "التخطيط للأشهر الهادئة", 13],
        ],
      },
    ],
    quiz: [
      {
        prompt: ["A buffer account helps you…", "يساعدك حساب الاحتياطي على…"],
        options: [
          ["Smooth out irregular income", "موازنة الدخل غير المنتظم"],
          ["Avoid invoicing", "تجنّب إصدار الفواتير"],
          ["Spend more", "إنفاق المزيد"],
        ],
        correct: 0,
        explanation: ["It pays your 'salary' in slow months.", "يدفع «راتبك» في الأشهر الهادئة."],
      },
      {
        prompt: ["When should you set tax money aside?", "متى يجب أن تجنّب مال الضرائب؟"],
        options: [
          ["At the end of the year", "في نهاية السنة"],
          ["Every time you are paid", "في كل مرة تتقاضى فيها أجرًا"],
          ["Never", "أبدًا"],
        ],
        correct: 1,
        explanation: ["Small, regular transfers avoid surprises.", "التحويلات الصغيرة المنتظمة تمنع المفاجآت."],
      },
    ],
  },
  {
    slug: "demo-english-for-professionals",
    category: "languages",
    instructor: "sara",
    title: ["Conversational English for Professionals", "الإنجليزية المحادثة للمهنيين"],
    short: ["Meetings, emails and small talk without the nerves.", "الاجتماعات والرسائل والأحاديث الجانبية دون توتر."],
    description: [
      "Practise the phrases you actually need at work: introducing yourself, running a meeting, disagreeing politely and writing clear emails.",
      "تدرّب على العبارات التي تحتاجها فعلًا في العمل: التعريف بنفسك وإدارة اجتماع والاعتراض بلطف وكتابة رسائل واضحة.",
    ],
    level: "INTERMEDIATE",
    language: "BOTH",
    price: 30,
    accessTier: "STARTER",
    featured: false,
    sections: [
      {
        title: ["Speaking", "التحدث"],
        lessons: [
          ["Introducing yourself with confidence", "التعريف بنفسك بثقة", 9],
          ["Small talk that isn't awkward", "أحاديث جانبية بلا حرج", 11],
          ["Disagreeing politely", "الاعتراض بلطف", 10],
        ],
      },
      {
        title: ["Writing", "الكتابة"],
        lessons: [
          ["Short, clear emails", "رسائل قصيرة وواضحة", 12],
          ["Following up without being pushy", "المتابعة دون إلحاح", 8],
        ],
      },
    ],
    quiz: [
      {
        prompt: ["Which phrase disagrees politely?", "أي عبارة تعبّر عن الاعتراض بلطف؟"],
        options: [
          ["\"That's wrong.\"", "\"That's wrong.\""],
          ["\"I see it a little differently.\"", "\"I see it a little differently.\""],
          ["\"No.\"", "\"No.\""],
        ],
        correct: 1,
        explanation: ["Softeners keep the conversation open.", "عبارات التلطيف تُبقي الحوار مفتوحًا."],
      },
      {
        prompt: ["A good email subject line is…", "سطر الموضوع الجيد في الرسالة…"],
        options: [
          ["Specific and short", "محدد وقصير"],
          ["Empty", "فارغ"],
          ["Written in capitals", "مكتوب بأحرف كبيرة"],
        ],
        correct: 0,
        explanation: ["The reader should know the topic at a glance.", "يجب أن يعرف القارئ الموضوع من نظرة."],
      },
    ],
  },
];

export const DEMO_REVIEWS: { rating: number; title: Pair; body: Pair }[] = [
  {
    rating: 5,
    title: ["Clear and practical", "واضحة وعملية"],
    body: ["Every lesson is short and ends with something I can try right away.", "كل درس قصير وينتهي بشيء أستطيع تجربته فورًا."],
  },
  {
    rating: 5,
    title: ["Exactly what I needed", "ما كنت أحتاجه تمامًا"],
    body: ["I finished it in a week and already used it at work.", "أنهيتها في أسبوع واستخدمتها في العمل بالفعل."],
  },
  {
    rating: 4,
    title: ["Great pace", "إيقاع رائع"],
    body: ["Good explanations. I'd love a few more exercises.", "شرح جيد. أتمنى لو كانت هناك تمارين أكثر."],
  },
  {
    rating: 5,
    title: ["Loved the bilingual notes", "أحببت الملاحظات بلغتين"],
    body: ["Having Arabic and English side by side helped a lot.", "وجود العربية والإنجليزية جنبًا إلى جنب ساعدني كثيرًا."],
  },
  {
    rating: 4,
    title: ["Solid course", "دورة متينة"],
    body: ["Well structured. The quiz at the end is a nice check.", "منظمة جيدًا. الاختبار في النهاية مراجعة لطيفة."],
  },
  {
    rating: 3,
    title: ["Good but basic", "جيدة لكنها أساسية"],
    body: ["Helpful for beginners; I already knew most of it.", "مفيدة للمبتدئين، كنت أعرف معظمها مسبقًا."],
  },
];
