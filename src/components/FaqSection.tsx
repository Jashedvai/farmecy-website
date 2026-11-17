import { useState } from 'react';
import { ArrowRight, ChevronDown, Phone } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';
import { useLanguage } from '../i18n/LanguageContext';
import type { FaqCategory } from '../types/clinic';

interface FaqSectionProps {
  onBookClick: () => void;
}

export function FaqSection({ onBookClick }: FaqSectionProps) {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<FaqCategory>('all');
  const [openId, setOpenId] = useState<string | null>(t.faq.items[0]?.id ?? null);

  const faqCategories: { id: FaqCategory; label: string }[] = [
    { id: 'all', label: t.faq.categories.all },
    { id: 'appointments', label: t.faq.categories.appointments },
    { id: 'pharmacy', label: t.faq.categories.pharmacy },
    { id: 'hours', label: t.faq.categories.hours },
  ];

  const filteredFaqs =
    activeCategory === 'all'
      ? t.faq.items
      : t.faq.items.filter((item) => item.category === activeCategory);

  const handleCategoryChange = (category: FaqCategory) => {
    setActiveCategory(category);
    const nextList =
      category === 'all'
        ? t.faq.items
        : t.faq.items.filter((item) => item.category === category);
    if (nextList.length > 0 && !nextList.some((item) => item.id === openId)) {
      setOpenId(nextList[0].id);
    }
  };

  return (
    <section id="faq" className="bg-white py-16 sm:py-24 border-b border-black/[0.06]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Editorial Summary Column */}
          <div className="lg:col-span-5">
            <p className="text-xs sm:text-sm font-medium text-[#6E6E73] mb-2">
              {t.faq.eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#1D1D1F]">
              {t.faq.heading}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#424245] leading-relaxed">
              {t.faq.subtitle}
            </p>

            {/* Quick Support Surface */}
            <div className="mt-8 bg-[#F5F5F7] rounded-2xl p-6 border border-black/[0.06] space-y-4">
              <div>
                <p className="text-xs font-medium text-[#6E6E73]">{t.faq.supportEyebrow}</p>
                <p className="font-display text-base font-semibold text-[#1D1D1F] mt-0.5">
                  {t.faq.supportTitle}
                </p>
                <p className="text-xs text-[#6E6E73] mt-1 tabular-nums">
                  {t.faq.supportHours}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onBookClick}
                  className="inline-flex items-center gap-1.5 bg-[#0071E3] hover:bg-[#0062C4] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {t.faq.bookBtn}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FBFBFD] text-[#1D1D1F] border border-black/[0.08] text-xs sm:text-sm font-mono font-medium px-4 py-2.5 rounded-full transition-colors whitespace-nowrap shrink-0 tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 text-[#0071E3]" />
                  {CLINIC_INFO.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Right Filter Tabs + Accordion List */}
          <div className="lg:col-span-7">
            <div
              role="tablist"
              aria-label={t.faq.eyebrow}
              className="inline-flex flex-wrap items-center gap-1 p-1 bg-black/[0.04] rounded-xl mb-6"
            >
              {faqCategories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    onClick={() => handleCategoryChange(category.id)}
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

            <div className="divide-y divide-black/[0.08] border-t border-b border-black/[0.08]">
              {filteredFaqs.map((item) => {
                const isOpen = openId === item.id;
                const actionLabel = 'actionLabel' in item ? item.actionLabel : undefined;
                return (
                  <div key={item.id} className="py-5">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="w-full flex items-start justify-between gap-4 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded-lg py-0.5"
                    >
                      <div className="space-y-1 pr-2">
                        <span className="block text-xs font-medium text-[#6E6E73]">
                          {item.categoryLabel}
                        </span>
                        <span className="block font-display text-base sm:text-lg font-semibold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                          {item.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-[#6E6E73] shrink-0 mt-5 transition-transform duration-150 ${
                          isOpen ? 'rotate-180 text-[#0071E3]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div
                        id={`faq-panel-${item.id}`}
                        className="mt-3 pr-8 text-sm sm:text-[15px] text-[#424245] leading-relaxed"
                      >
                        <p>{item.answer}</p>
                        {actionLabel && (
                          <button
                            type="button"
                            onClick={onBookClick}
                            className="mt-3 inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#0071E3] hover:text-[#005BB5] transition-colors cursor-pointer"
                          >
                            {actionLabel}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
