import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/app/components/social-icons";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-lg font-semibold text-stone-900">Eşarp</h3>
          <p className="mt-2 text-sm text-stone-600">
            Şıklığı ve kaliteyi bir araya getiren eşarp ve aksesuar koleksiyonları.
          </p>
        </div>

        <div>
          <h4 className="font-medium text-stone-900">Hızlı Linkler</h4>
          <ul className="mt-2 space-y-2 text-sm text-stone-600">
            <li><Link href="/about" className="hover:underline">Hakkımızda</Link></li>
            <li><Link href="/contact" className="hover:underline">İletişim</Link></li>
            <li><Link href="/faq" className="hover:underline">SSS</Link></li>
            <li><Link href="/privacy" className="hover:underline">Gizlilik Politikası</Link></li>
            <li><Link href="/terms" className="hover:underline">Kullanım Şartları</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-stone-900">İletişim</h4>
          <ul className="mt-2 space-y-2 text-sm text-stone-600">
            <li>info@esarp.com</li>
            <li>+90 555 555 55 55</li>
            <li>İstanbul, Türkiye</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-stone-900">Sosyal Medya</h4>
          <div className="mt-2 flex gap-4 text-stone-600">
            <a href="https://wa.me/905555555555" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Eşarp. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
