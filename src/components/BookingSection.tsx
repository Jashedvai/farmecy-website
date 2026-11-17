import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Home,
  Printer,
  RefreshCw,
  Search,
  Stethoscope,
  X,
  XCircle,
} from 'lucide-react';
import {
  ALL_TIME_SLOTS,
  CLINIC_INFO,
  CONSULTATION_REASONS,
  TIME_SLOT_GROUPS,
  formatLocalDateISO,
  formatReadableDate,
  getNextOpenDateISO,
  getUpcomingOpenDates,
  isFridayISO,
} from '../data/clinicData';
import { useLanguage } from '../i18n/LanguageContext';
import type { Appointment, AppointmentStatus, VisitType } from '../types/clinic';
import { CounterQrCard } from './CounterQrCard';
import { DoctorPortrait } from './DoctorPortrait';

interface BookingSectionProps {
  appointments: Appointment[];
  selectedVisitType: VisitType;
  selectedReason: string;
  onChangeVisitType: (visitType: VisitType) => void;
  onChangeReason: (reason: string) => void;
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onRescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => void;
  onResetSchedule: () => void;
}

export function BookingSection({
  appointments,
  selectedVisitType,
  selectedReason,
  onChangeVisitType,
  onChangeReason,
  onAddAppointment,
  onUpdateStatus,
  onRescheduleAppointment,
  onResetSchedule,
}: BookingSectionProps) {
  const { lang, t } = useLanguage();
  const todayISO = formatLocalDateISO(new Date());
  const upcomingOpenDates = useMemo(() => getUpcomingOpenDates(5, lang), [lang]);

  // Form state
  const [selectedDate, setSelectedDate] = useState<string>(() => getNextOpenDateISO());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [recentBooking, setRecentBooking] = useState<Appointment | null>(null);

  // Dashboard filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [visitFilter, setVisitFilter] = useState<'all' | VisitType>('all');

  // Modals
  const [slipAppointment, setSlipAppointment] = useState<Appointment | null>(null);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleSlot, setRescheduleSlot] = useState<string>('');
  const [rescheduleError, setRescheduleError] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState(false);

  const isSelectedFriday = isFridayISO(selectedDate);

  const getLocalizedReason = (canonicalReason: string) => {
    const idx = CONSULTATION_REASONS.indexOf(canonicalReason);
    if (idx !== -1 && t.booking.reasons[idx]) {
      return t.booking.reasons[idx];
    }
    return canonicalReason;
  };

  // Occupied slots for the selected date
  const bookedSlotsForSelectedDate = useMemo(() => {
    return new Set(
      appointments
        .filter((a) => a.date === selectedDate && a.status === 'confirmed')
        .map((a) => a.timeSlot),
    );
  }, [appointments, selectedDate]);

  useEffect(() => {
    if (isSelectedFriday) {
      setSelectedSlot('');
      return;
    }
    if (!selectedSlot || bookedSlotsForSelectedDate.has(selectedSlot)) {
      const firstOpen = ALL_TIME_SLOTS.find((slot) => !bookedSlotsForSelectedDate.has(slot));
      setSelectedSlot(firstOpen ?? '');
    }
  }, [selectedDate, isSelectedFriday, bookedSlotsForSelectedDate, selectedSlot]);

  // Dashboard metrics
  const metrics = useMemo(() => {
    const active = appointments.filter((a) => a.status !== 'cancelled');
    return {
      total: appointments.length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      clinicCount: active.filter((a) => a.visitType === 'clinic').length,
      homeCount: active.filter((a) => a.visitType === 'home').length,
    };
  }, [appointments]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return [...appointments]
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return ALL_TIME_SLOTS.indexOf(a.timeSlot) - ALL_TIME_SLOTS.indexOf(b.timeSlot);
      })
      .filter((item) => {
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;
        if (visitFilter !== 'all' && item.visitType !== visitFilter) return false;
        if (!query) return true;
        return (
          item.patientName.toLowerCase().includes(query) ||
          item.phone.toLowerCase().includes(query) ||
          item.referenceCode.toLowerCase().includes(query) ||
          item.reason.toLowerCase().includes(query)
        );
      });
  }, [appointments, searchQuery, statusFilter, visitFilter]);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (isSelectedFriday) {
      setFormError(t.booking.fridayError);
      return;
    }
    if (!selectedSlot) {
      setFormError(t.booking.errors.noSlot);
      return;
    }
    if (bookedSlotsForSelectedDate.has(selectedSlot)) {
      setFormError(t.booking.errors.slotTaken);
      return;
    }
    if (patientName.trim().length < 2) {
      setFormError(t.booking.errors.invalidName);
      return;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 14) {
      setFormError(t.booking.errors.invalidPhone);
      return;
    }

    if (selectedVisitType === 'home' && homeAddress.trim().length < 5) {
      setFormError(t.booking.errors.invalidAddress);
      return;
    }

    const feeTk =
      selectedVisitType === 'clinic'
        ? CLINIC_INFO.doctor.clinicFeeTk
        : CLINIC_INFO.doctor.homeFeeTk;

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      referenceCode: `SS-2026-${randomDigits}`,
      patientName: patientName.trim(),
      phone: phone.trim(),
      age: age.trim() || '—',
      visitType: selectedVisitType,
      feeTk,
      reason: selectedReason,
      date: selectedDate,
      timeSlot: selectedSlot,
      homeAddress: selectedVisitType === 'home' ? homeAddress.trim() : undefined,
      notes: notes.trim() || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    onAddAppointment(newAppointment);
    setRecentBooking(newAppointment);
    setPatientName('');
    setPhone('');
    setAge('');
    setHomeAddress('');
    setNotes('');
  };

  const openRescheduleModal = (appointment: Appointment) => {
    setRescheduleTarget(appointment);
    setRescheduleDate(appointment.date);
    setRescheduleSlot(appointment.timeSlot);
    setRescheduleError('');
  };

  const rescheduleOccupiedSlots = useMemo(() => {
    if (!rescheduleTarget) return new Set<string>();
    return new Set(
      appointments
        .filter(
          (a) =>
            a.id !== rescheduleTarget.id &&
            a.date === rescheduleDate &&
            a.status === 'confirmed',
        )
        .map((a) => a.timeSlot),
    );
  }, [appointments, rescheduleTarget, rescheduleDate]);

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget) return;
    if (isFridayISO(rescheduleDate)) {
      setRescheduleError(t.booking.rescheduleModal.fridayError);
      return;
    }
    if (!rescheduleSlot || rescheduleOccupiedSlots.has(rescheduleSlot)) {
      setRescheduleError(t.booking.rescheduleModal.invalidSlot);
      return;
    }
    onRescheduleAppointment(rescheduleTarget.id, rescheduleDate, rescheduleSlot);
    setRescheduleTarget(null);
  };

  const handleCopySlip = async (apt: Appointment) => {
    const summary = [
      `${t.brandFull} — ${t.booking.slipModal.title}`,
      `${t.booking.slipModal.referenceId}: ${apt.referenceCode}`,
      `${t.booking.slipModal.patient}: ${apt.patientName} (${apt.phone})`,
      `${t.booking.slipModal.physician}: ${t.hero.doctorName} (${t.hero.doctorCreds})`,
      `${t.booking.slipModal.consultation}: ${
        apt.visitType === 'clinic'
          ? t.booking.slipModal.clinicVisit
          : t.booking.slipModal.homeService
      } (${apt.feeTk} ${t.currencyUnit})`,
      `${t.booking.slipModal.schedule}: ${formatReadableDate(apt.date, lang)} · ${apt.timeSlot}`,
      apt.homeAddress
        ? `${t.booking.slipModal.homeAddress}: ${apt.homeAddress}`
        : `${t.addressLine1}, ${t.addressLine2}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    } catch {
      // Clipboard unsupported
    }
  };

  const feeDisplay =
    selectedVisitType === 'clinic'
      ? lang === 'bn'
        ? '১০০ টাকা'
        : '100 Tk'
      : lang === 'bn'
      ? '২০০ টাকা'
      : '200 Tk';

  return (
    <section id="booking" className="bg-white py-16 sm:py-24 border-b border-black/[0.06]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-medium text-[#6E6E73] mb-2">
            {t.booking.eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-[-0.025em] text-[#1D1D1F]">
            {t.booking.heading}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#424245] leading-relaxed">
            {t.booking.subtitle}
          </p>
        </div>

        {/* Two-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Appointment Booking Form */}
          <div className="lg:col-span-5 bg-[#F5F5F7] rounded-3xl p-6 sm:p-8 border border-black/[0.06]">
            <div className="flex items-center justify-between gap-4 pb-5 border-b border-black/[0.08]">
              <div>
                <h3 className="font-display text-xl font-semibold text-[#1D1D1F]">
                  {t.booking.formTitle}
                </h3>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  {t.booking.formSubtitle}
                </p>
              </div>
              <span className="font-mono text-sm font-semibold text-[#0071E3] tabular-nums">
                {feeDisplay}
              </span>
            </div>

            {recentBooking && (
              <div className="mt-5 bg-white rounded-2xl p-4 border border-[#15803D]/25">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#15803D] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-[#1D1D1F]">
                        {t.booking.confirmedTitle}
                      </p>
                      <p className="text-xs text-[#424245] mt-0.5 tabular-nums">
                        {t.booking.confirmedRef}{' '}
                        <span className="font-mono font-medium">{recentBooking.referenceCode}</span> ·{' '}
                        {formatReadableDate(recentBooking.date, lang)} · {recentBooking.timeSlot}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRecentBooking(null)}
                    aria-label="Dismiss confirmation"
                    className="text-[#6E6E73] hover:text-[#1D1D1F] p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-black/[0.06] flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSlipAppointment(recentBooking)}
                    className="text-xs font-medium text-[#0071E3] hover:text-[#005BB5] cursor-pointer"
                  >
                    {t.booking.viewSlipLink}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleBookSubmit} className="mt-6 space-y-5">
              {/* Visit Type Segmented Control */}
              <div>
                <span className="block text-xs font-medium text-[#424245] mb-2">
                  {t.booking.consultationTypeLabel}
                </span>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/[0.05] rounded-xl">
                  <button
                    type="button"
                    onClick={() => onChangeVisitType('clinic')}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      selectedVisitType === 'clinic'
                        ? 'bg-white text-[#1D1D1F] shadow-sm'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    {t.booking.clinicOption}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeVisitType('home')}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                      selectedVisitType === 'home'
                        ? 'bg-white text-[#1D1D1F] shadow-sm'
                        : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    {t.booking.homeOption}
                  </button>
                </div>
              </div>

              {/* Reason Selector */}
              <div>
                <label htmlFor="booking-reason" className="block text-xs font-medium text-[#424245] mb-1.5">
                  {t.booking.reasonLabel}
                </label>
                <select
                  id="booking-reason"
                  value={selectedReason}
                  onChange={(e) => onChangeReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                >
                  {CONSULTATION_REASONS.map((canonicalReason, idx) => (
                    <option key={canonicalReason} value={canonicalReason}>
                      {t.booking.reasons[idx] ?? canonicalReason}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Picker + Quick Open Dates */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <label htmlFor="booking-date" className="text-xs font-medium text-[#424245]">
                    {t.booking.dateLabel}
                  </label>
                  <span className="text-[11px] text-[#6E6E73]">{t.booking.closedFridaysNote}</span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 mb-2.5">
                  {upcomingOpenDates.map((d) => {
                    const active = selectedDate === d.iso;
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setSelectedDate(d.iso)}
                        className={`py-2 px-1.5 rounded-xl text-center border transition-all cursor-pointer ${
                          active
                            ? 'bg-[#0071E3] text-white border-[#0071E3]'
                            : 'bg-white text-[#1D1D1F] border-black/[0.08] hover:border-black/20'
                        }`}
                      >
                        <span className={`block text-[10px] font-medium ${active ? 'text-white/85' : 'text-[#6E6E73]'}`}>
                          {d.dayName}
                        </span>
                        <span className="block text-xs font-semibold tabular-nums mt-0.5">
                          {d.shortDate}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <input
                  id="booking-date"
                  type="date"
                  min={todayISO}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono bg-white border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] tabular-nums"
                />

                {isSelectedFriday && (
                  <p className="mt-2 text-xs font-medium text-[#B45309]" role="alert">
                    {t.booking.fridayError}
                  </p>
                )}
              </div>

              {/* Live Time Slot Grid */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-[#424245]">
                    {t.booking.slotLabel}
                  </span>
                  <span className="text-[11px] text-[#6E6E73] tabular-nums">
                    {ALL_TIME_SLOTS.length - bookedSlotsForSelectedDate.size} {t.booking.openCountSuffix}
                  </span>
                </div>

                <div className="space-y-3 bg-white rounded-2xl p-3.5 border border-black/[0.07]">
                  {TIME_SLOT_GROUPS.map((group) => (
                    <div key={group.period}>
                      <p className="text-[11px] font-medium text-[#6E6E73] mb-1.5">
                        {t.booking.periods[group.period]}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-1.5">
                        {group.slots.map((slot) => {
                          const isBooked = bookedSlotsForSelectedDate.has(slot);
                          const isSelected = selectedSlot === slot && !isSelectedFriday;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBooked || isSelectedFriday}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-2 px-2 rounded-lg text-xs font-mono tabular-nums transition-all border whitespace-nowrap ${
                                isBooked || isSelectedFriday
                                  ? 'bg-[#F5F5F7] text-[#A1A1A6] border-transparent line-through cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-[#0071E3] text-white border-[#0071E3] font-medium cursor-pointer'
                                  : 'bg-[#FBFBFD] text-[#1D1D1F] border-black/[0.08] hover:border-[#0071E3]/50 cursor-pointer'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Info Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label htmlFor="patient-name" className="block text-xs font-medium text-[#424245] mb-1.5">
                    {t.booking.patientNameLabel}
                  </label>
                  <input
                    id="patient-name"
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={t.booking.patientNamePlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                  />
                </div>
                <div>
                  <label htmlFor="patient-age" className="block text-xs font-medium text-[#424245] mb-1.5">
                    {t.booking.ageLabel}
                  </label>
                  <input
                    id="patient-age"
                    type="number"
                    min={0}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="34"
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="patient-phone" className="block text-xs font-medium text-[#424245] mb-1.5">
                  {t.booking.phoneLabel}
                </label>
                <input
                  id="patient-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="018XXXXXXXX"
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] tabular-nums"
                />
              </div>

              {selectedVisitType === 'home' && (
                <div>
                  <label htmlFor="home-address" className="block text-xs font-medium text-[#424245] mb-1.5">
                    {t.booking.homeAddressLabel}
                  </label>
                  <input
                    id="home-address"
                    type="text"
                    required
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder={t.booking.homeAddressPlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                  />
                </div>
              )}

              <div>
                <label htmlFor="patient-notes" className="block text-xs font-medium text-[#424245] mb-1.5">
                  {t.booking.notesLabel}
                </label>
                <textarea
                  id="patient-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.booking.notesPlaceholder}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                />
              </div>

              {formError && (
                <p className="text-xs font-medium text-[#DC2626]" role="alert">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSelectedFriday || !selectedSlot}
                className="w-full bg-[#0071E3] hover:bg-[#0062C4] disabled:bg-[#A1A1A6] text-white text-sm font-medium py-3.5 px-5 rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] focus-visible:ring-offset-2"
              >
                {t.booking.submitBtnPrefix} · {feeDisplay}
              </button>
            </form>
          </div>

          {/* RIGHT: Modern Booking Dashboard */}
          <div className="lg:col-span-7 bg-[#FBFBFD] rounded-3xl p-6 sm:p-8 border border-black/[0.07]">
            {/* Dashboard Opening with Dr. Jashim Uddin Portrait */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.08]">
              <div className="flex items-center gap-4">
                <DoctorPortrait size="md" />
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#1D1D1F]">
                    {t.booking.dashboardTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#424245] mt-0.5">
                    {t.booking.dashboardDoctorMeta}
                  </p>
                  <p className="text-xs text-[#6E6E73] mt-0.5">
                    {t.booking.dashboardSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onResetSchedule}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6E6E73] hover:text-[#1D1D1F] transition-colors self-start sm:self-auto cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {t.booking.resetSchedule}
              </button>
            </div>

            {/* 4-Column Tabular KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-black/[0.08]">
              <div>
                <span className="block text-xs text-[#6E6E73]">{t.booking.kpiTotal}</span>
                <span className="font-mono text-2xl font-semibold text-[#1D1D1F] tabular-nums mt-0.5 block">
                  {metrics.total}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#6E6E73]">{t.booking.kpiConfirmed}</span>
                <span className="font-mono text-2xl font-semibold text-[#15803D] tabular-nums mt-0.5 block">
                  {metrics.confirmed}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#6E6E73]">{t.booking.kpiClinic}</span>
                <span className="font-mono text-2xl font-semibold text-[#1D1D1F] tabular-nums mt-0.5 block">
                  {metrics.clinicCount}
                </span>
              </div>
              <div>
                <span className="block text-xs text-[#6E6E73]">{t.booking.kpiHome}</span>
                <span className="font-mono text-2xl font-semibold text-[#0071E3] tabular-nums mt-0.5 block">
                  {metrics.homeCount}
                </span>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="py-5 space-y-3 border-b border-black/[0.08]">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#6E6E73] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label={t.booking.searchPlaceholder}
                    placeholder={t.booking.searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                  />
                </div>

                <select
                  aria-label={t.booking.allVisitTypes}
                  value={visitFilter}
                  onChange={(e) => setVisitFilter(e.target.value as 'all' | VisitType)}
                  className="px-3.5 py-2.5 text-sm bg-white border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:border-[#0071E3]"
                >
                  <option value="all">{t.booking.allVisitTypes}</option>
                  <option value="clinic">{t.booking.clinicFilterOption}</option>
                  <option value="home">{t.booking.homeFilterOption}</option>
                </select>
              </div>

              {/* Segmented Status Filter */}
              <div className="flex flex-wrap items-center gap-1 p-1 bg-black/[0.04] rounded-xl w-fit">
                {(
                  [
                    { id: 'all', label: t.booking.statusTabs.all },
                    { id: 'confirmed', label: t.booking.statusTabs.confirmed },
                    { id: 'completed', label: t.booking.statusTabs.completed },
                    { id: 'cancelled', label: t.booking.statusTabs.cancelled },
                  ] as const
                ).map((tab) => {
                  const active = statusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-white text-[#1D1D1F] shadow-sm'
                          : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Appointment Rows */}
            <div className="divide-y divide-black/[0.06]">
              {filteredAppointments.length === 0 ? (
                <div className="py-12 text-center">
                  <Calendar className="w-8 h-8 text-[#A1A1A6] mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-[#1D1D1F]">
                    {t.booking.emptyTitle}
                  </p>
                  <p className="text-xs text-[#6E6E73] mt-1">
                    {t.booking.emptySubtitle}
                  </p>
                  {(searchQuery || statusFilter !== 'all' || visitFilter !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                        setVisitFilter('all');
                      }}
                      className="mt-4 text-xs font-medium text-[#0071E3] hover:text-[#005BB5] cursor-pointer"
                    >
                      {t.booking.clearFilters}
                    </button>
                  )}
                </div>
              ) : (
                filteredAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/[0.015] -mx-3 px-3 rounded-xl transition-colors"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#6E6E73]">
                        <span className="font-mono font-medium text-[#1D1D1F] tabular-nums">
                          {apt.referenceCode}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {formatReadableDate(apt.date, lang)} · {apt.timeSlot}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {apt.visitType === 'clinic' ? t.booking.clinicShort : t.booking.homeShort} ({apt.feeTk} {t.currencyUnit})
                        </span>
                      </div>

                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p className="font-display text-base font-semibold text-[#1D1D1F] truncate">
                          {apt.patientName}
                        </p>
                        <span className="font-mono text-xs text-[#6E6E73] tabular-nums">
                          {apt.phone}
                        </span>
                      </div>

                      <p className="text-xs text-[#424245]">
                        {getLocalizedReason(apt.reason)}
                        {apt.homeAddress ? ` — ${apt.homeAddress}` : ''}
                      </p>
                    </div>

                    <div className="flex flex-wrap sm:flex-col sm:items-end justify-between gap-2.5 shrink-0">
                      <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                        {apt.status === 'confirmed' && (
                          <>
                            <Clock className="w-3.5 h-3.5 text-[#0071E3]" />
                            <span className="text-[#0071E3]">{t.booking.statusTabs.confirmed}</span>
                          </>
                        )}
                        {apt.status === 'completed' && (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                            <span className="text-[#15803D]">{t.booking.statusTabs.completed}</span>
                          </>
                        )}
                        {apt.status === 'cancelled' && (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                            <span className="text-[#DC2626]">{t.booking.statusTabs.cancelled}</span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSlipAppointment(apt)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#424245] hover:text-[#1D1D1F] px-2.5 py-1.5 rounded-lg bg-white border border-black/[0.08] transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <FileText className="w-3 h-3" />
                          {t.booking.actions.slip}
                        </button>

                        {apt.status === 'confirmed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => openRescheduleModal(apt)}
                              className="text-xs font-medium text-[#0071E3] hover:text-[#005BB5] px-2.5 py-1.5 rounded-lg bg-white border border-black/[0.08] transition-colors cursor-pointer whitespace-nowrap"
                            >
                              {t.booking.actions.reschedule}
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(apt.id, 'completed')}
                              className="text-xs font-medium text-[#15803D] hover:text-[#166534] px-2.5 py-1.5 rounded-lg bg-white border border-black/[0.08] transition-colors cursor-pointer whitespace-nowrap"
                            >
                              {t.booking.actions.complete}
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(apt.id, 'cancelled')}
                              className="text-xs font-medium text-[#DC2626] hover:text-[#B91C1C] px-2.5 py-1.5 rounded-lg bg-white border border-black/[0.08] transition-colors cursor-pointer whitespace-nowrap"
                            >
                              {t.booking.actions.cancel}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Counter Scan-to-Book QR Code Card */}
        <div className="mt-8">
          <CounterQrCard />
        </div>
      </div>

      {/* Confirmation Slip Modal */}
      {slipAppointment && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="slip-modal-title"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="print-surface bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-black/[0.08] shadow-xl">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-black/[0.08]">
              <div className="flex items-center gap-3">
                <DoctorPortrait size="sm" />
                <div>
                  <p className="text-xs font-medium text-[#6E6E73]">{t.brandFull}</p>
                  <h3 id="slip-modal-title" className="font-display text-xl font-semibold text-[#1D1D1F] mt-0.5">
                    {t.booking.slipModal.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSlipAppointment(null)}
                aria-label="Close modal"
                className="no-print w-9 h-9 rounded-full flex items-center justify-center text-[#6E6E73] hover:bg-[#F5F5F7] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-[#6E6E73]">{t.booking.slipModal.referenceId}</dt>
                <dd className="font-mono font-semibold text-[#1D1D1F] tabular-nums">
                  {slipAppointment.referenceCode}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6E6E73]">{t.booking.slipModal.patient}</dt>
                <dd className="font-medium text-[#1D1D1F] text-right">
                  {slipAppointment.patientName} ({slipAppointment.age} {t.booking.slipModal.years})
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6E6E73]">{t.booking.slipModal.mobile}</dt>
                <dd className="font-mono text-[#1D1D1F] tabular-nums">{slipAppointment.phone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6E6E73]">{t.booking.slipModal.physician}</dt>
                <dd className="font-medium text-[#1D1D1F] text-right">
                  {t.hero.doctorName} ({t.hero.doctorCreds})
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6E6E73]">{t.booking.slipModal.schedule}</dt>
                <dd className="font-mono text-[#1D1D1F] text-right tabular-nums">
                  {formatReadableDate(slipAppointment.date, lang)} · {slipAppointment.timeSlot}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6E6E73]">{t.booking.slipModal.consultation}</dt>
                <dd className="font-medium text-[#1D1D1F] text-right">
                  {slipAppointment.visitType === 'clinic'
                    ? t.booking.slipModal.clinicVisit
                    : t.booking.slipModal.homeService}{' '}
                  · <span className="font-mono tabular-nums">{slipAppointment.feeTk} {t.currencyUnit}</span>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#6E6E73]">{t.booking.slipModal.reason}</dt>
                <dd className="text-[#1D1D1F] text-right">
                  {getLocalizedReason(slipAppointment.reason)}
                </dd>
              </div>
              {slipAppointment.homeAddress && (
                <div className="pt-2 border-t border-black/[0.06]">
                  <dt className="text-xs text-[#6E6E73] mb-1">{t.booking.slipModal.homeAddress}</dt>
                  <dd className="text-[#1D1D1F]">{slipAppointment.homeAddress}</dd>
                </div>
              )}
              {slipAppointment.notes && (
                <div className="pt-2 border-t border-black/[0.06]">
                  <dt className="text-xs text-[#6E6E73] mb-1">{t.booking.slipModal.notes}</dt>
                  <dd className="text-[#424245]">{slipAppointment.notes}</dd>
                </div>
              )}
              <div className="pt-3 border-t border-black/[0.06] text-xs text-[#6E6E73]">
                {t.addressLine1}, {t.addressLine2} · {CLINIC_INFO.phone}
              </div>
            </dl>

            <div className="no-print mt-6 pt-4 border-t border-black/[0.08] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleCopySlip(slipAppointment)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#EAEAEF] px-4 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedRef ? t.booking.slipModal.copiedSummary : t.booking.slipModal.copyDetails}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-white bg-[#0071E3] hover:bg-[#0062C4] px-4 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                {t.booking.slipModal.printSlip}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reschedule-modal-title"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <form
            onSubmit={handleConfirmReschedule}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-black/[0.08] shadow-xl"
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-black/[0.08]">
              <div>
                <p className="text-xs font-mono text-[#6E6E73] tabular-nums">
                  {rescheduleTarget.referenceCode}
                </p>
                <h3 id="reschedule-modal-title" className="font-display text-xl font-semibold text-[#1D1D1F] mt-0.5">
                  {t.booking.rescheduleModal.titlePrefix} {rescheduleTarget.patientName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                aria-label="Close reschedule modal"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#6E6E73] hover:bg-[#F5F5F7] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="reschedule-date" className="block text-xs font-medium text-[#424245] mb-1.5">
                  {t.booking.rescheduleModal.newDateLabel}
                </label>
                <input
                  id="reschedule-date"
                  type="date"
                  min={todayISO}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-mono bg-[#F5F5F7] border border-black/[0.08] rounded-xl text-[#1D1D1F] focus:outline-none focus:bg-white focus:border-[#0071E3] tabular-nums"
                />
                {isFridayISO(rescheduleDate) && (
                  <p className="mt-1.5 text-xs font-medium text-[#B45309]">
                    {t.booking.rescheduleModal.fridayError}
                  </p>
                )}
              </div>

              <div>
                <span className="block text-xs font-medium text-[#424245] mb-1.5">
                  {t.booking.rescheduleModal.newSlotLabel}
                </span>
                <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto p-1">
                  {ALL_TIME_SLOTS.map((slot) => {
                    const occupied = rescheduleOccupiedSlots.has(slot);
                    const active = rescheduleSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={occupied || isFridayISO(rescheduleDate)}
                        onClick={() => setRescheduleSlot(slot)}
                        className={`py-2 px-2 rounded-lg text-xs font-mono tabular-nums border transition-colors ${
                          occupied || isFridayISO(rescheduleDate)
                            ? 'bg-[#F5F5F7] text-[#A1A1A6] border-transparent line-through cursor-not-allowed'
                            : active
                            ? 'bg-[#0071E3] text-white border-[#0071E3] cursor-pointer'
                            : 'bg-white text-[#1D1D1F] border-black/[0.08] hover:border-[#0071E3] cursor-pointer'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {rescheduleError && (
                <p className="text-xs font-medium text-[#DC2626]" role="alert">
                  {rescheduleError}
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.08] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="text-sm font-medium text-[#6E6E73] hover:text-[#1D1D1F] px-4 py-2 cursor-pointer"
              >
                {t.booking.rescheduleModal.cancel}
              </button>
              <button
                type="submit"
                className="bg-[#0071E3] hover:bg-[#0062C4] text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors cursor-pointer"
              >
                {t.booking.rescheduleModal.save}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
