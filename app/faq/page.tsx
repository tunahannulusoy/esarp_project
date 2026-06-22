const SORULAR = [
  {
    soru: "Siparişim ne zaman teslim edilir?",
    cevap: "Teslimat süresi, adresinize göre değişmekle birlikte genellikle 2-5 iş günü içinde gerçekleşir.",
  },
  {
    soru: "Hangi ödeme yöntemlerini kullanabilirim?",
    cevap: "Şu an için yalnızca banka transferi/havale ile ödeme kabul ediyoruz. Sipariş sonrası havale bilgileri WhatsApp üzerinden iletilir.",
  },
  {
    soru: "Ürün iade edebilir miyim?",
    cevap: "Ürünlerinizi teslim aldıktan sonra 14 gün içinde, kullanılmamış ve etiketleri çıkarılmamış olması koşuluyla iade edebilirsiniz.",
  },
  {
    soru: "Siparişimi nasıl takip edebilirim?",
    cevap: "Profilinizdeki 'Siparişlerim' sayfasından veya sipariş onayı sonrası gönderilen WhatsApp linkinden takip edebilirsiniz.",
  },
  {
    soru: "Üye olmadan sipariş verebilir miyim?",
    cevap: "Ürünleri üye olmadan sepete ekleyebilirsiniz, ancak siparişi tamamlamak için giriş yapmanız gerekir.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-stone-900">Sıkça Sorulan Sorular</h1>

      <div className="mt-6 divide-y divide-stone-200">
        {SORULAR.map((s) => (
          <details key={s.soru} className="group py-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-stone-900">
              {s.soru}
            </summary>
            <p className="mt-2 text-sm leading-6 text-stone-600">{s.cevap}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
