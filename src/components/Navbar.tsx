import { useEffect, useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface NavbarProps {
  onBookClick: () => void;
}

export function Navbar({ onBookClick }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  const navLinks = [
    { id: 'services', label: t.nav.services, href: '#services' },
    { id: 'doctor', label: t.nav.doctor, href: '#doctor' },
    { id: 'testimonials', label: t.nav.testimonials, href: '#testimonials' },
    { id: 'booking', label: t.nav.dashboard, href: '#booking' },
    { id: 'location', label: t.nav.location, href: '#location' },
  ];

  useEffect(() => {
    const sections = ['services', 'doctor', 'testimonials', 'booking', 'location']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: [0.1, 0.4] },
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-black/[0.08]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="font-display text-lg font-semibold tracking-tight text-[#1D1D1F] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded"
        >
          {t.brandShort}
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {navLinks.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'location' : undefined}
                className={`text-sm font-medium transition-colors whitespace-nowrap shrink-0 py-1 border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] rounded ${
                  isActive
                    ? 'text-[#1D1D1F] border-[#0071E3]'
                    : 'text-[#424245] border-transparent hover:text-[#1D1D1F] hover:border-[#1D1D1F]/30'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action (+ mobile menu trigger on small screens) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onBookClick}
            className="hidden sm:inline-flex items-center justify-center bg-[#0071E3] hover:bg-[#0062C4] active:scale-[0.98] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-full transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2"
          >
            {t.nav.bookVisit}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-black/[0.06] px-4 py-4 space-y-1">
          {navLinks.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => handleNavClick(item.href)}
              className={`w-full text-left px-3 py-3 text-base font-medium rounded-xl transition-colors cursor-pointer ${
                activeId === item.id
                  ? 'bg-[#F5F5F7] text-[#0071E3]'
                  : 'text-[#1D1D1F] hover:bg-[#F5F5F7]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Language Toggle */}
          <div className="pt-2 pb-1 flex items-center justify-between px-3 py-2 border-t border-black/[0.06]">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6E73]">
              <Globe className="w-3.5 h-3.5" />
              Language / ভাষা
            </span>
            <div className="inline-flex items-center gap-1 p-1 bg-[#F5F5F7] rounded-lg">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  lang === 'en' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#6E6E73]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('bn')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  lang === 'bn' ? 'bg-white text-[#1D1D1F] shadow-sm' : 'text-[#6E6E73]'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onBookClick();
              }}
              className="w-full bg-[#0071E3] hover:bg-[#0062C4] text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors cursor-pointer"
            >
              {t.nav.bookVisit}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
