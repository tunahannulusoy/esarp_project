import ProductCard from "@/app/components/product-card";
import FilterPanel from "@/app/components/filter-panel";
import SortSelect from "@/app/components/sort-select";
import { mockUrunler } from "@/app/lib/mock-data";
import {
  aramaParametrelerindenFiltreleriCikar,
  tumBoyutlariGetir,
  tumKategorileriGetir,
  tumRenkleriGetir,
  urunleriFiltreleVeSirala,
} from "@/app/lib/filter-utils";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const filtreler = aramaParametrelerindenFiltreleriCikar(params);
  const urunler = urunleriFiltreleVeSirala(mockUrunler, filtreler);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-stone-900">
          {filtreler.q ? `"${filtreler.q}" için sonuçlar` : "Tüm Ürünler"}
        </h1>
        <SortSelect />
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <FilterPanel
            kategoriler={tumKategorileriGetir()}
            renkler={tumRenkleriGetir(mockUrunler)}
            boyutlar={tumBoyutlariGetir(mockUrunler)}
          />
        </aside>

        <div>
          {urunler.length === 0 ? (
            <p className="text-sm text-stone-600">Bu kriterlere uygun ürün bulunamadı.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {urunler.map((urun) => (
                <ProductCard key={urun.id} urun={urun} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
