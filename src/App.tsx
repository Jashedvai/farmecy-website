import { useEffect, useMemo, useState } from 'react';
import { BookingSection } from './components/BookingSection';
import { DoctorSection } from './components/DoctorSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { LocationContactSection } from './components/LocationContactSection';
import { Navbar } from './components/Navbar';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import {
  ALL_TIME_SLOTS,
  CONSULTATION_REASONS,
  INITIAL_TESTIMONIALS,
  createInitialAppointments,
  getNextOpenDateISO,
} from './data/clinicData';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import type { Appointment, AppointmentStatus, Testimonial, VisitType } from './types/clinic';

const APPOINTMENTS_STORAGE_KEY = 'sahen_sah_appointments_v1';
const TESTIMONIALS_STORAGE_KEY = 'sahen_sah_testimonials_v1';

function ClinicWebsite() {
  const { lang } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to default schedule
    }
    return createInitialAppointments();
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try {
      const saved = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to default reviews
    }
    return INITIAL_TESTIMONIALS;
  });

  const [selectedVisitType, setSelectedVisitType] = useState<VisitType>('clinic');
  const [selectedReason, setSelectedReason] = useState<string>(CONSULTATION_REASONS[0]);

  useEffect(() => {
    try {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    } catch {
      // Ignore storage quota errors
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(testimonials));
    } catch {
      // Ignore storage quota errors
    }
  }, [testimonials]);

  useEffect(() => {
    if (window.location.hash === '#booking') {
      requestAnimationFrame(() => {
        document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectServiceForBooking = (reason: string, visitType: VisitType) => {
    setSelectedReason(reason);
    setSelectedVisitType(visitType);
    scrollToSection('booking');
  };

  const handleSelectVisitTypeFromDoctor = (visitType: VisitType) => {
    setSelectedVisitType(visitType);
    if (visitType === 'home') {
      setSelectedReason('Home Medical Visit');
    } else if (selectedReason === 'Home Medical Visit') {
      setSelectedReason(CONSULTATION_REASONS[0]);
    }
    scrollToSection('booking');
  };

  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const handleUpdateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );
  };

  const handleRescheduleAppointment = (id: string, newDate: string, newTimeSlot: string) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, date: newDate, timeSlot: newTimeSlot } : item,
      ),
    );
  };

  const handleResetSchedule = () => {
    const defaults = createInitialAppointments();
    setAppointments(defaults);
  };

  const handleAddTestimonial = (testimonial: Testimonial) => {
    setTestimonials((prev) => [testimonial, ...prev]);
  };

  const nextOpenSlotLabel = useMemo(() => {
    const nextDate = getNextOpenDateISO();
    const bookedSet = new Set(
      appointments
        .filter((a) => a.date === nextDate && a.status === 'confirmed')
        .map((a) => a.timeSlot),
    );
    const firstSlot = ALL_TIME_SLOTS.find((slot) => !bookedSet.has(slot)) ?? '09:30 AM';
    const dtParts = nextDate.split('-').map(Number);
    const dt = new Date(dtParts[0], dtParts[1] - 1, dtParts[2]);
    const dayStr = dt.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return `${dayStr} · ${firstSlot}`;
  }, [appointments, lang]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1D1D1F]">
      <Navbar onBookClick={() => scrollToSection('booking')} />

      <main className="flex-1">
        <HeroSection
          onBookConsultation={() => scrollToSection('booking')}
          onExploreServices={() => scrollToSection('services')}
          nextOpenSlotLabel={nextOpenSlotLabel}
        />

        <ServicesSection onSelectServiceForBooking={handleSelectServiceForBooking} />

        <DoctorSection onSelectVisitType={handleSelectVisitTypeFromDoctor} />

        <TestimonialsSection
          testimonials={testimonials}
          onAddTestimonial={handleAddTestimonial}
        />

        <BookingSection
          appointments={appointments}
          selectedVisitType={selectedVisitType}
          selectedReason={selectedReason}
          onChangeVisitType={setSelectedVisitType}
          onChangeReason={setSelectedReason}
          onAddAppointment={handleAddAppointment}
          onUpdateStatus={handleUpdateStatus}
          onRescheduleAppointment={handleRescheduleAppointment}
          onResetSchedule={handleResetSchedule}
        />

        <LocationContactSection />

        <FaqSection onBookClick={() => scrollToSection('booking')} />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ClinicWebsite />
    </LanguageProvider>
  );
}
