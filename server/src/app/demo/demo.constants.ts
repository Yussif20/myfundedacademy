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
 * Hosts the plain-MP4 video provider may stream from. Lesson video IDs of the
 * form `mp4:<url>` are only honoured when the URL is HTTPS on one of these.
 */
export const ALLOWED_MP4_HOSTS = ["commondatastorage.googleapis.com"];
