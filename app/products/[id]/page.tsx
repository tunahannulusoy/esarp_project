import { notFound } from "next/navigation";
import { ilgiliUrunleriGetir, urunGetir } from "@/app/lib/mock-data";
import ProductDetailClient from "./product-detail-client";
import ProductCard from "@/app/components/product-card";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const urun = urunGetir(id);

  if (!urun) notFound();

  const ilgiliUrunler = ilgiliUrunleriGetir(urun);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetailClient urun={urun} />

      {ilgiliUrunler.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-stone-900">İlgili Ürünler</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ilgiliUrunler.map((u) => (
              <ProductCard key={u.id} urun={u} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
