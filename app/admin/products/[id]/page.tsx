"use client";

import { use, useEffect, useState } from "react";
import type { Urun } from "@/app/types";
import ProductForm from "@/app/admin/products/product-form";
import { adminUrunGetir, adminUrunGuncelle } from "@/app/lib/admin-products";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [urun, setUrun] = useState<Urun | null | undefined>(undefined);

  useEffect(() => {
    setUrun(adminUrunGetir(id) ?? null);
  }, [id]);

  if (urun === undefined) return null;

  if (urun === null) {
    return <p className="text-stone-600">Ürün bulunamadı.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Ürünü Düzenle</h1>
      <div className="mt-6">
        <ProductForm baslangicDeger={urun} onKaydet={(veri) => adminUrunGuncelle(id, veri)} />
      </div>
    </div>
  );
}
