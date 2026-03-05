import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

interface SendQuoteRequest {
  quote: {
    number: string;
    lineItems: LineItem[];
    subtotal: number;
    tax: number;
    taxRate: number;
    total: number;
  };
  recipient: {
    name: string;
    email: string;
    phone: string;
    company: string;
    address?: string;
    city?: string;
  };
  sender: {
    name: string;
    email: string;
  };
  sendMethod: "email" | "sms" | "link";
  options: {
    enableSignature: boolean;
    autoReminder: boolean;
    notifyOnOpen: boolean;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatSEK(amount: number): string {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(amount);
}

function quoteUrl(quoteNumber: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "https://app.offert-pro.com";
  return `${base}/q/${quoteNumber}`;
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const body: SendQuoteRequest = await req.json();
    const { sendMethod } = body;

    if (sendMethod === "email") {
      return await handleEmail(body);
    }
    if (sendMethod === "sms") {
      return await handleSms(body);
    }
    if (sendMethod === "link") {
      return NextResponse.json({
        success: true,
        link: quoteUrl(body.quote.number),
      });
    }

    return NextResponse.json(
      { error: "Ogiltig leveransmetod" },
      { status: 400 }
    );
  } catch (err) {
    console.error("[quotes/send]", err);
    return NextResponse.json(
      { error: "Något gick fel. Försök igen." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Email — Resend REST API (no npm package needed)
// Docs: https://resend.com/docs/api-reference/emails/send-email
// Env:  RESEND_API_KEY, RESEND_FROM_EMAIL
// ---------------------------------------------------------------------------

async function handleEmail(data: SendQuoteRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "E-posttjänsten är inte konfigurerad. Lägg till RESEND_API_KEY i .env.local.",
        setup: true,
      },
      { status: 503 }
    );
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "noreply@offert-pro.com";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${data.sender.name} via Offert-pro <${fromEmail}>`,
      to: [data.recipient.email],
      subject: `Offert ${data.quote.number} från ${data.sender.name}`,
      html: buildEmailHtml(data),
      // Optional: reply-to sender's real email
      reply_to: data.sender.email,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[Resend error]", text);
    return NextResponse.json(
      { error: "Kunde inte skicka e-post. Kontrollera RESEND_API_KEY." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, message: "E-post skickad!" });
}

// ---------------------------------------------------------------------------
// SMS — Twilio REST API (no npm package needed)
// Docs: https://www.twilio.com/docs/sms/api
// Env:  TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
// ---------------------------------------------------------------------------

async function handleSms(data: SendQuoteRequest) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return NextResponse.json(
      {
        error:
          "SMS-tjänsten är inte konfigurerad. Lägg till TWILIO_* i .env.local.",
        setup: true,
      },
      { status: 503 }
    );
  }

  if (!data.recipient.phone) {
    return NextResponse.json(
      { error: "Inget telefonnummer angivet för mottagaren." },
      { status: 400 }
    );
  }

  const link = quoteUrl(data.quote.number);
  const message =
    `Hej ${data.recipient.name}! ` +
    `${data.sender.name} har skickat dig en offert på ${formatSEK(data.quote.total)}. ` +
    `Öppna offerten här: ${link}`;

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString(
    "base64"
  );

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: data.recipient.phone,
        From: fromNumber,
        Body: message,
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("[Twilio error]", text);
    return NextResponse.json(
      { error: "Kunde inte skicka SMS. Kontrollera TWILIO_*-variablerna." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, message: "SMS skickat!" });
}

// ---------------------------------------------------------------------------
// HTML email template
// Mobile-responsive, renders in Gmail, Outlook, Apple Mail
// ---------------------------------------------------------------------------

function buildEmailHtml(data: SendQuoteRequest): string {
  const { quote, recipient, sender } = data;
  const link = quoteUrl(quote.number);

  const lineItemRows = quote.lineItems
    .filter((item) => item.description || item.unitPrice > 0)
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #F1F5F9;font-size:14px;color:#334155;">${item.description || "—"}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #F1F5F9;font-size:14px;color:#64748B;text-align:center;">${item.qty}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #F1F5F9;font-size:14px;color:#64748B;text-align:right;">${formatSEK(item.unitPrice)}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #F1F5F9;font-size:14px;font-weight:600;color:#0F172A;text-align:right;">${formatSEK(item.qty * item.unitPrice)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Offert ${quote.number}</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

          <!-- Logo header -->
          <tr>
            <td style="padding-bottom:24px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#4F46E5;border-radius:10px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:18px;font-weight:700;line-height:36px;">✓</span>
                  </td>
                  <td style="padding-left:10px;font-size:18px;font-weight:700;color:#0F172A;">Offert-pro</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:#fff;border-radius:16px;border:1px solid #E2E8F0;overflow:hidden;">

              <!-- Card header -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#EEF2FF 0%,#F0FDF4 100%);padding:32px;border-bottom:1px solid #E2E8F0;">
                    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#6366F1;text-transform:uppercase;letter-spacing:0.05em;">Ny offert</p>
                    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#0F172A;">${quote.number}</h1>
                    <p style="margin:0;font-size:15px;color:#475569;">
                      ${sender.name} har skickat dig en offert
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:32px;">

                    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
                      Hej ${recipient.name},
                    </p>
                    <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.6;">
                      Du har fått en offert från <strong>${sender.name}</strong>
                      ${recipient.company ? `på uppdrag av <strong>${recipient.company}</strong>` : ""}.
                      Se detaljer nedan och klicka på knappen för att öppna den interaktiva offerten.
                    </p>

                    <!-- Line items table -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E2E8F0;border-radius:10px;overflow:hidden;margin-bottom:20px;">
                      <thead>
                        <tr style="background:#F8FAFC;">
                          <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em;">Beskrivning</th>
                          <th style="padding:10px 16px;text-align:center;font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em;">Ant.</th>
                          <th style="padding:10px 16px;text-align:right;font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em;">Styckpris</th>
                          <th style="padding:10px 16px;text-align:right;font-size:11px;font-weight:600;color:#94A3B8;text-transform:uppercase;letter-spacing:0.05em;">Totalt</th>
                        </tr>
                      </thead>
                      <tbody>${lineItemRows}</tbody>
                    </table>

                    <!-- Totals -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                      <tr>
                        <td width="60%"></td>
                        <td>
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding:6px 0;font-size:13px;color:#64748B;">Delsumma</td>
                              <td style="padding:6px 0;font-size:13px;color:#334155;text-align:right;">${formatSEK(quote.subtotal)}</td>
                            </tr>
                            <tr>
                              <td style="padding:6px 0;font-size:13px;color:#64748B;">Moms (${quote.taxRate}%)</td>
                              <td style="padding:6px 0;font-size:13px;color:#334155;text-align:right;">${formatSEK(quote.tax)}</td>
                            </tr>
                            <tr>
                              <td style="padding:10px 0 0;font-size:16px;font-weight:700;color:#0F172A;border-top:2px solid #E2E8F0;">Att betala</td>
                              <td style="padding:10px 0 0;font-size:16px;font-weight:700;color:#4F46E5;text-align:right;border-top:2px solid #E2E8F0;">${formatSEK(quote.total)}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center">
                          <a href="${link}"
                             style="display:inline-block;background:#4F46E5;color:#fff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:12px;letter-spacing:0.01em;">
                            Öppna offerten
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:24px 0 0;font-size:12px;color:#94A3B8;text-align:center;">
                      Eller kopiera länken: <a href="${link}" style="color:#6366F1;">${link}</a>
                    </p>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;font-size:12px;color:#94A3B8;line-height:1.6;">
              Den här offerten är giltig i 30 dagar.<br/>
              Skickad via <a href="https://offert-pro.com" style="color:#6366F1;text-decoration:none;">Offert-pro</a>
              &nbsp;·&nbsp;
              <a href="${link}" style="color:#6366F1;text-decoration:none;">Avböj offerten</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
