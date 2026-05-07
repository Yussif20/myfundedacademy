"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { extractApiError } from "@/lib/errors";
import {
  useGetCourseQuizForAdminQuery,
  useRemoveCourseQuizMutation,
  useUpsertCourseQuizMutation,
  type UpsertQuizQuestionInput,
} from "@/redux/api/quizzesApi";
import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type DraftOption = {
  text: string;
  textArabic: string;
  isCorrect: boolean;
};

type DraftQuestion = {
  prompt: string;
  promptArabic: string;
  explanation: string;
  explanationArabic: string;
  options: DraftOption[];
};

const blankOption = (): DraftOption => ({ text: "", textArabic: "", isCorrect: false });

const blankQuestion = (): DraftQuestion => ({
  prompt: "",
  promptArabic: "",
  explanation: "",
  explanationArabic: "",
  options: [{ ...blankOption(), isCorrect: true }, blankOption(), blankOption(), blankOption()],
});

export function QuizEditor({ courseId }: { courseId: string }) {
  const { data, isLoading, refetch } = useGetCourseQuizForAdminQuery(courseId, { skip: !courseId });
  const [upsertQuiz, { isLoading: saving }] = useUpsertCourseQuizMutation();
  const [removeQuiz, { isLoading: removing }] = useRemoveCourseQuizMutation();

  const [title, setTitle] = useState("");
  const [titleArabic, setTitleArabic] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Hydrate draft from server data on first load
  useEffect(() => {
    const quiz = data?.data;
    if (!quiz) return;
    setTitle(quiz.title || "");
    setTitleArabic(quiz.titleArabic || "");
    setPassingScore(quiz.passingScore || 70);
    setQuestions(
      quiz.questions.map((q) => ({
        prompt: q.prompt,
        promptArabic: q.promptArabic || "",
        explanation: q.explanation || "",
        explanationArabic: q.explanationArabic || "",
        options: q.options.map((o) => ({
          text: o.text,
          textArabic: o.textArabic || "",
          isCorrect: Boolean(o.isCorrect),
        })),
      })),
    );
  }, [data]);

  const setQuestion = (idx: number, patch: Partial<DraftQuestion>) =>
    setQuestions((arr) => arr.map((q, i) => (i === idx ? { ...q, ...patch } : q)));

  const setOption = (qi: number, oi: number, patch: Partial<DraftOption>) =>
    setQuestions((arr) =>
      arr.map((q, i) =>
        i === qi
          ? {
              ...q,
              options: q.options.map((o, j) => (j === oi ? { ...o, ...patch } : o)),
            }
          : q,
      ),
    );

  const setCorrectOption = (qi: number, oi: number) =>
    setQuestions((arr) =>
      arr.map((q, i) =>
        i === qi
          ? {
              ...q,
              options: q.options.map((o, j) => ({ ...o, isCorrect: j === oi })),
            }
          : q,
      ),
    );

  const addQuestion = () => setQuestions((arr) => [...arr, blankQuestion()]);
  const removeQuestion = (idx: number) => setQuestions((arr) => arr.filter((_, i) => i !== idx));

  const addOption = (qi: number) =>
    setQuestions((arr) =>
      arr.map((q, i) =>
        i === qi && q.options.length < 8 ? { ...q, options: [...q.options, blankOption()] } : q,
      ),
    );

  const removeOption = (qi: number, oi: number) =>
    setQuestions((arr) =>
      arr.map((q, i) =>
        i === qi && q.options.length > 2
          ? {
              ...q,
              options: q.options.filter((_, j) => j !== oi),
            }
          : q,
      ),
    );

  const onSave = async () => {
    setError(null);
    setSavedAt(null);

    if (questions.length === 0) {
      setError("Add at least one question.");
      return;
    }
    for (const q of questions) {
      if (!q.prompt.trim()) {
        setError("Every question needs a prompt.");
        return;
      }
      if (!q.options.some((o) => o.isCorrect)) {
        setError("Every question needs one correct option.");
        return;
      }
      if (q.options.some((o) => !o.text.trim())) {
        setError("Every option needs text.");
        return;
      }
    }

    try {
      const payload: UpsertQuizQuestionInput[] = questions.map((q) => ({
        prompt: q.prompt,
        promptArabic: q.promptArabic,
        explanation: q.explanation,
        explanationArabic: q.explanationArabic,
        options: q.options.map((o) => ({
          text: o.text,
          textArabic: o.textArabic,
          isCorrect: o.isCorrect,
        })),
      }));
      await upsertQuiz({
        courseId,
        title,
        titleArabic,
        passingScore,
        questions: payload,
      }).unwrap();
      setSavedAt(Date.now());
      refetch();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  const onRemove = async () => {
    if (!confirm("Remove the quiz from this course?")) return;
    setError(null);
    try {
      await removeQuiz({ courseId }).unwrap();
      setQuestions([]);
      setTitle("");
      setTitleArabic("");
      setPassingScore(70);
      refetch();
    } catch (err) {
      setError(extractApiError(err));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-[var(--primary)]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Final quiz</CardTitle>
        <CardDescription>
          Optional. If set, students must pass it before earning a certificate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {savedAt && (
          <Alert variant="success">
            <AlertDescription>Quiz saved.</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quiz-title">Title (English)</Label>
            <Input
              id="quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Final assessment"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quiz-title-ar">Title (Arabic)</Label>
            <Input
              id="quiz-title-ar"
              value={titleArabic}
              onChange={(e) => setTitleArabic(e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2 md:max-w-[200px]">
            <Label htmlFor="passing-score">Passing score (%)</Label>
            <Input
              id="passing-score"
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(Math.max(0, Math.min(100, Number(e.target.value))))}
            />
          </div>
        </div>

        {questions.length === 0 ? (
          <p className="rounded-md border border-dashed border-[var(--border)] py-8 text-center text-sm text-[var(--muted-foreground)]">
            No questions yet. Add the first one to start.
          </p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q, qi) => (
              <li
                key={qi}
                className="space-y-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Question {qi + 1}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(qi)}
                    aria-label="Remove question"
                  >
                    <Trash2 className="size-4 text-[var(--destructive)]" />
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Prompt (English)</Label>
                    <Textarea
                      value={q.prompt}
                      onChange={(e) => setQuestion(qi, { prompt: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prompt (Arabic)</Label>
                    <Textarea
                      value={q.promptArabic}
                      onChange={(e) => setQuestion(qi, { promptArabic: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Options (one must be correct)</Label>
                  <ul className="space-y-2">
                    {q.options.map((o, oi) => (
                      <li
                        key={oi}
                        className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] p-2"
                      >
                        <button
                          type="button"
                          onClick={() => setCorrectOption(qi, oi)}
                          className={
                            o.isCorrect
                              ? "grid size-7 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]"
                              : "grid size-7 place-items-center rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                          }
                          aria-label="Mark as correct"
                        >
                          {o.isCorrect ? <CheckCircle2 className="size-4" /> : null}
                        </button>
                        <Input
                          value={o.text}
                          onChange={(e) => setOption(qi, oi, { text: e.target.value })}
                          placeholder="Option text (English)"
                          className="flex-1"
                        />
                        <Input
                          value={o.textArabic}
                          onChange={(e) => setOption(qi, oi, { textArabic: e.target.value })}
                          placeholder="Arabic"
                          className="flex-1"
                        />
                        {q.options.length > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOption(qi, oi)}
                            aria-label="Remove option"
                          >
                            <Trash2 className="size-4 text-[var(--destructive)]" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                  {q.options.length < 8 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addOption(qi)}
                      className="gap-2"
                    >
                      <Plus className="size-3.5" />
                      Add option
                    </Button>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Explanation (optional, English)</Label>
                    <Textarea
                      value={q.explanation}
                      onChange={(e) => setQuestion(qi, { explanation: e.target.value })}
                      rows={2}
                      placeholder="Shown after submission to teach the right answer."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Explanation (optional, Arabic)</Label>
                    <Textarea
                      value={q.explanationArabic}
                      onChange={(e) => setQuestion(qi, { explanationArabic: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-4 sm:flex-row sm:justify-between">
          <Button variant="outline" onClick={addQuestion} className="gap-2">
            <Plus className="size-4" />
            Add question
          </Button>

          <div className="flex items-center gap-2">
            {data?.data && (
              <Button variant="ghost" onClick={onRemove} disabled={removing}>
                {removing ? "Removing…" : "Remove quiz"}
              </Button>
            )}
            <Button onClick={onSave} disabled={saving || questions.length === 0}>
              {saving ? "Saving…" : "Save quiz"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
