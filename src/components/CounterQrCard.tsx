import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, Download, Printer, QrCode, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { DoctorPortrait } from './DoctorPortrait';

interface CounterQrCardProps {
  compact?: boolean;
}

export function CounterQrCard({ compact = false }: CounterQrCardProps) {
  const { t } = useLanguage();
  const defaultBookingUrl = useMemo(() => {
    if (typeof window === 'undefined') return 'https://sahensah.clinic/#booking';
    return `${window.location.origin}${window.location.pathname}#booking`;
  }, []);

  const [targetUrl, setTargetUrl] = useState(defaultBookingUrl);
  const [qrSvg, setQrSvg] = useState<string>('');
  const [qrPngUrl, setQrPngUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const urlToEncode = targetUrl.trim() || defaultBookingUrl;

    Promise.all([
      QRCode.toString(urlToEncode, {
        type: 'svg',
        margin: 2,
        width: 240,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#1D1D1F',
          light: '#FFFFFF',
        },
      }),
      QRCode.toDataURL(urlToEncode, {
        margin: 3,
        width: 1024,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#1D1D1F',
          light: '#FFFFFF',
        },
      }),
    ])
      .then(([svg, png]) => {
        if (!active) return;
        setQrSvg(svg);
        setQrPngUrl(png);
      })
      .catch(() => {
        // Ignore transient invalid input while typing
      });

    return () => {
      active = false;
    };
  }, [targetUrl, defaultBookingUrl]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl.trim() || defaultBookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard fallback ignored
    }
  };

  const handleDownloadPng = () => {
    if (!qrPngUrl) return;
    const link = document.createElement('a');
    link.href = qrPngUrl;
    link.download = 'sahen-sah-counter-booking-qr.png';
    link.click();
  };

  const handleDownloadSvg = () => {
    if (!qrSvg) return;
    const blob = new Blob([qrSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sahen-sah-counter-booking-qr.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-[#F5F5F7] rounded-2xl p-5 sm:p-6 border border-black/[0.06]">
        <div className={`flex flex-col ${compact ? 'sm:flex-row' : 'md:flex-row'} items-start sm:items-center justify-between gap-6`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium text-[#0071E3] mb-1.5">
              <QrCode className="w-4 h-4 shrink-0" />
              {t.qr.eyebrow}
            </div>
            <h4 className="font-display text-lg font-semibold text-[#1D1D1F]">
              {t.qr.heading}
            </h4>
            <p className="text-xs sm:text-sm text-[#424245] mt-1 leading-relaxed">
              {t.qr.description}
            </p>

            <div className="mt-4">
              <label htmlFor="counter-qr-url" className="block text-[11px] font-medium text-[#6E6E73] mb-1">
                {t.qr.urlLabel}
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="counter-qr-url"
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 text-xs font-mono bg-white border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                />
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white hover:bg-[#FBFBFD] text-[#1D1D1F] border border-black/[0.08] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#15803D]" />
                      {t.qr.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      {t.qr.copyLink}
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-[#0071E3] hover:bg-[#0062C4] text-white rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {t.qr.downloadPng}
              </button>
              <button
                type="button"
                onClick={handleDownloadSvg}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white hover:bg-[#FBFBFD] text-[#1D1D1F] border border-black/[0.08] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {t.qr.svg}
              </button>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-white hover:bg-[#FBFBFD] text-[#1D1D1F] border border-black/[0.08] rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                {t.qr.standeeBtn}
              </button>
            </div>
          </div>

          {/* Real Scannable QR Preview */}
          <div className="bg-white p-3.5 rounded-2xl border border-black/[0.08] flex flex-col items-center shrink-0 self-center sm:self-auto">
            {qrSvg ? (
              <div
                aria-label={t.qr.scanLabel}
                className="w-36 h-36 sm:w-40 sm:h-40 [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            ) : (
              <div className="w-36 h-36 sm:w-40 sm:h-40 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-xs text-[#6E6E73]">
                {t.qr.generating}
              </div>
            )}
            <span className="mt-2 text-[11px] font-medium text-[#1D1D1F]">
              {t.qr.scanLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Printable Counter Standee Modal */}
      {isPrintModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="counter-standee-title"
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="print-surface bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 border border-black/[0.08] shadow-2xl text-center">
            <div className="no-print flex items-center justify-between pb-4 border-b border-black/[0.06]">
              <span className="text-xs font-medium text-[#6E6E73]">{t.qr.modalHeader}</span>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                aria-label="Close counter standee"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6E6E73] hover:bg-[#F5F5F7] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-5">
              <p className="text-xs font-medium text-[#0071E3]">{t.brandFull}</p>
              <h3 id="counter-standee-title" className="font-display text-xl font-semibold text-[#1D1D1F] mt-1">
                {t.qr.modalTitle}
              </h3>

              <div className="mt-4 flex items-center justify-center gap-3 text-left bg-[#F5F5F7] p-3 rounded-2xl">
                <DoctorPortrait size="sm" />
                <div>
                  <p className="font-display text-sm font-semibold text-[#1D1D1F]">
                    {t.hero.doctorName}
                  </p>
                  <p className="text-xs text-[#6E6E73]">
                    {t.qr.modalDoctorMeta}
                  </p>
                </div>
              </div>

              <div className="mt-5 inline-block bg-white p-3 rounded-2xl border border-black/[0.1]">
                {qrSvg && (
                  <div
                    className="w-48 h-48 [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: qrSvg }}
                  />
                )}
              </div>

              <p className="mt-3 text-xs text-[#424245]">
                {t.qr.modalInstruction}
              </p>
              <p className="mt-1 font-mono text-[11px] text-[#6E6E73] tabular-nums">
                {t.qr.modalFeeLine}
              </p>
            </div>

            <div className="no-print mt-6 pt-4 border-t border-black/[0.06] flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-[#F5F5F7] hover:bg-[#EAEAEF] text-[#1D1D1F] px-4 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                {t.qr.savePng}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium bg-[#0071E3] hover:bg-[#0062C4] text-white px-4 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                {t.qr.printCard}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
