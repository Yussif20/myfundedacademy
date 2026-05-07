import { baseApi } from "./baseApi";

type Envelope<T> = { statusCode: number; success: boolean; message?: string; data: T };

export type QuizOption = {
  id: string;
  text: string;
  textArabic: string;
  isCorrect?: boolean; // only present in admin view
  order: number;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  promptArabic: string;
  explanation: string;
  explanationArabic: string;
  order: number;
  options: QuizOption[];
};

export type Quiz = {
  id: string;
  courseId: string;
  title: string;
  titleArabic: string;
  passingScore: number;
  questions: QuizQuestion[];
};

export type QuizAttemptResult = {
  attemptId: string;
  score: number;
  passed: boolean;
  passingScore: number;
  total: number;
  correct: number;
  breakdown: Array<{
    questionId: string;
    selectedOptionId: string | null;
    correctOptionId: string | null;
    isCorrect: boolean;
  }>;
};

export type Certificate = {
  id: string;
  code: string;
  userId: string;
  courseId: string;
  passedQuiz: boolean;
  issuedAt: string;
  course?: {
    id: string;
    slug: string;
    title: string;
    titleArabic: string;
    thumbnail?: string;
    instructor?: { user: { fullName: string } };
  };
  user?: { fullName: string; email?: string };
};

// Payload for upserting an entire quiz
export type UpsertQuizQuestionInput = {
  prompt: string;
  promptArabic?: string;
  explanation?: string;
  explanationArabic?: string;
  options: Array<{
    text: string;
    textArabic?: string;
    isCorrect?: boolean;
  }>;
};

export const quizzesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ----- Admin -----
    getCourseQuizForAdmin: builder.query<Envelope<Quiz | null>, string>({
      query: (courseId) => ({ url: `/quizzes/admin/courses/${courseId}` }),
      providesTags: (_r, _e, courseId) => [{ type: "Quiz", id: courseId }],
    }),

    upsertCourseQuiz: builder.mutation<
      Envelope<Quiz>,
      {
        courseId: string;
        title?: string;
        titleArabic?: string;
        passingScore?: number;
        questions: UpsertQuizQuestionInput[];
      }
    >({
      query: ({ courseId, ...body }) => ({
        url: `/quizzes/admin/courses/${courseId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Quiz", id: arg.courseId },
        { type: "Course", id: arg.courseId },
      ],
    }),

    removeCourseQuiz: builder.mutation<
      { statusCode: number; success: boolean; message?: string },
      { courseId: string }
    >({
      query: ({ courseId }) => ({ url: `/quizzes/admin/courses/${courseId}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Quiz", id: arg.courseId }],
    }),

    // ----- Student -----
    getCourseQuizForStudent: builder.query<Envelope<Quiz>, string>({
      query: (slug) => ({ url: `/quizzes/courses/${slug}` }),
      providesTags: (_r, _e, slug) => [{ type: "Quiz", id: `student-${slug}` }],
    }),

    attemptQuiz: builder.mutation<
      Envelope<QuizAttemptResult>,
      { slug: string; answers: Record<string, string> }
    >({
      query: ({ slug, answers }) => ({
        url: `/quizzes/courses/${slug}/attempt`,
        method: "POST",
        body: { answers },
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "QuizAttempt", id: arg.slug },
        { type: "Course", id: `progress-${arg.slug}` },
      ],
    }),

    // ----- Certificate -----
    issueCertificate: builder.mutation<Envelope<Certificate>, { slug: string }>({
      query: ({ slug }) => ({ url: `/quizzes/courses/${slug}/certificate`, method: "POST" }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "Certificate", id: arg.slug },
        { type: "Certificates", id: "MINE" },
      ],
    }),

    getMyCertificateForCourse: builder.query<Envelope<Certificate>, string>({
      query: (slug) => ({ url: `/quizzes/courses/${slug}/certificate/me` }),
      providesTags: (_r, _e, slug) => [{ type: "Certificate", id: slug }],
    }),

    listMyCertificates: builder.query<Envelope<Certificate[]>, void>({
      query: () => ({ url: "/quizzes/certificates/me" }),
      providesTags: [{ type: "Certificates", id: "MINE" }],
    }),

    verifyCertificate: builder.query<Envelope<Certificate>, string>({
      query: (code) => ({ url: `/quizzes/certificates/verify/${code}` }),
    }),
  }),
});

export const {
  useGetCourseQuizForAdminQuery,
  useUpsertCourseQuizMutation,
  useRemoveCourseQuizMutation,
  useGetCourseQuizForStudentQuery,
  useAttemptQuizMutation,
  useIssueCertificateMutation,
  useGetMyCertificateForCourseQuery,
  useListMyCertificatesQuery,
  useVerifyCertificateQuery,
} = quizzesApi;
