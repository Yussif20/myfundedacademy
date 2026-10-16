/**
 * Marketing showcase content for the public home page.
 *
 * Everything here is illustrative: the people are invented and no real
 * company is named. Swap it for real, consented quotes before launch.
 */

export type ShowcaseTestimonial = {
  name: string;
  nameArabic: string;
  role: string;
  roleArabic: string;
  body: string;
  bodyArabic: string;
  initials: string;
  rating: number;
};

export const showcaseTestimonials: ShowcaseTestimonial[] = [
  {
    name: "Mariam S.",
    nameArabic: "مريم س.",
    role: "Learner · Web development",
    roleArabic: "متعلّمة · تطوير الويب",
    initials: "MS",
    rating: 5,
    body: "Short lessons and a quiz after every section kept me going. I built my first portfolio site in five weeks and shared the certificate link with my first client.",
    bodyArabic:
      "الدروس القصيرة والاختبار بعد كل قسم جعلاني أستمر. بنيت أول موقع لأعمالي خلال خمسة أسابيع وشاركت رابط الشهادة مع أول عميل لي.",
  },
  {
    name: "Omar H.",
    nameArabic: "عمر ح.",
    role: "Instructor · UI design",
    roleArabic: "مدرّب · تصميم الواجهات",
    initials: "OH",
    rating: 5,
    body: "I uploaded my course, set a price and had students the same week. The builder handles sections, quizzes and certificates, so I can focus on teaching.",
    bodyArabic:
      "رفعت دورتي وحدّدت السعر وبدأ الطلاب بالتسجيل في الأسبوع نفسه. أداة بناء الدورات تتولّى الأقسام والاختبارات والشهادات، فأتفرّغ أنا للتدريس.",
  },
  {
    name: "Nour A.",
    nameArabic: "نور أ.",
    role: "Learner · Arabic calligraphy",
    roleArabic: "متعلّمة · الخط العربي",
    initials: "NA",
    rating: 5,
    body: "Learning in Arabic with a proper right-to-left layout made a real difference. My lesson progress follows me between my phone and laptop.", // rtl-allow
    bodyArabic:
      "التعلّم بالعربية بواجهة من اليمين إلى اليسار صنع فرقاً حقيقياً. وتقدّمي في الدروس يرافقني بين الهاتف والحاسوب.",
  },
];

export type ShowcaseTopic = { en: string; ar: string };

/** Subjects shown in the home-page marquee. */
export const showcaseTopics: ShowcaseTopic[] = [
  { en: "Web development", ar: "تطوير الويب" },
  { en: "UI & UX design", ar: "تصميم الواجهات" },
  { en: "Arabic calligraphy", ar: "الخط العربي" },
  { en: "Data analysis", ar: "تحليل البيانات" },
  { en: "Photography", ar: "التصوير" },
  { en: "Public speaking", ar: "فن الإلقاء" },
  { en: "Digital marketing", ar: "التسويق الرقمي" },
  { en: "Languages", ar: "اللغات" },
  { en: "Small business", ar: "المشاريع الصغيرة" },
  { en: "Productivity", ar: "الإنتاجية" },
];
