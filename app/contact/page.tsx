import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-stone-900">İletişim</h1>
      <p className="mt-2 text-sm text-stone-600">
        Sorularınız için aşağıdaki kanallardan bize ulaşabilirsiniz.
      </p>

      <div className="mt-6 space-y-4 text-sm text-stone-700">
        <div className="flex items-center gap-3">
          <Mail className="h-5 w-5 text-stone-500" strokeWidth={1.5} />
          info@esarp.com
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-stone-500" strokeWidth={1.5} />
          +90 555 555 55 55
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-stone-500" strokeWidth={1.5} />
          İstanbul, Türkiye
        </div>
        <a
          href="https://wa.me/905555555555"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 text-emerald-700 hover:underline"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
          WhatsApp üzerinden yazın
        </a>
      </div>
    </div>
  );
}
