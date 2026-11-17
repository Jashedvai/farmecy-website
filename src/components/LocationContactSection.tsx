import { useState } from 'react';
import { Check, Clock, Copy, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { CLINIC_INFO, getDhakaOpenState } from '../data/clinicData';
import { useLanguage } from '../i18n/LanguageContext';

export function LocationContactSection() {
  const { lang, t } = useLanguage();
  const [copiedPhone, setCopiedPhone] = useState(false);
  const openState = getDhakaOpenState(lang);

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(CLINIC_INFO.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2500);
    } catch {
      // Fallback ignored if clipboard unavailable
    }
  };

  const mapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Harinadighi+Fatickchhari+Chittagong';

  return (
    <section id="location" className="bg-[#F5F5F7] py-16 sm:py-24 border-b border-black/[0.06]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-medium text-[#6E6E73] mb-2">
            {t.location.eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#1D1D1F]">
            {t.location.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Address & Direct Contact Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-black/[0.07] flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#6E6E73] mb-2">
                  <MapPin className="w-4 h-4 text-[#0071E3]" />
                  {t.location.addressLabel}
                </div>
                <p className="font-display text-xl font-semibold text-[#1D1D1F]">
                  {t.brandFull}
                </p>
                <p className="mt-1.5 text-sm sm:text-base text-[#424245]">
                  {t.addressLine1}
                  <br />
                  {t.addressLine2}
                </p>
              </div>

              <div className="pt-5 border-t border-black/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#6E6E73] mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0071E3]" />
                    {t.location.deskLabel}
                  </div>
                  <a
                    href={`tel:${CLINIC_INFO.phone}`}
                    className="font-mono text-base font-semibold text-[#1D1D1F] hover:text-[#0071E3] transition-colors tabular-nums"
                  >
                    {CLINIC_INFO.phone}
                  </a>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
                    >
                      {copiedPhone ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#15803D]" />
                          <span className="text-[#15803D]">{t.location.copiedNumber}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          {t.location.copyNumber}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-[#6E6E73] mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0071E3]" />
                    {t.location.emailLabel}
                  </div>
                  <a
                    href={`mailto:${CLINIC_INFO.email}`}
                    className="text-sm font-medium text-[#1D1D1F] hover:text-[#0071E3] transition-colors break-all"
                  >
                    {CLINIC_INFO.email}
                  </a>
                  <p className="mt-1.5 text-xs text-[#6E6E73]">
                    {t.location.emailResponse}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-black/[0.06] flex flex-wrap items-center gap-3">
              <a
                href={`tel:${CLINIC_INFO.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-[#0071E3] hover:bg-[#0062C4] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors whitespace-nowrap shrink-0"
              >
                <Phone className="w-4 h-4" />
                {t.location.callPrefix} {CLINIC_INFO.phone}
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 bg-[#F5F5F7] hover:bg-[#EAEAEF] text-[#1D1D1F] text-sm font-medium px-5 py-2.5 rounded-full transition-colors whitespace-nowrap shrink-0"
              >
                {t.location.directions}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-black/[0.07] flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-black/[0.06]">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1D1D1F]">
                  <Clock className="w-4 h-4 text-[#0071E3]" />
                  {t.location.hoursHeader}
                </div>
                <span
                  className={`text-xs font-medium tabular-nums ${
                    openState.isOpen ? 'text-[#15803D]' : 'text-[#B45309]'
                  }`}
                >
                  {openState.label}
                </span>
              </div>

              <div className="mt-4 divide-y divide-black/[0.06]">
                {t.location.days.map((row) => (
                  <div
                    key={row.day}
                    className="py-2.5 flex items-center justify-between text-sm"
                  >
                    <span className={row.open ? 'text-[#1D1D1F] font-medium' : 'text-[#6E6E73]'}>
                      {row.day}
                    </span>
                    <span
                      className={`font-mono text-xs sm:text-sm tabular-nums ${
                        row.open ? 'text-[#424245]' : 'text-[#DC2626] font-medium'
                      }`}
                    >
                      {row.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 pt-4 border-t border-black/[0.06] text-xs text-[#6E6E73]">
              {t.location.emergencyNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
