import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Development: onboarding@resend.dev (pa nevojë verifikimi domain)
// Production: ndrysho me domenin e verifikuar → "Unify <noreply@unify.ks>"
export const FROM_EMAIL = process.env.NODE_ENV === "production"
  ? "Unify <noreply@unify.ks>"
  : "Unify <onboarding@resend.dev>";

// ─── Email Templates ──────────────────────────────────────────────────────────

export async function sendCampaignApprovedEmail(to: string, campaignTitle: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `✅ Kampanja jote u aprovua — ${campaignTitle}`,
    html: `
      <h2>Kampanja jote u aprovua!</h2>
      <p>Kampanja <strong>${campaignTitle}</strong> tani është aktive dhe e dukshme për të gjithë.</p>
      <p>Faleminderit që zgjidhët Unify!</p>
    `,
  });
}

export async function sendCampaignRejectedEmail(
  to: string,
  campaignTitle: string,
  reason: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `❌ Kampanja jote u refuzua — ${campaignTitle}`,
    html: `
      <h2>Kampanja jote u refuzua</h2>
      <p>Kampanja <strong>${campaignTitle}</strong> nuk u aprovua.</p>
      <p><strong>Arsyeja:</strong> ${reason}</p>
      <p>Mund ta editosh dhe ta ridërgosh për aprovim.</p>
    `,
  });
}

export async function sendDonationReceivedEmail(
  to: string,
  campaignTitle: string,
  amount: number,
  donorName: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `💙 Donacion i ri — €${amount} për ${campaignTitle}`,
    html: `
      <h2>Ke marrë një donacion!</h2>
      <p><strong>${donorName}</strong> ka dhuruar <strong>€${amount}</strong> për kampanjën <strong>${campaignTitle}</strong>.</p>
    `,
  });
}

export async function sendCampaignCompletedEmail(to: string, campaignTitle: string, totalAmount: number) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `🎉 Kampanja u kompletua — ${campaignTitle}`,
    html: `
      <h2>Kampanja jote u kompletua me sukses!</h2>
      <p>Kampanja <strong>${campaignTitle}</strong> ka mbledhur gjithsej <strong>€${totalAmount}</strong>.</p>
      <p>Faleminderit për besimin tek Unify!</p>
    `,
  });
}

export async function sendNewMessageEmail(to: string, senderName: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `💬 Mesazh i ri nga ${senderName}`,
    html: `
      <h2>Ke një mesazh të ri</h2>
      <p><strong>${senderName}</strong> të ka dërguar një mesazh.</p>
      <p><a href="${process.env.FRONTEND_URL}/dashboard/inbox">Hap Inbox</a></p>
    `,
  });
}

export async function sendApplicationStatusEmail(
  to: string,
  assetTitle: string,
  status: "ACCEPTED" | "REJECTED"
) {
  const accepted = status === "ACCEPTED";
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: accepted
      ? `✅ Aplikimi yt u pranua — ${assetTitle}`
      : `❌ Aplikimi yt u refuzua — ${assetTitle}`,
    html: accepted
      ? `<h2>Aplikimi yt u pranua!</h2><p>Ke fituar <strong>${assetTitle}</strong>. Do të kontaktohesh së shpejti.</p>`
      : `<h2>Aplikimi yt nuk u pranua</h2><p>Fatkeqësisht aplikimi yt për <strong>${assetTitle}</strong> nuk u pranua këtë herë.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, name: string, resetUrl: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "🔑 Rivendos fjalëkalimin tënd — Unify",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #faf7f2;">
        <div style="background: white; border-radius: 16px; padding: 32px;">
          <h1 style="color: #1d4ed8; margin: 0 0 16px;">Përshëndetje ${name}!</h1>
          <p style="color: #1a1a1a; line-height: 1.6;">
            Mori një kërkesë për të rivendosur fjalëkalimin e llogarisë tënde Unify.
          </p>
          <p style="color: #1a1a1a; line-height: 1.6;">
            Kliko butonin më poshtë për të vendosur një fjalëkalim të ri:
          </p>
          <a href="${resetUrl}" style="display: inline-block; background: #1d4ed8; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; margin: 16px 0;">
            Rivendos Fjalëkalimin
          </a>
          <p style="color: #6b7280; font-size: 14px;">
            Ky link skadon pas <strong>15 minutash</strong>. Nëse nuk e ke kërkuar ti këtë, injoroje këtë email — fjalëkalimi nuk do ndryshojë.
          </p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 32px;">
            Nëse butoni nuk funksionon, kopjo dhe ngjit këtë URL në shfletues:<br/>
            <span style="word-break: break-all; color: #1d4ed8;">${resetUrl}</span>
          </p>
        </div>
        <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 16px;">
          © ${new Date().getFullYear()} Unify · Platforma e parë crowdfunding shqiptare
        </p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(to: string, name: string, username: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `🎉 Mirë se erdhe në Unify, ${name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #1d4ed8;">Mirë se erdhe në Unify, ${name}!</h1>
        <p>Llogaria jote @${username} u krijua me sukses.</p>
        <p>Tani mund të:</p>
        <ul>
          <li>📢 Krijosh kampanja donacionesh</li>
          <li>🤝 Postosh shpallje vullnetare</li>
          <li>💬 Shkruash drejtpërdrejt me të tjerët me @username</li>
          <li>🌟 Bashkohesh me grupe</li>
        </ul>
        <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard" style="display: inline-block; background: #1d4ed8; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold;">Hap Dashboardin</a>
      </div>
    `,
  });
}

export async function sendBroadcastEmail(to: string[], subject: string, html: string) {
  // Resend pranon array deri 50 marrës per kërkesë
  const chunks: string[][] = [];
  for (let i = 0; i < to.length; i += 50) {
    chunks.push(to.slice(i, i + 50));
  }
  const results = [] as Array<Awaited<ReturnType<typeof resend.emails.send>>>;
  for (const chunk of chunks) {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: chunk,
      subject,
      html,
    });
    results.push(result);
  }
  return results;
}

export async function sendContactFormEmail(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: "elonberisha1999@gmail.com",
    subject: `📬 Kontakt: ${subject}`,
    html: `
      <h2>Mesazh nga Forma e Kontaktit</h2>
      <p><strong>Emri:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subjekti:</strong> ${subject}</p>
      <p><strong>Mesazhi:</strong></p>
      <p>${message}</p>
    `,
  });
}
