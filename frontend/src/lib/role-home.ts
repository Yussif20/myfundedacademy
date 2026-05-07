export type AppRole = "STUDENT" | "INSTRUCTOR" | "ADMIN";

/**
 * Returns the canonical landing path for a given role. Used by the auth
 * guard (when a user lands on the wrong area) and the login flow (where
 * to send users after successful sign-in).
 */
export function roleHome(role: AppRole | string | undefined): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "INSTRUCTOR":
      return "/instructor";
    default:
      return "/account";
  }
}
