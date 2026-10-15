import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// No real database in tests: stub only the queries the guarded routes touch.
const db = vi.hoisted(() => ({
  course: { findUnique: vi.fn() },
  instructorProfile: { findFirst: vi.fn() },
  quiz: { findUnique: vi.fn() },
}));
vi.mock("@/lib/db/db", () => ({ prisma: db, insecurePrisma: db }));

import app from "@/app";
import { demoBlockReason } from "@/app/demo/demo.policy";
import { redactEmails } from "@/app/demo/demo.guard";
import { isValidResetSecret } from "@/app/demo/demo.controller";
import { parseDirectVideoUrl } from "@/lib/video/provider";
import { signAccessToken } from "@/utils/jwt";

const COURSE_ID = "11111111-1111-4111-8111-111111111111";
const bearer = (role: "STUDENT" | "INSTRUCTOR" | "ADMIN", demo = true) =>
  `Bearer ${signAccessToken({ sub: `user-${role}`, email: "demo@example.com", role, ...(demo ? { demo: true } : {}) })}`;

describe("demoBlockReason", () => {
  const p = (method: string, path: string, role: "STUDENT" | "INSTRUCTOR" | "ADMIN" = "STUDENT", body?: unknown) =>
    demoBlockReason({ method, path, role, body });

  it("lets every read through, even for the demo admin", () => {
    expect(p("GET", "/users", "ADMIN")).toBeNull();
  });

  it("makes the demo admin read-only", () => {
    expect(p("PATCH", "/courses/abc", "ADMIN")).toMatch(/read-only/);
    expect(p("POST", "/auth/logout", "ADMIN")).toBeNull();
  });

  it("blocks identity changes but allows switching language", () => {
    expect(p("POST", "/users/me/change-password")).toMatch(/Password/);
    expect(p("PATCH", "/users/me", "STUDENT", { fullName: "x" })).toMatch(/Profile/);
    expect(p("PATCH", "/users/me", "STUDENT", { preferredLocale: "ar" })).toBeNull();
  });

  it("blocks deleting or publishing courses but allows editing lessons", () => {
    expect(p("DELETE", `/courses/${COURSE_ID}`, "INSTRUCTOR")).toMatch(/Deleting courses/);
    expect(p("POST", `/courses/${COURSE_ID}/publish`, "INSTRUCTOR")).toMatch(/Publishing/);
    expect(p("PATCH", `/courses/${COURSE_ID}`, "INSTRUCTOR")).toBeNull();
    expect(p("DELETE", "/courses/lessons/abc", "INSTRUCTOR")).toBeNull();
    expect(p("POST", "/courses/sections/abc/lessons", "INSTRUCTOR")).toBeNull();
  });

  it("blocks review deletion and uploads; allows learning flows", () => {
    expect(p("DELETE", "/reviews/abc")).toMatch(/reviews/);
    expect(p("POST", "/uploads/avatar-presign")).toMatch(/uploads/);
    expect(p("POST", "/reviews/courses/some-course")).toBeNull();
    expect(p("POST", "/quizzes/courses/some-course/attempt")).toBeNull();
    expect(p("POST", "/orders/checkout-course")).toBeNull();
  });
});

describe("demo guard on the real app", () => {
  it("returns 403 for a blocked demo write", async () => {
    const res = await request(app)
      .post("/api/v1/users/me/change-password")
      .set("Authorization", bearer("STUDENT"))
      .send({ currentPassword: "x", newPassword: "12345678" });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/Password changes are disabled/);
  });

  it("returns 403 when the demo admin tries to delete a user", async () => {
    const res = await request(app)
      .delete(`/api/v1/users/${COURSE_ID}`)
      .set("Authorization", bearer("ADMIN"));
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/read-only/);
  });

  it("redacts non-demo emails in demo responses", () => {
    expect(
      redactEmails({ data: [{ email: "real@gmail.com" }, { email: "learner01@example.com" }] }),
    ).toEqual({ data: [{ email: "hidden@example.com" }, { email: "learner01@example.com" }] });
  });
});

describe("instructor quiz authoring (was ADMIN-only)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    db.course.findUnique.mockResolvedValue({ instructorId: "profile-owner", isDeleted: false });
    db.quiz.findUnique.mockResolvedValue({ id: "quiz-1", questions: [] });
  });

  it("lets the owning instructor read the quiz", async () => {
    db.instructorProfile.findFirst.mockResolvedValue({ id: "profile-owner" });
    const res = await request(app)
      .get(`/api/v1/quizzes/admin/courses/${COURSE_ID}`)
      .set("Authorization", bearer("INSTRUCTOR", false));
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe("quiz-1");
  });

  it("rejects an instructor who doesn't own the course", async () => {
    db.instructorProfile.findFirst.mockResolvedValue({ id: "someone-else" });
    const res = await request(app)
      .get(`/api/v1/quizzes/admin/courses/${COURSE_ID}`)
      .set("Authorization", bearer("INSTRUCTOR", false));
    expect(res.status).toBe(403);
    expect(db.quiz.findUnique).not.toHaveBeenCalled();
  });

  it("still rejects students", async () => {
    const res = await request(app)
      .get(`/api/v1/quizzes/admin/courses/${COURSE_ID}`)
      .set("Authorization", bearer("STUDENT", false));
    expect(res.status).toBe(403);
  });
});

describe("demo reset endpoint", () => {
  it("rejects a wrong secret without touching data", async () => {
    const res = await request(app)
      .post("/api/v1/internal/demo-reset")
      .set("x-demo-reset-secret", "wrong");
    expect(res.status).toBe(401);
  });

  it("compares secrets safely and treats an empty config as disabled", () => {
    expect(isValidResetSecret("abc", "abc")).toBe(true);
    expect(isValidResetSecret("abd", "abc")).toBe(false);
    expect(isValidResetSecret("abc", "")).toBe(false);
    expect(isValidResetSecret(undefined, "abc")).toBe(false);
  });
});

describe("plain MP4 video provider", () => {
  it("accepts HTTPS URLs on allowed hosts only", () => {
    const ok = "mp4:https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";
    expect(parseDirectVideoUrl(ok)).toMatch(/^https:\/\/commondatastorage/);
    expect(parseDirectVideoUrl("mp4:https://evil.example.net/x.mp4")).toBeNull();
    expect(parseDirectVideoUrl("mp4:http://commondatastorage.googleapis.com/x.mp4")).toBeNull();
    expect(parseDirectVideoUrl("a1b2c3vdocipherid")).toBeNull();
  });
});
