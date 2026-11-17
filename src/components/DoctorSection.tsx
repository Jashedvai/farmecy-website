import { Check, Home, MapPin, Stethoscope } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { useLanguage } from '../i18n/LanguageContext';
import type { VisitType } from '../types/clinic';
import { DoctorPortrait } from './DoctorPortrait';

interface DoctorSectionProps {
  onSelectVisitType: (visitType: VisitType) => void;
}

export function DoctorSection({ onSelectVisitType }: DoctorSectionProps) {
  const { lang, t } = useLanguage();
  const { doctor } = CLINIC_INFO;

  return (
    <section id="doctor" className="bg-white py-16 sm:py-24 border-b border-black/[0.06]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Column: Doctor Bio & Clinical Experience */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <DoctorPortrait size="lg" />
                <div>
                  <p className="text-xs sm:text-sm font-medium text-[#6E6E73] mb-1.5">
                    {t.doctor.eyebrow}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#1D1D1F]">
                    {t.hero.doctorName},{' '}
                    <span className="text-[#424245] font-medium">{t.hero.doctorCreds}</span>
                  </h2>
                </div>
              </div>

              <p className="mt-6 text-base sm:text-lg text-[#424245] leading-relaxed max-w-2xl">
                {t.doctor.bio}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-6 border-t border-black/[0.08]">
                {t.doctor.focusAreas.map((area) => (
                  <div key={area} className="flex items-start gap-2.5 text-sm text-[#1D1D1F]">
                    <Check className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/[0.08] flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#6E6E73]">
              <div>
                <span className="block text-xs text-[#6E6E73]">{t.doctor.qualificationLabel}</span>
                <span className="font-medium text-[#1D1D1F]">{t.hero.doctorCreds}</span>
              </div>
              <div>
                <span className="block text-xs text-[#6E6E73]">{t.doctor.locationLabel}</span>
                <span className="font-medium text-[#1D1D1F]">{t.doctor.locationValue}</span>
              </div>
              <div>
                <span className="block text-xs text-[#6E6E73]">{t.doctor.hoursLabel}</span>
                <span className="font-medium text-[#1D1D1F] tabular-nums">{t.doctor.hoursValue}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Transparent Consultation Options */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="flex-1 bg-[#F5F5F7] rounded-2xl p-6 sm:p-7 border border-black/[0.06] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Stethoscope className="w-5 h-5 text-[#0071E3]" />
                    <h3 className="font-display text-lg font-semibold text-[#1D1D1F]">
                      {t.doctor.clinicTitle}
                    </h3>
                  </div>
                  <span className="font-mono text-xl font-semibold text-[#1D1D1F] tabular-nums">
                    {lang === 'bn' ? '১০০ টাকা' : `${doctor.clinicFeeTk} Tk`}
                  </span>
                </div>
                <p className="mt-2.5 text-sm text-[#424245] leading-relaxed">
                  {t.doctor.clinicDesc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-black/[0.08] flex items-center justify-between gap-4">
                <span className="text-xs text-[#6E6E73] inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {t.doctor.clinicMeta}
                </span>
                <button
                  type="button"
                  onClick={() => onSelectVisitType('clinic')}
                  className="bg-[#0071E3] hover:bg-[#0062C4] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.doctor.clinicBtn}
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#F5F5F7] rounded-2xl p-6 sm:p-7 border border-black/[0.06] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Home className="w-5 h-5 text-[#0071E3]" />
                    <h3 className="font-display text-lg font-semibold text-[#1D1D1F]">
                      {t.doctor.homeTitle}
                    </h3>
                  </div>
                  <span className="font-mono text-xl font-semibold text-[#1D1D1F] tabular-nums">
                    {lang === 'bn' ? '২০০ টাকা' : `${doctor.homeFeeTk} Tk`}
                  </span>
                </div>
                <p className="mt-2.5 text-sm text-[#424245] leading-relaxed">
                  {t.doctor.homeDesc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-black/[0.08] flex items-center justify-between gap-4">
                <span className="text-xs text-[#6E6E73]">{t.doctor.homeMeta}</span>
                <button
                  type="button"
                  onClick={() => onSelectVisitType('home')}
                  className="bg-[#1D1D1F] hover:bg-[#333336] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.doctor.homeBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
