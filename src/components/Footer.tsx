import { Globe } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { useLanguage } from '../i18n/LanguageContext';

export function Footer() {
  const { lang, setLang, t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#F5F5F7] border-t border-black/[0.08] py-12 sm:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-black/[0.08]">
          {/* Clinic Identity */}
          <div className="md:col-span-5 space-y-2.5">
            <p className="font-display text-lg font-semibold text-[#1D1D1F]">
              {t.brandFull}
            </p>
            <p className="text-sm text-[#424245] leading-relaxed max-w-sm">
              {t.footer.description}
            </p>
            <p className="text-xs text-[#6E6E73] pt-1">
              {t.addressLine1}, {t.addressLine2}
            </p>
          </div>

          {/* Directory Links */}
          <div className="md:col-span-3 space-y-2.5">
            <p className="text-xs font-medium text-[#6E6E73]">{t.footer.directoryTitle}</p>
            <nav aria-label="Footer navigation" className="flex flex-col space-y-2 text-sm text-[#1D1D1F]">
              <a href="#services" className="hover:text-[#0071E3] transition-colors w-fit">
                {t.footer.links.services}
              </a>
              <a href="#doctor" className="hover:text-[#0071E3] transition-colors w-fit">
                {t.footer.links.doctor}
              </a>
              <a href="#testimonials" className="hover:text-[#0071E3] transition-colors w-fit">
                {t.footer.links.testimonials}
              </a>
              <a href="#booking" className="hover:text-[#0071E3] transition-colors w-fit">
                {t.footer.links.dashboard}
              </a>
              <a href="#faq" className="hover:text-[#0071E3] transition-colors w-fit">
                {t.footer.links.faq}
              </a>
            </nav>
          </div>

          {/* Direct Contact & Hours */}
          <div className="md:col-span-4 space-y-2.5">
            <p className="text-xs font-medium text-[#6E6E73]">{t.footer.deskTitle}</p>
            <div className="space-y-1.5 text-sm text-[#1D1D1F]">
              <p className="tabular-nums">{t.hoursSummary}</p>
              <p className="text-xs text-[#6E6E73]">{t.closedDayLabel}</p>
              <p className="pt-2">
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="font-mono font-semibold text-[#1D1D1F] hover:text-[#0071E3] transition-colors tabular-nums"
                >
                  {CLINIC_INFO.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${CLINIC_INFO.email}`}
                  className="text-xs text-[#424245] hover:text-[#0071E3] transition-colors break-all"
                >
                  {CLINIC_INFO.email}
                </a>
              </p>

              {/* Footer Language Switcher */}
              <div className="pt-3 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#6E6E73]" />
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`text-xs font-medium cursor-pointer ${
                    lang === 'en' ? 'text-[#0071E3]' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  English
                </button>
                <span className="text-xs text-[#6E6E73]">/</span>
                <button
                  type="button"
                  onClick={() => setLang('bn')}
                  className={`text-xs font-medium cursor-pointer ${
                    lang === 'bn' ? 'text-[#0071E3]' : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#6E6E73]">
          <p>&copy; {year} {t.brandFull}. {t.footer.rights}</p>
          <p className="tabular-nums">{t.footer.feeLine}</p>
        </div>
      </div>
    </footer>
  );
}
