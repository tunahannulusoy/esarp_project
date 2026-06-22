export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-stone-900">Gizlilik Politikası</h1>

      <div className="mt-6 space-y-6 text-sm leading-6 text-stone-600">
        <section>
          <h2 className="font-medium text-stone-900">Topladığımız Veriler</h2>
          <p className="mt-1">
            Sipariş oluşturabilmeniz için ad, soyad, email, telefon ve teslimat adresi gibi kişisel
            verilerinizi topluyoruz. Kredi kartı veya banka bilgileriniz sistemimizde saklanmaz.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-stone-900">Verilerin Kullanımı</h2>
          <p className="mt-1">
            Verileriniz yalnızca sipariş süreçlerinin yürütülmesi, müşteri desteği ve yasal
            yükümlülüklerin yerine getirilmesi amacıyla kullanılır.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-stone-900">KVKK Kapsamındaki Haklarınız</h2>
          <p className="mt-1">
            Verilerinizin silinmesini, düzeltilmesini veya tarafınıza aktarılmasını talep etme
            hakkınız bulunmaktadır. Bu talepler hesap ayarlarınızdan veya bizimle iletişime geçerek
            iletilebilir.
          </p>
        </section>

        <section>
          <h2 className="font-medium text-stone-900">Veri Güvenliği</h2>
          <p className="mt-1">
            Tüm veri iletimleri SSL/TLS ile şifrelenir; şifreleriniz bcrypt algoritmasıyla
            saklanır.
          </p>
        </section>
      </div>
    </div>
  );
}
