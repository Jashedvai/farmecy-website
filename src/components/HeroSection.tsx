import { ArrowRight, CalendarCheck, Clock, Globe, Phone, ShieldCheck, Stethoscope } from 'lucide-react';
import { CLINIC_INFO, getDhakaOpenState } from '../data/clinicData';
import { useLanguage } from '../i18n/LanguageContext';
import { DoctorPortrait } from './DoctorPortrait';

interface HeroSectionProps {
  onBookConsultation: () => void;
  onExploreServices: () => void;
  nextOpenSlotLabel: string;
}

export function HeroSection({
  onBookConsultation,
  onExploreServices,
  nextOpenSlotLabel,
}: HeroSectionProps) {
  const { lang, setLang, t } = useLanguage();
  const openState = getDhakaOpenState(lang);

  const factIcons = [Stethoscope, ShieldCheck, CalendarCheck, Clock];

  return (
    <section id="top" className="bg-white pt-10 pb-16 sm:pt-14 sm:pb-24 lg:pt-16 lg:pb-28 border-b border-black/[0.06]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow & Bilingual Language Switcher Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 sm:pb-10">
          <p className="text-xs sm:text-sm font-medium text-[#6E6E73] tracking-wide">
            {t.hero.eyebrow}
          </p>

          <div
            role="group"
            aria-label="Language switch"
            className="inline-flex items-center gap-1 p-1 bg-[#F5F5F7] border border-black/[0.06] rounded-xl self-start sm:self-auto shrink-0"
          >
            <span className="pl-2 pr-1 text-[#6E6E73]" aria-hidden="true">
              <Globe className="w-3.5 h-3.5" />
            </span>
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('bn')}
              aria-pressed={lang === 'bn'}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                lang === 'bn'
                  ? 'bg-white text-[#1D1D1F] shadow-sm'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* Two-Column Balanced Architectural Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Focal Editorial Statement */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="font-display text-[clamp(2.25rem,4.3vw,3.75rem)] font-semibold tracking-[-0.03em] leading-[1.12] text-[#1D1D1F] max-w-2xl">
              {t.hero.headline}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#424245] leading-relaxed max-w-xl">
              {t.hero.subtitlePrefix}{' '}
              <span className="font-medium text-[#1D1D1F]">{t.hero.doctorName}</span> ({t.hero.doctorCreds}),{' '}
              {t.hero.subtitleSuffix}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBookConsultation}
                className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0062C4] active:scale-[0.99] text-white text-sm sm:text-base font-medium px-6 py-3 rounded-full transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2"
              >
                {t.hero.bookCta}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onExploreServices}
                className="inline-flex items-center justify-center gap-1.5 text-sm sm:text-base font-medium text-[#0071E3] hover:text-[#005BB5] px-3 py-3 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-lg"
              >
                {t.hero.exploreCta}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Clinical Care Summary Panel */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-black/[0.06] flex flex-col justify-between gap-6">
              <div>
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-black/[0.08]">
                  <div>
                    <p className="text-xs font-medium text-[#6E6E73]">{t.hero.cardRoleLabel}</p>
                    <h2 className="font-display text-xl font-semibold text-[#1D1D1F] mt-0.5">
                      {t.hero.doctorName}
                    </h2>
                    <p className="text-sm text-[#424245] mt-0.5">
                      {t.hero.cardPracticeMeta}
                    </p>
                  </div>
                  <DoctorPortrait size="md" />
                </div>

                <dl className="mt-5 space-y-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-[#6E6E73]">{t.hero.clinicFeeLabel}</dt>
                    <dd className="font-mono text-base font-semibold text-[#1D1D1F] tabular-nums">
                      {lang === 'bn' ? '১০০ টাকা' : `${CLINIC_INFO.doctor.clinicFeeTk} Tk`}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-[#6E6E73]">{t.hero.homeFeeLabel}</dt>
                    <dd className="font-mono text-base font-semibold text-[#1D1D1F] tabular-nums">
                      {lang === 'bn' ? '২০০ টাকা' : `${CLINIC_INFO.doctor.homeFeeTk} Tk`}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-sm text-[#6E6E73]">{t.hero.nextSlotLabel}</dt>
                    <dd className="font-mono text-sm font-medium text-[#15803D] tabular-nums text-right">
                      {nextOpenSlotLabel}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-5 border-t border-black/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-4 h-4 text-[#1D1D1F] shrink-0" />
                  <span className={`font-medium tabular-nums ${openState.isOpen ? 'text-[#15803D]' : 'text-[#6E6E73]'}`}>
                    {openState.label}
                  </span>
                </div>
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1D1D1F] hover:text-[#0071E3] transition-colors tabular-nums whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {CLINIC_INFO.phone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Key Facts Strip below Hero Split */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-black/[0.08] grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {t.hero.facts.map((fact, idx) => {
            const Icon = factIcons[idx];
            return (
              <div key={fact.label} className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-[#6E6E73]">
                  <Icon className="w-3.5 h-3.5 text-[#0071E3]" />
                  {fact.label}
                </div>
                <p className="font-display text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tabular-nums">
                  {fact.value}
                </p>
                <p className="text-xs sm:text-sm text-[#6E6E73]">{fact.note}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
