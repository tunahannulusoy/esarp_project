"use client";

import { use, useEffect, useState } from "react";
import type { Kategori, Urun } from "@/app/types";
import ProductForm from "@/app/admin/products/product-form";
import AdminSpinner from "@/app/admin/components/admin-spinner";
import { getAdminCategories } from "@/app/actions/categories";
import { getAdminProduct, updateProduct } from "@/app/actions/products";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [urun, setUrun] = useState<Urun | null | undefined>(undefined);
  const [kategoriler, setKategoriler] = useState<Kategori[] | undefined>(undefined);

  useEffect(() => {
    Promise.all([getAdminProduct(id), getAdminCategories()]).then(([veri, kategoriListesi]) => {
      setUrun(veri);
      setKategoriler(kategoriListesi);
    });
  }, [id]);

  if (urun === undefined || kategoriler === undefined) return <AdminSpinner />;

  if (urun === null) {
    return <p className="text-stone-600">Ürün bulunamadı.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Ürünü Düzenle</h1>
      <div className="mt-6">
        <ProductForm baslangicDeger={urun} kategoriler={kategoriler} onKaydet={(veri) => updateProduct(id, veri)} />
      </div>
    </div>
  );
}
