"use client";

import { X } from "lucide-react";

export default function ConfirmModal({
  acik,
  baslik,
  mesaj,
  onayMetni = "Evet, devam et",
  iptalMetni = "İptal",
  tehlikeli = false,
  onOnayla,
  onIptal,
}: {
  acik: boolean;
  baslik: string;
  mesaj: string;
  onayMetni?: string;
  iptalMetni?: string;
  tehlikeli?: boolean;
  onOnayla: () => void;
  onIptal: () => void;
}) {
  if (!acik) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Kapat"
        className="absolute inset-0 bg-black/40"
        onClick={onIptal}
      />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onIptal}
          aria-label="Kapat"
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-700"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <h2 className="text-base font-semibold text-stone-900">{baslik}</h2>
        <p className="mt-2 text-sm text-stone-500">{mesaj}</p>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onIptal}
            className="flex-1 rounded-lg border border-stone-200 py-2 text-sm text-stone-700 hover:bg-stone-50"
          >
            {iptalMetni}
          </button>
          <button
            type="button"
            onClick={onOnayla}
            className={`flex-1 rounded-lg py-2 text-sm font-medium text-white ${
              tehlikeli ? "bg-rose-600 hover:bg-rose-700" : "bg-stone-900 hover:bg-stone-700"
            }`}
          >
            {onayMetni}
          </button>
        </div>
      </div>
    </div>
  );
}
