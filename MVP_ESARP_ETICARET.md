# Eşarp E-Ticaret Platform - MVP Dokümantasyonu

## 📋 Proje Özeti
Eşarp ve aksesuarları satışı yapan, modern arayüzü ve kolay kullanımı olan bir e-ticaret platformu.

**MVP Hedefi**: Temel ürün listeleme, sepet yönetimi ve sipariş oluşturma işlevlerinin hayata geçirilmesi

---

## 🎨 FRONTEND

### 0. **İkonografi**
- Arayüzdeki tüm ikonlar (sepet, favori, arama, menü, filtre, sosyal medya vb.) **emoji veya dolu (filled) ikonlar yerine** **Lucide React** (`lucide-react`) ikon setinden, minimal ve ince çizgili (outline, `strokeWidth: 1.5`) ikonlarla uygulanır.
- Lucide React'ta marka logosu (Facebook, Instagram, WhatsApp vb.) bulunmadığından, WhatsApp için anlamca en yakın `MessageCircle` ikonu kullanılır; Facebook/Instagram için Lucide'ın çizgi stiliyle birebir uyumlu (24x24 viewBox, `strokeWidth: 1.5`) özel SVG bileşenleri (`app/components/social-icons.tsx`) tercih edilir.
- Bu tercih, modern e-ticaret sitelerindeki sade ve tutarlı görsel dile uyum sağlamak içindir.

### 1. **Ana Sayfa (Landing Page)**
- **Yapı**: Hero section **YOK** → Direkt ürün listeleme
- **Görüntüleme**: 12-16 ürün (grid layout, responsive design)
- **Her Ürün Kartında**:
  - Ürün görseli (ana görsel)
  - Ürün adı
  - Orijinal fiyat + İndirimli fiyat (görsel olarak fark belirtilecek)
  - Beğeni butonu (Like/Unlike)
  - Sepete Ekle/Çıkar butonu (durum göstergesi ile)
  - Detay sayfasına yönlendir

### 2. **Ürün Detay Sayfası**
- Ürün görselleri (4 adet, büyük görünüm + thumbnail)
- Ürün adı, açıklama
- Fiyat bilgisi (orijinal + indirim)
- Renk seçimi (dropdown/radio buttons)
- Boyut seçimi (dropdown/radio buttons)
- Stok durumu göstergesi
- Beğeni butonu
- Sepete ekle butonu
- Ürün özellikleri (malzeme, ölçüler vb.)
- İlgili ürünler (Recommendations)

