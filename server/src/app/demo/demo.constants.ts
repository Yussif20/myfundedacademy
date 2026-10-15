/**
 * Fixed identities for the public "Try the demo" sign-in. Emails use the
 * IANA-reserved example.com domain so they can never belong to a real person.
 */
export const DEMO_ACCOUNTS = {
  student: "demo-student@example.com",
  instructor: "demo-instructor@example.com",
  admin: "demo-admin@example.com",
} as const;

export type DemoRole = keyof typeof DEMO_ACCOUNTS;

/**
 * Extra HTTPS hosts the plain-MP4 provider may stream from (`mp4:https://…`).
 * Empty by default: demo clips ship with the frontend under /demo/videos/.
 */
export const ALLOWED_MP4_HOSTS: string[] = [];

/** Same-origin clips bundled in frontend/public, e.g. `mp4:/demo/videos/x.mp4`. */
export const LOCAL_MP4_PATH = /^\/demo\/videos\/[a-z0-9-]+\.mp4$/;
