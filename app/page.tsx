import ProductCard from "@/app/components/product-card";
import FilterPanel from "@/app/components/filter-panel";
import SortSelect from "@/app/components/sort-select";
import Pagination from "@/app/components/pagination";
import { mockUrunler } from "@/app/lib/mock-data";
import {
  aramaParametrelerindenFiltreleriCikar,
  tumBoyutlariGetir,
  tumKategorileriGetir,
  tumRenkleriGetir,
  urunleriFiltreleVeSirala,
} from "@/app/lib/filter-utils";

const SAYFA_BOYUTU = 16;

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const filtreler = aramaParametrelerindenFiltreleriCikar(params);
  const tumUrunler = urunleriFiltreleVeSirala(mockUrunler, filtreler);

  const toplamSayfa = Math.max(1, Math.ceil(tumUrunler.length / SAYFA_BOYUTU));
  const istenenSayfa = Number(Array.isArray(params.page) ? params.page[0] : params.page) || 1;
  const aktifSayfa = Math.min(Math.max(1, istenenSayfa), toplamSayfa);
  const urunler = tumUrunler.slice((aktifSayfa - 1) * SAYFA_BOYUTU, aktifSayfa * SAYFA_BOYUTU);

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
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {urunler.map((urun) => (
                  <ProductCard key={urun.id} urun={urun} />
                ))}
              </div>
              <Pagination aktifSayfa={aktifSayfa} toplamSayfa={toplamSayfa} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