### 3. **Filtreleme & Sıralama Paneli**
**Filtreleme Seçenekleri:**
- 📊 Fiyat Aralığı (min-max slider)
- 🎨 Renk (checkbox list)
- 📦 Kategori (checkbox list)
- 📏 Boyut (checkbox list)
- ⭐ Puan (sadece MVP'de optional)

**Sıralama Seçenekleri:**
- Fiyat: Düşükten Yükseğe
- Fiyat: Yüksekten Düşüğe
- En Çok Satanlar
- En Yeni Ürünler
- En Yüksek Puan

### 4. **Sepet Sayfası**
**Sepet Listeleme:**
- Her ürün için: görsel, ad, fiyat, renk, boyut
- Adet artırma/azaltma kontrolleri
- Ara toplam (ürün × adet × fiyat)
- Kaldır butonu

**Sepet Özeti:**
- Ürünler toplamı
- Kargo ücreti (dinamik, adrese göre hesaplanacak)
- **Toplam Tutar**

**İşlemler:**
- "Sipariş Oluştur" → Adres bilgileri ekranına geçiş
- "Alışverişe Devam Et" → Ana sayfaya dön

### 5. **Adres & Teslimat Bilgileri**
**Adres Seçimi/Ekleme:**
- Kaydedilmiş adresler listesi (dropdown)
- "Yeni Adres Ekle" butonu (modal/form)

**Yeni Adres Formu:**
- İl (dropdown)
- İlçe (dropdown, il seçimine göre dinamik)
- Mahalle
- Açık adres
- Adres başlığı (Ev, İş vs.)

**Kargo Bilgileri:**
- Seçilen adrese göre kargo ücreti gösterimi
- Tahmini teslimat süresi
- Kargo şirketi bilgisi (varsa)

**Onaylama:**
- Tüm bilgileri gözden geçir
- Ödeme metodunu seç (MVP'de sadece transfer/EFT)
- Siparişi onayla

### 6. **Sipariş Onayı & Bildirim**
**Sipariş Başarı Ekranı:**
- Sipariş numarası
- Sipariş özeti
- Teslimat adresi
- Tahmini teslimat tarihi
- Takip linki

**WhatsApp Bildirimi (Otomatik):**
```
Merhaba! ✨

Sipariş kaydınız oluşturulmuştur. 🎉
Sipariş No: #12345
Toplam Tutar: ₺299.99

Havale/Banka Transferi işlemleriniz tamamlandıktan sonra 
siparişiniz hazırlanmaya başlanacak ve tarafınıza bildirim yapılacaktır.

Sipariş detaylarını profilinizden takip edebilirsiniz.
Sorularınız için bize yazabilirsiniz. 📞

---
[İşletme Adı]
```

### 7. **Profil & Hesap Yönetimi**

#### **Profil Sayfası**
- Hesap bilgileri (Ad, Soyad, E-mail, Telefon)
- "Düzenle" butonu

#### **Adres Yönetimi**
- Kaydedilmiş adresler listesi
- Her adres için: düzenle, sil, varsayılan yap seçenekleri
- "Yeni Adres Ekle" butonu

#### **Sipariş Geçmişi**
- Geçmiş siparişler listesi (tarih sırasına göre)
- Her sipariş için:
  - Sipariş numarası
  - Tarih
  - Toplam tutar
  - Durum (Beklemede, Hazırlanıyor, Gönderildi, Teslim Edildi)
  - "Detayları Gör" / "Tekrar Sipariş Ver" butonları
  - İzleme linki (WhatsApp tracking)

#### **Beğendiklerim (Favorites)**
- Favoriye eklenen ürünlerin listesi
- Grid/list view seçeneği
- Favoriden kaldır seçeneği
- "Hepsini Sepete Ekle" toplu işlem

#### **Hesap Ayarları**
- E-mail değiştir
- Şifre değiştir
- Bildirim tercihleri
- "Hesabı Sil" (veri silme onayı ile)
- Çıkış yap (Sign Out)

### 8. **Header (Başlık)**
- 🏠 Logo (ana sayfaya yönlendir)
- 🔍 Arama barı (ürün adı, kategori ile arama)
- 👤 Profil ikonu → Profil sayfasına / Sign In modal açılır
- ❤️ Beğendiklerim (Favorites sayısı)
- 🛒 Sepet ikonu (sepet sayısı badge ile)
- ☰ Mobil menü (responsive)

**Sign In Durumuna Göre:**
- **Giriş Yapılmamış**: "Giriş Yap" / "Kayıt Ol" linkleri
- **Giriş Yapılmış**: Profil dropdown menüsü (Profilim, Siparişlerim, Adreslerim, Çıkış Yap)

### 9. **Footer**
- **Şirket Bilgileri**
  - Marka adı, kısa açıklama

- **Hızlı Linkler**
  - Hakkımızda
  - İletişim
  - SSS
  - Gizlilik Politikası
  - Kullanım Şartları

- **İletişim Bilgileri**
  - Email
  - Telefon
  - Adres

- **Sosyal Medya**
  - 📱 WhatsApp ikonu (WhatsApp Business linkine yönlendir)
  - 📘 Facebook ikonu
  - 📷 Instagram ikonu

---

## 🔐 **Kimlik Doğrulama (Authentication)**

---

### **ADMIN AUTHENTICATION**

#### **Admin Rol Sistemi (Users Tablosunda)**

**Users Tablosunda Role Column:**
```sql
-- Users tablosu
id      | email              | role    | ...
--------|------------------|---------|-------
uuid1   | admin@esarp.com    | admin   |
uuid2   | yonetici@gmail.com | admin   |
uuid3   | ali@example.com    | user    |
uuid4   | ayse@example.com   | user    |
```

**İlk Admin Oluşturma:**

**`supabase/seed.sql`:**
```sql
-- Seed data: İlk admin user oluştur
INSERT INTO users (
  id,
  email,
  sifre_hash,
  ad,
  soyad,
  role,
  email_dogrulanmis,
  kayit_tarihi
) VALUES (
  gen_random_uuid(),
  'admin@esarp.com',
  crypt('AdminPassword123!', gen_salt('bf')),
  'Admin',
  'Esarp',
  'admin', -- ← ADMIN ROLE
  true,
  NOW()
);
```

**Terminal'de Çalıştır (1 Kez):**
```bash
supabase db push
supabase seed run
```

**Sonuç:**
- Email: `admin@esarp.com`
- Password: `AdminPassword123!`
- Role: `admin`

---

#### **Admin Login Akışı**

**`app/admin/login/page.tsx`:**

```typescript
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Supabase Auth ile giriş yap
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      // 2. Users tablosundan role kontrol et (ÇOK BASIT!)
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userError || user?.role !== 'admin') {
        // Admin değil, logout yap
        await supabase.auth.signOut();
        throw new Error('Bu hesap admin erişimine sahip değil');
      }

      // 3. Başarılı - Dashboard'a yönlendir
      router.push('/admin');
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Eşarp Admin</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="admin@esarp.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Giriş yapılıyor...' : 'Admin Paneline Giriş Yap'}
          </button>
        </form>

        <p className="text-gray-600 text-sm mt-4 text-center">
          Test: admin@esarp.com / AdminPassword123!
        </p>
      </div>
    </div>
  );
}
```

---

#### **Middleware Koruma (Basitleştirilmiş)**

**`middleware.ts`:** (Project root'ta)

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Session kontrol et
  const { data: { session } } = await supabase.auth.getSession();

  // /admin routes koruması
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Giriş yapılmamış → Login sayfasına yönlendir
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Admin olup olmadığını kontrol et (Users tablosundan)
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Admin değil → Anasayfaya yönlendir
    if (error || user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return res;
}

// Hangi rotaların korunacağını belirt
export const config = {
  matcher: ['/admin/:path*']
};
```

---

#### **Admin Layout'ta Çıkış Butonu**

**`app/admin/layout.tsx` (Güncellenmiş):**

```typescript
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Eşarp</h1>
          <p className="text-sm text-gray-600">Admin Paneli</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6">
          <Link 
            href="/admin" 
            className="block px-6 py-3 hover:bg-gray-100 border-l-4 border-transparent hover:border-blue-600"
          >
            📊 Dashboard
          </Link>
          <Link 
            href="/admin/products" 
            className="block px-6 py-3 hover:bg-gray-100 border-l-4 border-transparent hover:border-blue-600"
          >
            📦 Ürünler
          </Link>
          <Link 
            href="/admin/orders" 
            className="block px-6 py-3 hover:bg-gray-100 border-l-4 border-transparent hover:border-blue-600"
          >
            🛒 Siparişler
          </Link>
          <Link 
            href="/admin/categories" 
            className="block px-6 py-3 hover:bg-gray-100 border-l-4 border-transparent hover:border-blue-600"
          >
            📂 Kategoriler
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Çıkılıyor...' : '🚪 Çıkış Yap'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
```

---

#### **Helper Functions (Basitleştirilmiş)**

**`app/lib/auth.ts`:**

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export async function validateAdminRole() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Giriş gerekli');
  }

  const supabase = createServerComponentClient({ cookies });
  
  // Users tablosundan role kontrol et (ÇOK BASIT!)
  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || userData?.role !== 'admin') {
    throw new Error('Admin erişimi yok');
  }

  return user;
}

export async function logout() {
  const supabase = createServerComponentClient({ cookies });
  await supabase.auth.signOut();
}
```

---

#### **Admin Login Akışı Özet**

```
1️⃣ Ziyaretçi /admin'e gidiyor
   ↓
2️⃣ Middleware: "Giriş yapmış mı?" kontrol et
   ↓
3️⃣ HAYIR → /admin/login'e yönlendir
   ↓
4️⃣ Admin login form:
   - Email gir: admin@esarp.com
   - Şifre gir: AdminPassword123!
   ↓
5️⃣ Supabase Auth ile doğrula
   ↓
6️⃣ Users tablosundan role kontrol et: role = 'admin' mi?
   ↓
7️⃣ EVET → /admin/dashboard'a yönlendir ✅
   HAYIR → Hata: "Admin değilsin" ❌
   ↓
8️⃣ Session kuruldu
   ↓
9️⃣ Dashboard'dan Çıkış Yap → Logout
```

---

#### **Users Tablosundaki Role Kontrol**

```sql
-- Örnek veri
SELECT id, email, role FROM users;

id                 | email              | role
-------------------|------------------|------
uuid1              | admin@esarp.com    | admin      ← ADMIN
uuid2              | boss@esarp.com     | admin      ← ADMIN
uuid3              | ali@example.com    | user       ← USER
uuid4              | ayse@example.com   | user       ← USER

-- Admin paneline giriş
Email: admin@esarp.com
Şifre: AdminPassword123!
   ↓
Supabase Auth: ✅ Doğru
   ↓
Users tablosundan kontrol: role = 'admin' → ✅ 
   ↓
Admin paneline erişim: ✅
```

---

#### **Yeni Admin Ekleme (İşletmeci Prosedürü)**

E�er başka bir admin eklemek istersen:

```sql
-- Option 1: Seed ile (setup sırasında)
INSERT INTO users (email, sifre_hash, role, ...)
VALUES ('yeni.admin@esarp.com', crypt('Şifre123!', gen_salt('bf')), 'admin', ...);

-- Option 2: Admin panelinden (Phase 2)
-- Admin panel → Settings → Admin Ekle
```

---

#### **Güvenlik Checklist**

| ✅ | **Güvenlik Önlemi** | **Detay** |
|----|------------------|---------|
| ✅ | HTTPS | Vercel otomatik |
| ✅ | Password Hash | bcrypt (Supabase) |
| ✅ | Session Token | JWT (Supabase) |
| ✅ | CSRF Protection | Next.js otomatik |
| ✅ | RLS Policies | Supabase database level |
| ✅ | Middleware Check | Her /admin request'te |
| ✅ | Role Check | users tablosundan role kontrol |
| ✅ | Logout | Session tamamen temizle |

---
### **Kayıt Ol (Sign Up) Akışı**
1. Email girişi
2. Email doğrulama:
   - Email'e doğrulama kodu gönder (4-6 hane, 10 dakika geçerli)
   - Kullanıcı kodu girir
   - Kod doğru ise devam et
3. Şifre belirleme:
   - En az 8 karakter
   - Büyük harf, küçük harf, rakam, özel karakter
   - Şifre tekrarı
4. Başarı mesajı + otomatik giriş / giriş sayfasına yönlendir

**Not**: Ad, Soyad ve Telefon numarası bilgileri sipariş oluşturma sırasında zorunlu olarak girilecektir.

### **Giriş Yap (Sign In) Akışı**
1. Email girişi
2. Şifre girişi
3. "Beni Hatırla" checkbox (opsiyonel)
4. "Şifremi Unuttum" linki
5. Giriş butonuna basınca direkt giriş (doğrulama yok)

### **Şifremi Unuttum**
1. Email girişi
2. Reset linki emaile gönderilir (24 saat geçerli)
3. Yeni şifre belirleme
4. Başarı ve otomatik giriş

### **Giriş Yapmadan Sepet Kullanımı**
- ✅ Ürünleri sepete ekleyebilir/çıkarabilir
- ✅ Ürünlerin adetini değiştirebilir
- ❌ Sipariş oluşturamaz
- "Siparişi Tamamla" butonuna bastığında → Sign In modal açılır

**Sepet Birleştirme (Session → User)**
- Kullanıcı giriş yapmadığında: Tarayıcı localStorage/session storage'da sepeti tutacak
- Kullanıcı giriş yaptığında: Eski sepet otomatik olarak user hesabındaki sepet ile birleştirilecek
- Çakışan ürünler: Adetler toplanacak (örnek: Eski sepette 2 adet, yeni sepette 1 adet = 3 adet)

---

## 💾 **DATABASE**

### **Veritabanı Türü**
- PostgreSQL (veya MongoDB - yapınıza göre)

### **Tablolar/Collections**

#### **1. URUNLER**
```
id (PK)
ad (string, required)
aciklama (text)
fiyat (decimal, required)
indirim_orani (integer, default: 0)
kategori_id (FK)
resim_linkler (json array)
  - [{
      "url": "https://storage.link/urun1_img1.jpg",
      "sira": 1
    }, ...]
boyutlar (json array)
  - ["XS", "S", "M", "L", "XL", "XXL"]
renkler (json array)
  - [{"ad": "Kırmızı", "hex": "#FF0000"}, ...]
stok (integer, default: 0)
olusturulma_tarihi (timestamp)
guncelleme_tarihi (timestamp)
aktif (boolean, default: true)
```

#### **2. KATEGORILER**
```
id (PK)
ad (string, required, unique)
aciklama (text)
resim_linki (string)
sira (integer)
aktif (boolean, default: true)
```

#### **3. KULLANICILAR (Users)**
```
id (PK, UUID) -- auth.users(id) ile eşleşir (FK, on delete cascade)
email (string, required, unique)
ad (string)
soyad (string)
telefon_numarasi (string)
role (enum: 'user', 'admin' | default: 'user')
email_dogrulanmis (boolean, default: false)
kayit_tarihi (timestamp)
son_giris_tarihi (timestamp)
aktif (boolean, default: true)
```

**Not**: `sifre_hash` kolonu kaldırıldı. Şifre doğrulaması Supabase Auth'a
(`auth.users.encrypted_password`) devredildi; `public.users` tablosu artık
sadece profil/rol bilgisi tutuyor. Yeni `auth.users` kaydı oluştuğunda
eşleşen `public.users` satırı bir trigger (`handle_new_user`) ile otomatik
açılır.

**Role Açıklaması:**
- `'user'` - Normal müşteri
- `'admin'` - Admin paneline erişim (ürün, sipariş yönetimi)

#### **4. ADRESLER**
```
id (PK)
kullanici_id (FK -> KULLANICILAR)
il (string, required)
ilce (string, required)
mahalle (string)
acik_adres (string, required)
adres_basligi (string, e.g., "Ev", "İş")
telefon (string)
varsayilan (boolean, default: false)
silinmis (boolean, default: false)
olusturulma_tarihi (timestamp)
```

#### **5. SIPARISLER**
```
id (PK)
siparis_no (string, unique)
kullanici_id (FK -> KULLANICILAR)
adres_id (FK -> ADRESLER)
urunler (json array)
  - [{
      "urun_id": 1,
      "adet": 2,
      "fiyat": 99.99,
      "secili_renk": "Kırmızı",
      "secili_boyut": "M"
    }, ...]
urunler_toplami (decimal)
kargo_ucreti (decimal)
toplam_tutar (decimal)
durum (enum: "Ödeme Bekleme", "Hazırlanıyor", "Gönderildi", "Teslim Edildi", "İptal Edildi")
ödeme_metodu (enum: "Banka Transferi/Havale", "Kapıda Ödeme")
ödeme_durumu (enum: "Beklemede", "Ödendi", "İptal")
olusturulma_tarihi (timestamp)
odeme_tarihi (timestamp)
tahmini_teslimat_tarihi (date)
guncelleme_tarihi (timestamp)
whatsapp_mesaj_gonderildi (boolean, default: false)
tracking_no (string, opsiyonel)
```

#### **6. FAVORILER**
```
id (PK)
kullanici_id (FK -> KULLANICILAR)
urun_id (FK -> URUNLER)
olusturulma_tarihi (timestamp)
unique(kullanici_id, urun_id)
```

#### **7. SEPET** (opsiyonel - session bazlı yapılabilir)
```
id (PK)
kullanici_id (FK -> KULLANICILAR)
urunler (json array)
  - [{
      "urun_id": 1,
      "adet": 2,
      "secili_renk": "Kırmızı",
      "secili_boyut": "M"
    }, ...]
guncelleme_tarihi (timestamp)
```

#### **8. EMAIL_DOGRULAMA_KODLARI**
```
id (PK)
email (string)
kod (string)
olusturulma_tarihi (timestamp)
sona_erme_tarihi (timestamp)
kullanilmis (boolean, default: false)
```

---

## 📦 **STORAGE (Dosya Depolama)**

### **Yapısı**
```
/urunler/
  /urun_1/
    urun_1_resim_1.jpg
    urun_1_resim_2.jpg
    urun_1_resim_3.jpg
    urun_1_resim_4.jpg
  /urun_2/
    urun_2_resim_1.jpg
    ...
  /urun_N/
    ...
```

### **Depolama Seçeneği**
- **Supabase Storage** (PostgreSQL ile entegre, S3 uyumlu, CDN hızlı dağıtım)

### **Image Optimization**
- Ürün görselleri: JPEG (kalite: 80-85)
- Thumbnail: 300x300px
- Büyük görünüm: 800x800px
- Profil resmi: 150x150px
- Lazy loading kullan

---

## ⚙️ **BACKEND API**

### **Teknoloji Seçimleri**
- **Framework**: Next.js 15 (Full-Stack)
- **Backend Runtime**: Next.js Server Actions + Route Handlers
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (S3 uyumlu)
- **Authentication**: Supabase Auth
- **Email Service**: Resend API
- **Monitoring**: Sentry

### **Mimari Yapı**
```
Next.js 15 (Monolithic)
├── App Router
│   ├── /app/api/route.ts (Route Handlers)
│   └── /app/actions/serverActions.ts (Server Actions)
├── Supabase Client (Server-side)
│   ├── Auth
│   ├── Database (PostgreSQL RLS)
│   └── Storage
└── External Services
    ├── Resend (Email)
    ├── Sentry (Error Tracking)
    └── Meta WhatsApp API (Message routing)
```

### **Server Actions Kullanımı**
- Form submissions (Sign up, Login, Add to Cart)
- Database mutations (Create order, Update profile)
- Email gönderme (Resend via Server Action)
- WhatsApp message routing (yönlendirme linki oluşturma)

### **Route Handlers Kullanımı**
- Webhook receivers (Resend, payment confirmations)
- File upload endpoints (Supabase Storage)
- Public API endpoints (opsiyonel, Phase 2)

### **Sunucusuz Avantajları**
- ✅ Cold start: <100ms
- ✅ Auto-scaling
- ✅ Sıfır server yönetimi
- ✅ Vercel ile seamless deployment
- ✅ Güvenli: Sensitive operations server-side

---

## 🔔 **Dış Servisler Entegrasyonu**

### **Database & Storage**
- **Servisi**: Supabase (PostgreSQL)
- **Avantajları**: Realtime capabilities, built-in authentication, vector support, REST API
- **Storage**: Supabase Storage (S3 uyumlu)

### **Email Gönderme**
- **Servisi**: Resend (Supabase ile entegre)
- **Otomatik Emailler**:
  - Hoş geldin emaili
  - Email doğrulama kodu
  - Şifre sıfırlama linki
  - Sipariş onayı
  - Ödeme bekleme bildirimi
  - Teslimat bildirimi

### **WhatsApp Mesaj Gönderme**
- **Metod**: WhatsApp Business API yönlendirme linki
- **Trigger**: Sipariş onaylandığında
- **İçerik**: 
  - Sipariş numarası
  - Toplam tutar
  - Havale bilgileri (hesap numarası, IBAN vs.)
  - WhatsApp linki: `https://wa.me/90XXXXXXXXX?text=...` şeklinde yönlendirme

**Akış:**
```
Sipariş Oluştur → Email gönder → WhatsApp Linki Oluştur → User WhatsApp'a yönlendir
```

**Not**: WhatsApp mesaj gönderimi değil, kullanıcı WhatsApp'ı açacak ve önceden tanımlanmış template mesajı görecek.

---

## 🛡️ **Güvenlik & Compliance**

### **Şifreleme**
- Şifreler: bcrypt (minimum 10 salt rounds)
- Database: SSL/TLS connection
- API: HTTPS zorunlu

### **CORS & API Security**
- CORS: Only trusted domains
- Rate limiting: Brute force saldırılarına karşı
- JWT Tokens: Expiration time ile (15-30 min)
- Refresh tokens: Long-lived (7-30 gün)

### **Veri Güvenliği**
- **Finansal Veri**: Kredi kartı/banka bilgisi depolanmayacak (manuel havale işlemi)
- **Kişisel Veri**: Ad, Soyad, Email, Telefon, Adres - tüm hassas veriler şifreli depolanacak
- **GDPR/KVKK**: Veri silme, kullanıcı onayı, veri taşınabilirliği
- **SQL Injection önleme**: Parametrized queries (Supabase RLS policies)
- **XSS önleme**: Input sanitization, Content Security Policy

### **Audit Logging**
- Tüm sistem değişiklikleri log'lanacak
- Başarısız giriş denemelerig kaydedilecek

---

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### **Önemli**
- Mobile-first approach
- Touch-friendly buttons (minimum 44x44px)
- Hamburger menu mobil'de
- Görsel optimizasyon (responsive images)

---

## ⚡ **Performance Considerations**

### **Frontend**
- Code splitting & lazy loading
- Image optimization & CDN
- Caching: Browser cache + service worker
- Minification: JS, CSS, HTML

### **Backend**
- Database indexing (email, kategori_id, durum vb.)
- API response caching (Redis)
- Pagination (limit: 20-50)
- Query optimization (N+1 problem)

### **Monitoring**
- Error tracking: Sentry
- Performance monitoring: New Relic / DataDog
- Uptime monitoring: StatusPage

---

## 📊 **Analytics (MVP'de Opsiyonel)**

- Google Analytics 4 entegrasyonu
- Temel metrikler:
  - Ziyaretçi sayısı, sayfa görüntülemeleri
  - Sipariş sayısı, toplam gelir
  - Ortalama sipariş değeri
  - Popüler ürünler
  - Terk edilen sepetler (cart abandonment)

---

## 🧪 **Testing Strategy**

### **Unit Tests**
- API endpoints
- Database queries
- Authentication logic

### **Integration Tests**
- Sipariş akışı (end-to-end)
- Email doğrulama
- Sepet işlemleri

### **E2E Tests** (opsiyonel MVP'de)
- Cypress / Playwright
- Kritik user journeys

---

## 🚀 **Deployment & Setup Guide**

---

### **1. LOCAL DEVELOPMENT SETUP**

#### **Prerequisites**
- **Node.js**: v18.17+ (`node --version`)
- **npm**: v9+ veya **bun**
- **Git**: Latest
- **Supabase CLI**: `npm install -g @supabase/cli`

#### **Step 1-5: Setup**
```bash
# 1. Clone repo
git clone https://github.com/yourusername/esarp.git && cd esarp

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local
# Doldur: SUPABASE_URL, SUPABASE_KEY, RESEND_API_KEY, SENTRY_DSN

# 4. Supabase local (optional)
supabase start && supabase db push && supabase seed run

# 5. Dev server
npm run dev
```

**Test**: http://localhost:3000/admin/login
- Email: `admin@esarp.com`
- Password: `AdminPassword123!`

---

### **2. SUPABASE SETUP**

```bash
# 1. Project oluştur: supabase.com
# 2. API keys al (Settings → API)
# 3. Production'a migrate
supabase db push --linked
supabase seed run --linked
```

---

### **3. VERCEL DEPLOYMENT**

```bash
# 1. GitHub'a push
git push origin main

# 2. vercel.com → New Project → Import GitHub repo
# 3. Environment Variables ekle:
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY
#    - RESEND_API_KEY
#    - NEXT_PUBLIC_SENTRY_DSN

# 4. Deploy → Done! 🎉
```

---

### **4. ENVIRONMENT VARIABLES - FULL LIST**

**`.env.example`:**
```env
# SUPABASE (Zorunlu)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# EMAIL (Zorunlu)
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_RESEND_EMAIL=orders@esarp.com

# ERROR TRACKING (Zorunlu)
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_AUTH_TOKEN=sntrys_xxxxx

# ANALYTICS (Opsiyonel)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# APP CONFIG
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Dev: localhost, Prod: domain
NODE_ENV=development  # development / production
```

---

## 📁 **PROJECT FOLDER STRUCTURE**

```
esarp/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx          # Admin login
│   │   ├── layout.tsx             # Admin sidebar
│   │   ├── page.tsx               # Dashboard
│   │   ├── products/
│   │   │   ├── page.tsx           # Ürün listesi
│   │   │   ├── [id]/page.tsx      # Ürün düzenle
│   │   │   └── new/page.tsx       # Yeni ürün
│   │   ├── orders/
│   │   │   ├── page.tsx           # Sipariş listesi
│   │   │   └── [id]/page.tsx      # Sipariş detayı
│   │   └── categories/
│   │       └── page.tsx           # Kategoriler
│   │
│   ├── auth/
│   │   ├── login/page.tsx         # User login
│   │   ├── signup/page.tsx        # User kayıt
│   │   └── reset/page.tsx         # Şifre sıfırla
│   │
│   ├── products/
│   │   ├── page.tsx               # Ana sayfa (ürün listesi)
│   │   └── [id]/page.tsx          # Ürün detayı
│   │
│   ├── orders/
│   │   └── [id]/page.tsx          # Order tracking
│   │
│   ├── profile/
│   │   ├── page.tsx               # Profil
│   │   ├── addresses/page.tsx      # Adresler
│   │   ├── orders/page.tsx        # Geçmiş siparişler
│   │   └── settings/page.tsx      # Hesap ayarları
│   │
│   ├── checkout/
│   │   ├── page.tsx               # Checkout flow
│   │   └── confirmation/page.tsx   # Onay sayfası
│   │
│   ├── api/
│   │   ├── route.ts               # Example route handler
│   │   └── webhooks/
│   │       └── resend/route.ts     # Email webhook
│   │
│   ├── actions/
│   │   ├── auth.ts                # Auth server actions
│   │   ├── cart.ts                # Cart server actions
│   │   ├── orders.ts              # Order server actions
│   │   ├── products.ts            # Product server actions (admin)
│   │   └── users.ts               # User server actions
│   │
│   ├── components/
│   │   ├── header.tsx             # Header/Nav
│   │   ├── footer.tsx             # Footer
│   │   ├── product-card.tsx       # Ürün kartı
│   │   ├── cart-item.tsx          # Sepet ürünü
│   │   └── ...
│   │
│   ├── lib/
│   │   ├── auth.ts                # Auth helpers
│   │   ├── supabase.ts            # Supabase client
│   │   ├── email.ts               # Email templates
│   │   ├── validation.ts          # Form validation
│   │   └── utils.ts               # Utility functions
│   │
│   ├── styles/
│   │   └── globals.css            # Global styles (Tailwind)
│   │
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Root page
│
├── supabase/
│   ├── migrations/
│   │   ├── 20240101000000_initial.sql
│   │   └── ...
│   └── seed.sql                   # Seed data (ilk admin)
│
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── .github/
│   └── workflows/
│       └── deploy.yml             # CI/CD (optional)
│
├── .env.example                   # Environment template
├── .env.local                     # Local env (gitignore'da)
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── package-lock.json
└── README.md
```

---

## 🔧 **SERVER ACTIONS REFERENCE**

### **Auth Actions** (`app/actions/auth.ts`)
```typescript
'use server'

export async function signUp(email: string, password: string, name: string)
export async function signIn(email: string, password: string)
export async function resetPassword(email: string)
export async function verifyEmail(email: string, code: string)
export async function logout()
```

### **Cart Actions** (`app/actions/cart.ts`)
```typescript
'use server'

export async function addToCart(productId: number, quantity: number, color: string, size: string)
export async function removeFromCart(productId: number)
export async function updateCartQuantity(productId: number, quantity: number)
export async function clearCart()
export async function getCart() // Returns cart items
```

### **Order Actions** (`app/actions/orders.ts`)
```typescript
'use server'

export async function createOrder(formData: FormData) 
  // Params: cartItems, addressId
  // Returns: { orderId, whatsappUrl, email }

export async function updateOrderStatus(orderId: number, status: string)
  // Statuses: payment_pending, preparing, shipped, delivered, cancelled

export async function getOrder(orderId: number)
export async function getUserOrders()
export async function sendWhatsAppMessage(orderId: number)
```

### **Product Actions** (`app/actions/products.ts`)
```typescript
'use server'

export async function createProduct(formData: FormData)
  // Params: name, description, price, category, colors, sizes, images

export async function updateProduct(productId: number, formData: FormData)
export async function deleteProduct(productId: number)
export async function getProduct(productId: number)
export async function getProducts(filter: any)
```

### **User Actions** (`app/actions/users.ts`)
```typescript
'use server'

export async function updateProfile(formData: FormData)
export async function addAddress(formData: FormData)
export async function updateAddress(addressId: number, formData: FormData)
export async function deleteAddress(addressId: number)
export async function deleteAccount()
```

---

## ✅ **VALIDATION & ERROR HANDLING**

### **Form Validation Schema** (Zod ile)

```typescript
// lib/validation.ts
import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Geçerli email girin'),
  password: z.string()
    .min(8, 'Min 8 karakter')
    .regex(/[A-Z]/, 'Büyük harf lazım')
    .regex(/[0-9]/, 'Rakam lazım')
    .regex(/[^a-zA-Z0-9]/, 'Özel karakter lazım'),
  name: z.string().min(2, 'Ad min 2 karakter')
});

export const addressSchema = z.object({
  il: z.string().min(1, 'İl seçin'),
  ilce: z.string().min(1, 'İlçe seçin'),
  mahalle: z.string().min(1, 'Mahalle girin'),
  acik_adres: z.string().min(10, 'Adres min 10 karakter'),
  telefon: z.string().regex(/^[\d\s\-\+\(\)]{10,}$/, 'Geçerli telefon girin')
});

export const productSchema = z.object({
  ad: z.string().min(3, 'Ürün adı min 3 karakter'),
  aciklama: z.string().min(10),
  fiyat: z.number().positive('Fiyat 0'dan büyük olmalı'),
  kategori_id: z.string().uuid(),
  renkler: z.array(z.string()).min(1, 'Min 1 renk seç'),
  boyutlar: z.array(z.string()).min(1, 'Min 1 boyut seç'),
  stok: z.number().int().nonnegative()
});
```

### **Error Handling Pattern**

```typescript
'use server'

export async function createOrder(formData: FormData) {
  try {
    // 1. Validation
    const validated = orderSchema.parse({
      addressId: formData.get('addressId'),
      items: JSON.parse(formData.get('items') || '[]')
    });

    // 2. Auth check
    const user = await validateAdminRole();
    if (!user) throw new Error('Auth required');

    // 3. Database operation
    const { data, error } = await supabase
      .from('orders')
      .insert(validated);

    if (error) throw error;

    // 4. Side effects (email, whatsapp)
    await resend.emails.send({...});

    // 5. Return success
    return { success: true, orderId: data.id };

  } catch (error) {
    // Log to Sentry
    if (error instanceof ZodError) {
      return { 
        success: false, 
        errors: error.flatten().fieldErrors 
      };
    }

    // User-friendly error
    const message = error instanceof Error 
      ? error.message 
      : 'Bir hata oluştu';
      
    console.error('createOrder error:', error);
    throw new Error(message);
  }
}
```

---

## 📧 **EMAIL TEMPLATES**

### **Hoş Geldin Emaili**
```html
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1>Hoş Geldiniz! 🎉</h1>
  <p>Merhaba {{name}},</p>
  <p>Eşarp ailesine hoş geldiniz. Artık güzel eşarpları keşfedebilirsiniz.</p>
  <a href="{{link}}" style="background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
    Alışverişe Başla
  </a>
  <p>Sorularınız için: support@esarp.com</p>
</body>
</html>
```

### **Email Doğrulama**
```html
<html>
<body>
  <h2>Email Doğrulama Kodu</h2>
  <p>Doğrulama kodunuz:</p>
  <h1 style="letter-spacing: 5px; color: #3b82f6;">{{code}}</h1>
  <p>Bu kod 10 dakika geçerlidir.</p>
</body>
</html>
```

### **Sipariş Onayı**
```html
<html>
<body>
  <h2>Siparişiniz Alındı ✅</h2>
  <p>Sipariş No: <strong>#{{orderId}}</strong></p>
  <p>Toplam: <strong>₺{{total}}</strong></p>
  <h3>Ürünler:</h3>
  <ul>
    {{#items}}
    <li>{{name}} x {{quantity}} - ₺{{price}}</li>
    {{/items}}
  </ul>
  <p><strong>Teslimat Adresi:</strong></p>
  <p>{{address}}</p>
  <a href="{{trackingLink}}">Siparişi Takip Et</a>
</body>
</html>
```

### **Sipariş Durumu Güncelleme**
```html
<html>
<body>
  <h2>Sipariş Durumu Güncellendi</h2>
  <p>Sipariş #{{orderId}}</p>
  <p><strong>Yeni Durum: {{status}}</strong></p>
  {{#if status == 'shipped'}}
    <p>Kargo: {{shippingCompany}}</p>
    <p>Tracking: {{trackingNumber}}</p>
  {{/if}}
</body>
</html>
```

---

## 🚨 **DEPLOYMENT CHECKLIST**

Canlı açmadan kontrol et:

- [ ] `.env` tüm variables dolu
- [ ] Supabase project oluşturuldu
- [ ] Database tables created
- [ ] Seed data (admin) eklendi
- [ ] RLS policies aktif
- [ ] Resend API key çalışıyor
- [ ] Sentry DSN doğru
- [ ] GitHub repo main branch'te
- [ ] `npm run build` başarılı
- [ ] `npm run dev` local çalışıyor
- [ ] Admin login testi ✅
- [ ] Vercel deployment ✅
- [ ] Production URL açılıyor ✅
- [ ] Monitoring aktif (Sentry) ✅

---

**Versiyon**: 1.0 MVP  
**Son Güncelleme**: Haziran 2026  
**Durum**: Hazırlanmakta
