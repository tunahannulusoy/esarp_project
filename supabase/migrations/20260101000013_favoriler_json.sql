-- Eski favoriler tablosunu (satır satır) kaldır, sepet gibi JSON array yapısına geç
DROP TABLE IF EXISTS public.favoriler;

CREATE TABLE public.favoriler (
  kullanici_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  urun_idler jsonb NOT NULL DEFAULT '[]',
  guncelleme_tarihi timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.favoriler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanici kendi favorilerini yonetir" ON public.favoriler
  FOR ALL USING (auth.uid() = kullanici_id);
