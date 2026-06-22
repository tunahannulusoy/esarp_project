export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-stone-900">Kullanım Şartları</h1>

      <div className="mt-6 space-y-6 text-sm leading-6 text-stone-600">
        <section>
          <h2 className="font-medium text-stone-900">Sipariş ve Ödeme</h2>
          <p className="mt-1">
            Siparişler, banka transferi/havale ile ödemenin onaylanmasının ardından hazırlanmaya
            başlanır. Ödeme bilgileri sipariş sonrası WhatsApp üzerinden iletilir.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-stone-900">İade ve Değişim</h2>
          <p className="mt-1">
            Ürünler, teslim alındıktan sonra 14 gün içinde kullanılmamış ve orijinal ambalajında
            olması koşuluyla iade edilebilir.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-stone-900">Hesap Sorumluluğu</h2>
          <p className="mt-1">
            Hesap bilgilerinizin güvenliğinden siz sorumlusunuz. Şüpheli bir durum fark ederseniz
            bizimle iletişime geçin.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-stone-900">Fikri Mülkiyet</h2>
          <p className="mt-1">
            Sitedeki tüm görsel ve metin içerikler Eşarp&apos;a aittir ve izinsiz kullanılamaz.
          </p>
        </section>
      </div>
    </div>
  );
}
