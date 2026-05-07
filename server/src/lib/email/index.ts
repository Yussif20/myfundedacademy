import { logger } from "@/utils/logger";
import { env } from "@/env";

export type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

/**
 * Email sender. In MVP-mode (no RESEND_API_KEY set) we log emails to the
 * console with the verification/reset link extracted, so devs can click it
 * locally. Once a Resend key lands the real send swaps in transparently.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailArgs): Promise<void> {
  if (!env.RESEND_API_KEY) {
    const linkMatch = /href="(https?:\/\/[^"]+)"/i.exec(html);
    const previewLink = linkMatch ? linkMatch[1] : null;

    logger.info(`📧 [STUBBED EMAIL] to=${to} subject="${subject}"`, { type: "EMAIL" });
    if (previewLink) {
      logger.info(`   ➜ Action link: ${previewLink}`, { type: "EMAIL" });
    }
    if (text) {
      logger.info(`   ➜ Text:\n${text}`, { type: "EMAIL" });
    }
    return;
  }

  // Real Resend integration lands when RESEND_API_KEY is set.
  // Defer to a background task; for MVP we send inline.
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    logger.error(`Resend send failed: ${res.status} ${body}`, { type: "EMAIL" });
    throw new Error(`Resend error: ${res.status}`);
  }
}
