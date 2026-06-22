import { NextResponse, type NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

function imzaDogrula(payload: string, headers: Headers, sir: string): boolean {
  const svixId = headers.get("svix-id");
  const svixTimestamp = headers.get("svix-timestamp");
  const svixSignature = headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) return false;

  const imzalananIcerik = `${svixId}.${svixTimestamp}.${payload}`;
  const gizliAnahtar = Buffer.from(sir.split("_").pop() ?? sir, "base64");
  const beklenenImza = createHmac("sha256", gizliAnahtar).update(imzalananIcerik).digest("base64");

  return svixSignature
    .split(" ")
    .some((parca) => {
      const [, deger] = parca.split(",");
      if (!deger) return false;
      try {
        return timingSafeEqual(Buffer.from(deger), Buffer.from(beklenenImza));
      } catch {
        return false;
      }
    });
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const sir = process.env.RESEND_WEBHOOK_SECRET;

  if (sir) {
    const gecerli = imzaDogrula(payload, request.headers, sir);
    if (!gecerli) {
      return NextResponse.json({ error: "Geçersiz imza" }, { status: 401 });
    }
  }

  const olay = JSON.parse(payload);

  switch (olay.type) {
    case "email.delivered":
    case "email.bounced":
    case "email.complained":
      console.log(`Resend webhook: ${olay.type}`, olay.data?.email_id);
      break;
    default:
      console.log("Resend webhook: bilinmeyen olay", olay.type);
  }

  return NextResponse.json({ received: true });
}
