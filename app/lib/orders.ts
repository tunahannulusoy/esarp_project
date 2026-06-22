import type { Siparis } from "@/app/types";

const WHATSAPP_NUMARASI = "905555555555";
const ISLETME_ADI = "Eşarp";

export function whatsappLinkiOlustur(siparis: Siparis): string {
  const mesaj = `Merhaba! ✨

Sipariş kaydınız oluşturulmuştur. 🎉
Sipariş No: #${siparis.siparis_no}
Toplam Tutar: ₺${siparis.toplam_tutar.toFixed(2)}

Havale/Banka Transferi işlemleriniz tamamlandıktan sonra
siparişiniz hazırlanmaya başlanacak ve tarafınıza bildirim yapılacaktır.

Sipariş detaylarını profilinizden takip edebilirsiniz.
Sorularınız için bize yazabilirsiniz. 📞

---
${ISLETME_ADI}`;

  return `https://wa.me/${WHATSAPP_NUMARASI}?text=${encodeURIComponent(mesaj)}`;
}
