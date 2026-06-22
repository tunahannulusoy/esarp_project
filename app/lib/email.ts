import { Resend } from "resend";

const GONDEREN_EMAIL = process.env.NEXT_PUBLIC_RESEND_EMAIL ?? "orders@esarp.com";

function resendYapilandirilmisMi() {
  return Boolean(process.env.RESEND_API_KEY);
}

function resendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

async function emailGonder(to: string, subject: string, html: string) {
  if (!resendYapilandirilmisMi()) {
    return { gonderildi: false, sebep: "RESEND_API_KEY tanımlı değil" };
  }

  try {
    await resendClient().emails.send({ from: GONDEREN_EMAIL, to, subject, html });
    return { gonderildi: true };
  } catch (error) {
    console.error("Email gönderim hatası:", error);
    return { gonderildi: false, sebep: error instanceof Error ? error.message : "Bilinmeyen hata" };
  }
}

export async function hosGeldinEmailiGonder(email: string, ad: string) {
  const html = `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>Hoş Geldiniz! 🎉</h1>
      <p>Merhaba ${ad},</p>
      <p>Eşarp ailesine hoş geldiniz. Artık güzel eşarpları keşfedebilirsiniz.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL ?? ""}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Alışverişe Başla
      </a>
      <p>Sorularınız için: support@esarp.com</p>
    </body>
    </html>
  `;
  return emailGonder(email, "Eşarp'a Hoş Geldiniz!", html);
}

export async function dogrulamaKoduEmailiGonder(email: string, kod: string) {
  const html = `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Email Doğrulama Kodu</h2>
      <p>Doğrulama kodunuz:</p>
      <h1 style="letter-spacing: 5px; color: #3b82f6;">${kod}</h1>
      <p>Bu kod 10 dakika geçerlidir.</p>
    </body>
    </html>
  `;
  return emailGonder(email, "Eşarp Doğrulama Kodunuz", html);
}

export async function sifreSifirlamaEmailiGonder(email: string, link: string) {
  const html = `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Şifre Sıfırlama</h2>
      <p>Şifrenizi sıfırlamak için aşağıdaki linke tıklayın. Link 24 saat geçerlidir.</p>
      <a href="${link}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Şifremi Sıfırla
      </a>
    </body>
    </html>
  `;
  return emailGonder(email, "Eşarp Şifre Sıfırlama", html);
}

type SiparisOzeti = {
  siparisNo: string;
  toplamTutar: number;
  urunler: { ad: string; adet: number; fiyat: number }[];
  adres: string;
  trackingLink: string;
};

export async function siparisOnayEmailiGonder(email: string, siparis: SiparisOzeti) {
  const urunSatirlari = siparis.urunler
    .map((u) => `<li>${u.ad} x ${u.adet} - ₺${u.fiyat.toFixed(2)}</li>`)
    .join("");

  const html = `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Siparişiniz Alındı ✅</h2>
      <p>Sipariş No: <strong>#${siparis.siparisNo}</strong></p>
      <p>Toplam: <strong>₺${siparis.toplamTutar.toFixed(2)}</strong></p>
      <h3>Ürünler:</h3>
      <ul>${urunSatirlari}</ul>
      <p><strong>Teslimat Adresi:</strong></p>
      <p>${siparis.adres}</p>
      <a href="${siparis.trackingLink}">Siparişi Takip Et</a>
    </body>
    </html>
  `;
  return emailGonder(email, `Sipariş Onayı #${siparis.siparisNo}`, html);
}

export async function siparisDurumEmailiGonder(
  email: string,
  siparisNo: string,
  yeniDurum: string,
  detay?: { kargoSirketi?: string; trackingNo?: string }
) {
  const kargoBilgisi =
    yeniDurum === "Gönderildi" && detay
      ? `<p>Kargo: ${detay.kargoSirketi ?? "-"}</p><p>Tracking: ${detay.trackingNo ?? "-"}</p>`
      : "";

  const html = `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Sipariş Durumu Güncellendi</h2>
      <p>Sipariş #${siparisNo}</p>
      <p><strong>Yeni Durum: ${yeniDurum}</strong></p>
      ${kargoBilgisi}
    </body>
    </html>
  `;
  return emailGonder(email, `Sipariş #${siparisNo} Durumu Güncellendi`, html);
}

export async function odemeBeklemeEmailiGonder(email: string, siparisNo: string, toplamTutar: number) {
  const html = `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Ödeme Bekleniyor</h2>
      <p>Sipariş #${siparisNo} için ödemenizi tamamladığınızda siparişiniz hazırlanmaya başlanacaktır.</p>
      <p>Toplam Tutar: <strong>₺${toplamTutar.toFixed(2)}</strong></p>
      <p>Havale/EFT bilgileri WhatsApp üzerinden tarafınıza iletilmiştir.</p>
    </body>
    </html>
  `;
  return emailGonder(email, `Ödeme Bekleniyor — Sipariş #${siparisNo}`, html);
}

export async function teslimatEmailiGonder(email: string, siparisNo: string) {
  const html = `
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Siparişiniz Teslim Edildi 📦</h2>
      <p>Sipariş #${siparisNo} başarıyla teslim edilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz!</p>
    </body>
    </html>
  `;
  return emailGonder(email, `Sipariş #${siparisNo} Teslim Edildi`, html);
}
