import { useState } from 'react';
import { ArrowUpRight, Info } from 'lucide-react';
import { SERVICES } from '../data/clinicData';
import { useLanguage } from '../i18n/LanguageContext';
import type { ServiceCategory, ServiceItem, VisitType } from '../types/clinic';

interface ServicesSectionProps {
  onSelectServiceForBooking: (reason: string, visitType: VisitType) => void;
}

export function ServicesSection({ onSelectServiceForBooking }: ServicesSectionProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [expandedId, setExpandedId] = useState<string | null>(SERVICES[0].id);

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'all', label: t.services.categories.all },
    { id: 'pharmacy', label: t.services.categories.pharmacy },
    { id: 'clinical', label: t.services.categories.clinical },
    { id: 'wellness', label: t.services.categories.wellness },
  ];

  const filteredServices =
    activeCategory === 'all'
      ? SERVICES
      : SERVICES.filter((service) => service.category === activeCategory);

  const handleServiceAction = (service: ServiceItem) => {
    onSelectServiceForBooking(service.suggestedReason, service.suggestedVisitType);
  };

  return (
    <section id="services" className="bg-[#F5F5F7] py-16 sm:py-24 border-b border-black/[0.06]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Interactive Segmented Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-xl">
            <p className="text-xs sm:text-sm font-medium text-[#6E6E73] mb-2">
              {t.services.eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#1D1D1F]">
              {t.services.heading}
            </h2>
          </div>

          {/* Interactive Category Segmented Control */}
          <div
            role="tablist"
            aria-label={t.services.eyebrow}
            className="inline-flex flex-wrap items-center gap-1 p-1 bg-black/[0.05] rounded-xl self-start md:self-auto"
          >
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] ${
                    isActive
                      ? 'bg-white text-[#1D1D1F] shadow-sm'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Hairline Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredServices.map((service, index) => {
            const isExpanded = expandedId === service.id;
            const isMarquee = activeCategory === 'all' && index < 2;
            const localized =
              t.services.items[service.id as keyof typeof t.services.items];

            return (
              <article
                key={service.id}
                className={`bg-white rounded-2xl p-6 border border-black/[0.07] flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 ${
                  isMarquee ? 'lg:col-span-2' : ''
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#6E6E73] mb-4">
                    <span className="font-mono tabular-nums">
                      {service.number} · {localized?.categoryLabel ?? service.categoryLabel}
                    </span>
                    <span className="tabular-nums">{localized?.availability ?? service.availability}</span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-semibold text-[#1D1D1F] tracking-tight">
                    {localized?.title ?? service.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-[#424245] leading-relaxed">
                    {localized?.description ?? service.description}
                  </p>

                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-start gap-2 text-xs text-[#6E6E73]">
                      <Info className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" />
                      <span>{localized?.preparationNote ?? service.preparationNote}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : service.id)}
                    className="text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer py-1"
                  >
                    {isExpanded ? t.services.hideGuidance : t.services.showGuidance}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleServiceAction(service)}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#0071E3] hover:text-[#005BB5] transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1"
                  >
                    {service.isUpcoming ? t.services.inquire : t.services.bookVisit}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
