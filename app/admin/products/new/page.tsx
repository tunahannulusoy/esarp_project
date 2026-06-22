"use client";

import ProductForm from "@/app/admin/products/product-form";
import { createProduct } from "@/app/actions/products";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Yeni Ürün</h1>
      <div className="mt-6">
        <ProductForm onKaydet={(veri) => createProduct(veri)} />
      </div>
    </div>
  );
}
