type Locale = "en" | "ar";

const wrap = (locale: Locale, content: string, preheader: string) => `
<!doctype html>
<html lang="${locale}" dir="${locale === "ar" ? "rtl" : "ltr"}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Funded Academy</title>
  </head>
  <body style="margin:0;padding:0;background:#0A0F14;color:#FAFAF9;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
    <span style="display:none;visibility:hidden;opacity:0;color:transparent;height:0;width:0;">${preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0F14;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#111720;border:1px solid #1F2937;border-radius:12px;padding:40px 32px;">
            <tr>
              <td>
                <div style="display:inline-block;padding:8px 12px;background:#0F766E;color:#FAFAF9;font-weight:700;letter-spacing:0.05em;border-radius:8px;font-size:14px;">MFA</div>
                <h1 style="margin:24px 0 8px 0;font-size:24px;font-weight:700;letter-spacing:-0.02em;">My Funded Academy</h1>
                ${content}
                <p style="margin:32px 0 0 0;font-size:12px;color:#9CA3AF;">If you didn't request this, you can safely ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const button = (href: string, label: string) => `
  <a href="${href}" style="display:inline-block;background:#0F766E;color:#FAFAF9;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:24px 0;">${label}</a>
`;

export function verifyEmailTemplate(opts: { fullName: string; link: string; locale: Locale }) {
  const { fullName, link, locale } = opts;
  const isAr = locale === "ar";

  const content = isAr
    ? `
      <p style="margin:16px 0;font-size:16px;color:#E5E7EB;">مرحباً ${fullName}،</p>
      <p style="margin:16px 0;font-size:14px;color:#9CA3AF;line-height:1.6;">
        شكراً لإنشاء حسابك في ماي فاندد أكاديمي. اضغط على الزر أدناه لتأكيد بريدك الإلكتروني.
      </p>
      ${button(link, "تأكيد البريد الإلكتروني")}
      <p style="margin:16px 0;font-size:12px;color:#9CA3AF;">هذا الرابط صالح لمدة 24 ساعة.</p>
    `
    : `
      <p style="margin:16px 0;font-size:16px;color:#E5E7EB;">Hi ${fullName},</p>
      <p style="margin:16px 0;font-size:14px;color:#9CA3AF;line-height:1.6;">
        Thanks for joining My Funded Academy. Click the button below to verify your email address and activate your account.
      </p>
      ${button(link, "Verify your email")}
      <p style="margin:16px 0;font-size:12px;color:#9CA3AF;">This link expires in 24 hours.</p>
    `;

  return {
    subject: isAr ? "فعّل حسابك في ماي فاندد أكاديمي" : "Verify your My Funded Academy account",
    html: wrap(locale, content, isAr ? "أكّد بريدك الإلكتروني" : "Verify your email"),
    text: isAr
      ? `مرحباً ${fullName}،\n\nأكّد بريدك الإلكتروني عبر الرابط:\n${link}\n\nهذا الرابط صالح لمدة 24 ساعة.`
      : `Hi ${fullName},\n\nVerify your email by visiting:\n${link}\n\nThis link expires in 24 hours.`,
  };
}

export function passwordResetTemplate(opts: { fullName: string; link: string; locale: Locale }) {
  const { fullName, link, locale } = opts;
  const isAr = locale === "ar";

  const content = isAr
    ? `
      <p style="margin:16px 0;font-size:16px;color:#E5E7EB;">مرحباً ${fullName}،</p>
      <p style="margin:16px 0;font-size:14px;color:#9CA3AF;line-height:1.6;">
        لقد طلبت إعادة تعيين كلمة المرور. اضغط الزر أدناه لتعيين كلمة مرور جديدة.
      </p>
      ${button(link, "إعادة تعيين كلمة المرور")}
      <p style="margin:16px 0;font-size:12px;color:#9CA3AF;">الرابط صالح لمدة ساعة واحدة فقط.</p>
    `
    : `
      <p style="margin:16px 0;font-size:16px;color:#E5E7EB;">Hi ${fullName},</p>
      <p style="margin:16px 0;font-size:14px;color:#9CA3AF;line-height:1.6;">
        You requested a password reset. Click the button below to set a new password.
      </p>
      ${button(link, "Reset password")}
      <p style="margin:16px 0;font-size:12px;color:#9CA3AF;">This link expires in 1 hour.</p>
    `;

  return {
    subject: isAr ? "إعادة تعيين كلمة المرور" : "Reset your My Funded Academy password",
    html: wrap(locale, content, isAr ? "إعادة تعيين كلمة المرور" : "Reset your password"),
    text: isAr
      ? `مرحباً ${fullName}،\n\nأعد تعيين كلمة المرور عبر:\n${link}\n\nالرابط صالح لمدة ساعة.`
      : `Hi ${fullName},\n\nReset your password at:\n${link}\n\nThis link expires in 1 hour.`,
  };
}

export function passwordChangedTemplate(opts: { fullName: string; locale: Locale }) {
  const { fullName, locale } = opts;
  const isAr = locale === "ar";

  const content = isAr
    ? `
      <p style="margin:16px 0;font-size:16px;color:#E5E7EB;">مرحباً ${fullName}،</p>
      <p style="margin:16px 0;font-size:14px;color:#9CA3AF;line-height:1.6;">
        تم تغيير كلمة مرور حسابك بنجاح. إذا لم تقم أنت بهذا الإجراء، تواصل معنا فوراً.
      </p>
    `
    : `
      <p style="margin:16px 0;font-size:16px;color:#E5E7EB;">Hi ${fullName},</p>
      <p style="margin:16px 0;font-size:14px;color:#9CA3AF;line-height:1.6;">
        Your password was just changed. If this wasn't you, please contact us right away.
      </p>
    `;

  return {
    subject: isAr ? "تم تغيير كلمة المرور" : "Your password was changed",
    html: wrap(locale, content, isAr ? "تم تغيير كلمة المرور" : "Password changed"),
    text: isAr
      ? `مرحباً ${fullName}،\n\nتم تغيير كلمة مرور حسابك. إذا لم تقم بذلك، تواصل معنا.`
      : `Hi ${fullName},\n\nYour password was changed. If this wasn't you, contact us.`,
  };
}
