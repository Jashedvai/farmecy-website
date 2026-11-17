import { useState } from 'react';
import { MessageSquarePlus, Quote, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import type { Testimonial } from '../types/clinic';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onAddTestimonial: (testimonial: Testimonial) => void;
}

export function TestimonialsSection({
  testimonials,
  onAddTestimonial,
}: TestimonialsSectionProps) {
  const { lang, t } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [roleAndArea, setRoleAndArea] = useState('');
  const [visitType, setVisitType] = useState<string>(t.testimonials.visitOptions[0]);
  const [outcomeSummary, setOutcomeSummary] = useState('');
  const [quote, setQuote] = useState('');
  const [error, setError] = useState('');
  const [submittedNote, setSubmittedNote] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !roleAndArea.trim() || !quote.trim()) {
      setError(t.testimonials.formError);
      return;
    }

    const nowLabel = new Date().toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      month: 'long',
      year: 'numeric',
    });

    onAddTestimonial({
      id: `t-${Date.now()}`,
      patientName: patientName.trim(),
      roleAndArea: roleAndArea.trim(),
      visitType,
      dateLabel: nowLabel,
      outcomeSummary: outcomeSummary.trim() || t.testimonials.defaultOutcome,
      quote: quote.trim(),
    });

    setPatientName('');
    setRoleAndArea('');
    setOutcomeSummary('');
    setQuote('');
    setError('');
    setIsFormOpen(false);
    setSubmittedNote(true);
    setTimeout(() => setSubmittedNote(false), 4000);
  };

  return (
    <section id="testimonials" className="bg-[#F5F5F7] py-16 sm:py-24 border-b border-black/[0.06]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-xl">
            <p className="text-xs sm:text-sm font-medium text-[#6E6E73] mb-2">
              {t.testimonials.eyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#1D1D1F]">
              {t.testimonials.heading}
            </h2>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {submittedNote && (
              <span className="text-xs font-medium text-[#15803D]">
                {t.testimonials.publishedNote}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#FBFBFD] text-[#1D1D1F] border border-black/[0.1] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
            >
              {isFormOpen ? (
                <>
                  <X className="w-4 h-4" />
                  {t.testimonials.closeFormBtn}
                </>
              ) : (
                <>
                  <MessageSquarePlus className="w-4 h-4 text-[#0071E3]" />
                  {t.testimonials.shareBtn}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional Patient Feedback Form */}
        {isFormOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 bg-white rounded-2xl p-6 sm:p-8 border border-black/[0.08]"
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-[#1D1D1F]">
                  {t.testimonials.formTitle}
                </h3>
                <p className="text-sm text-[#6E6E73] mt-0.5">
                  {t.testimonials.formSubtitle}
                </p>
              </div>
            </div>

            {error && (
              <p className="mb-4 text-sm text-[#DC2626] font-medium" role="alert">
                {error}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="review-name" className="block text-xs font-medium text-[#424245] mb-1.5">
                  {t.testimonials.labelName}
                </label>
                <input
                  id="review-name"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder={t.testimonials.placeholderName}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#0071E3]"
                />
              </div>

              <div>
                <label htmlFor="review-area" className="block text-xs font-medium text-[#424245] mb-1.5">
                  {t.testimonials.labelArea}
                </label>
                <input
                  id="review-area"
                  type="text"
                  value={roleAndArea}
                  onChange={(e) => setRoleAndArea(e.target.value)}
                  placeholder={t.testimonials.placeholderArea}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#0071E3]"
                />
              </div>

              <div>
                <label htmlFor="review-visit" className="block text-xs font-medium text-[#424245] mb-1.5">
                  {t.testimonials.labelVisitType}
                </label>
                <select
                  id="review-visit"
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#0071E3]"
                >
                  {t.testimonials.visitOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="review-outcome" className="block text-xs font-medium text-[#424245] mb-1.5">
                  {t.testimonials.labelOutcome}
                </label>
                <input
                  id="review-outcome"
                  type="text"
                  value={outcomeSummary}
                  onChange={(e) => setOutcomeSummary(e.target.value)}
                  placeholder={t.testimonials.placeholderOutcome}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#0071E3]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="review-quote" className="block text-xs font-medium text-[#424245] mb-1.5">
                {t.testimonials.labelQuote}
              </label>
              <textarea
                id="review-quote"
                rows={3}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder={t.testimonials.placeholderQuote}
                className="w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#0071E3]"
              />
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="bg-[#0071E3] hover:bg-[#0062C4] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                {t.testimonials.submitBtn}
              </button>
            </div>
          </form>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => {
            const localized =
              t.testimonials.initialItems[
                item.id as keyof typeof t.testimonials.initialItems
              ];
            const displayItem = localized ?? item;

            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-black/[0.07] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#6E6E73] mb-4">
                    <span>{displayItem.visitType}</span>
                    <span className="tabular-nums">{displayItem.dateLabel}</span>
                  </div>

                  <Quote className="w-5 h-5 text-[#0071E3]/60 mb-3" />

                  <blockquote className="text-sm sm:text-[15px] text-[#1D1D1F] leading-relaxed">
                    &ldquo;{displayItem.quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-6 pt-4 border-t border-black/[0.06]">
                  <p className="text-xs font-medium text-[#15803D] mb-2">
                    {t.testimonials.outcomePrefix} {displayItem.outcomeSummary}
                  </p>
                  <p className="font-display text-sm font-semibold text-[#1D1D1F]">
                    {displayItem.patientName}
                  </p>
                  <p className="text-xs text-[#6E6E73] mt-0.5">{displayItem.roleAndArea}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
