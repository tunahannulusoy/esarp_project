import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Geçerli bir email girin"),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı")
    .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli")
    .regex(/[a-z]/, "Şifre en az bir küçük harf içermeli")
    .regex(/[0-9]/, "Şifre en az bir rakam içermeli")
    .regex(/[^a-zA-Z0-9]/, "Şifre en az bir özel karakter içermeli"),
});

export const signInSchema = z.object({
  email: z.string().email("Geçerli bir email girin"),
  password: z.string().min(1, "Şifre gerekli"),
});

export const addressSchema = z.object({
  il: z.string().min(1, "İl seçin"),
  ilce: z.string().min(1, "İlçe seçin"),
  mahalle: z.string().min(1, "Mahalle girin"),
  acik_adres: z.string().min(10, "Adres en az 10 karakter olmalı"),
  adres_basligi: z.string().min(1, "Adres başlığı girin"),
  telefon: z.string().regex(/^[\d\s\-+()]{10,}$/, "Geçerli bir telefon girin"),
});

export const productSchema = z.object({
  ad: z.string().min(3, "Ürün adı en az 3 karakter olmalı"),
  aciklama: z.string().min(10, "Açıklama en az 10 karakter olmalı"),
  fiyat: z.number().positive("Fiyat 0'dan büyük olmalı"),
  indirim_orani: z.number().min(0).max(100).default(0),
  kategori_id: z.string().min(1, "Kategori seçin"),
  renkler: z.array(z.string()).min(1, "En az 1 renk seçin"),
  boyutlar: z.array(z.string()).min(1, "En az 1 boyut seçin"),
  stok: z.number().int().nonnegative(),
});

export const orderSchema = z.object({
  addressId: z.string().min(1, "Adres seçin"),
  items: z
    .array(
      z.object({
        urun_id: z.string(),
        adet: z.number().int().positive(),
        secili_renk: z.string(),
        secili_boyut: z.string(),
      })
    )
    .min(1, "Sepetiniz boş"),
});
