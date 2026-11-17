import type { Language } from '../i18n/translations';
import { TRANSLATIONS } from '../i18n/translations';
import type { Appointment, FaqItem, ServiceItem, Testimonial, TimeSlotGroup } from '../types/clinic';

export const CLINIC_INFO = {
  shortName: 'Sahen Sah',
  fullName: 'Sahen Sah J.H. Medicine Center',
  addressLine1: 'Solaiman Building (2nd Shop)',
  addressLine2: 'Harinadighi, Fatickchhari, Chittagong',
  phone: '01812901786',
  email: 'jashimuddin901786@gmail.com',
  hoursSummary: 'Saturday – Thursday · 9:00 AM – 11:00 PM',
  closedDay: 'Friday',
  establishedYear: 2004,
  doctor: {
    name: 'Dr. Jashim Uddin',
    credentials: 'L.M.F, R.M.P',
    role: 'Resident Physician & General Practitioner',
    experienceYears: '20+',
    clinicFeeTk: 100,
    homeFeeTk: 200,
    photoUrl: '/assets/aistudio/WhatsApp_Image_2026-11-17_at_10.31.09_PM_a6b8e621.jpeg',
    bio: 'Dr. Jashim Uddin has served families across Fatickchhari and Chittagong for over twenty years. Combining L.M.F and R.M.P clinical training with careful diagnostic listening, he provides primary medical consultations, chronic care monitoring, pediatric checkups, and compassionate home visits.',
    focusAreas: [
      'Acute fever, seasonal respiratory & digestive care',
      'Blood pressure, diabetes & chronic care management',
      'Pediatric & family general practice consultations',
      'Senior & mobility-limited home medical visits',
    ],
  },
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'prescription-dispensing',
    number: '01',
    title: 'Prescription Dispensing',
    category: 'pharmacy',
    categoryLabel: 'Pharmacy',
    description:
      'Accurate prescription fulfillment backed by batch verification, cold-chain storage, and clear dosage counseling.',
    availability: 'Sat – Thu · 9:00 AM – 11:00 PM',
    preparationNote: 'Bring your written prescription or previous medicine strips for interaction checks.',
    suggestedReason: 'Prescription Refill & Review',
    suggestedVisitType: 'clinic',
  },
  {
    id: 'physician-consultation',
    number: '02',
    title: 'Resident Physician Consultation',
    category: 'clinical',
    categoryLabel: 'Clinical Care',
    description:
      'In-person examination with Dr. Jashim Uddin (L.M.F, R.M.P) drawing on over 20 years of community general practice.',
    availability: 'Clinic Visit 100 Tk · Same-day slots',
    preparationNote: 'Arrive 10 minutes before your slot with any recent diagnostic reports.',
    suggestedReason: 'General Medical Consultation',
    suggestedVisitType: 'clinic',
  },
  {
    id: 'home-medical-service',
    number: '03',
    title: 'Home Medical Visit',
    category: 'clinical',
    categoryLabel: 'Clinical Care',
    description:
      'Dedicated physician home consultation across Harinadighi and nearby Fatickchhari areas for seniors and recovering patients.',
    availability: 'Home Service 200 Tk · Scheduled',
    preparationNote: 'Include a clear local landmark and active mobile number when booking.',
    suggestedReason: 'Home Medical Visit',
    suggestedVisitType: 'home',
  },
  {
    id: 'chronic-monitoring',
    number: '04',
    title: 'BP & Diabetes Screening',
    category: 'clinical',
    categoryLabel: 'Clinical Care',
    description:
      'Routine blood pressure checks, blood glucose monitoring, and medication titration reviewed directly by our physician.',
    availability: 'Walk-in or Scheduled · Daily',
    preparationNote: 'For fasting blood glucose readings, avoid meals for 8 hours prior to visit.',
    suggestedReason: 'Blood Pressure & Diabetes Check',
    suggestedVisitType: 'clinic',
  },
  {
    id: 'otc-medications',
    number: '05',
    title: 'Over-the-Counter Care',
    category: 'pharmacy',
    categoryLabel: 'Pharmacy',
    description:
      'Quality-verified remedies for fever, pain relief, allergy control, and digestive health with pharmacist guidance.',
    availability: 'In-stock · Counter & Phone',
    preparationNote: 'Inform our pharmacist about any known drug allergies or pregnancy.',
    suggestedReason: 'General Medical Consultation',
    suggestedVisitType: 'clinic',
  },
  {
    id: 'vitamins-wellness',
    number: '06',
    title: 'Vitamins, Hydration & Wellness',
    category: 'wellness',
    categoryLabel: 'Wellness & Supplies',
    description:
      'Clinical-grade multivitamins, oral rehydration salts, maternal nutrition, and bone-health supplements.',
    availability: 'In-stock · Daily',
    preparationNote: 'Ask Dr. Uddin for age-appropriate vitamin and iron dosing plans.',
    suggestedReason: 'Follow-up & Recovery Check',
    suggestedVisitType: 'clinic',
  },
  {
    id: 'first-aid-supplies',
    number: '07',
    title: 'First Aid & Home Monitoring Devices',
    category: 'wellness',
    categoryLabel: 'Wellness & Supplies',
    description:
      'Sterile wound dressings, nebulizers, digital thermometers, blood pressure cuffs, and emergency family kits.',
    availability: 'In-stock · Daily',
    preparationNote: 'Free device demonstration provided at the counter before purchase.',
    suggestedReason: 'Wound Care & Dressing Follow-up',
    suggestedVisitType: 'clinic',
  },
  {
    id: 'specialty-compounding',
    number: '08',
    title: 'Specialty Compounding',
    category: 'pharmacy',
    categoryLabel: 'Pharmacy',
    description:
      'Custom-prepared dermatological and pediatric formulations tailored to physician specifications.',
    availability: 'Opening Soon · Pre-inquiry',
    preparationNote: 'Register interest during a clinic consultation for upcoming availability.',
    suggestedReason: 'General Medical Consultation',
    suggestedVisitType: 'clinic',
    isUpcoming: true,
  },
];

export const CONSULTATION_REASONS = [
  'General Medical Consultation',
  'Blood Pressure & Diabetes Check',
  'Pediatric & Family Care',
  'Follow-up & Recovery Check',
  'Prescription Refill & Review',
  'Wound Care & Dressing Follow-up',
  'Home Medical Visit',
];

export const TIME_SLOT_GROUPS: TimeSlotGroup[] = [
  {
    period: 'Morning',
    slots: ['09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM'],
  },
  {
    period: 'Afternoon',
    slots: ['12:30 PM', '04:00 PM', '04:45 PM', '05:30 PM'],
  },
  {
    period: 'Evening',
    slots: ['06:30 PM', '07:15 PM', '08:00 PM', '08:45 PM', '09:30 PM', '10:15 PM'],
  },
];

export const ALL_TIME_SLOTS = TIME_SLOT_GROUPS.flatMap((g) => g.slots);

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    patientName: 'Abdul Karim Chowdhury',
    roleAndArea: 'School Teacher · Harinadighi, Fatickchhari',
    visitType: 'Clinic Visit · Chronic Care',
    dateLabel: 'October 2026',
    outcomeSummary: 'Stabilized blood pressure within 3 weeks',
    quote:
      'For fifteen years our family has trusted Dr. Jashim Uddin. Before my checkups here, my blood pressure fluctuated unpredictably. He adjusted my daily dosage patiently and the pharmacy ensured I never missed a genuine strip.',
  },
  {
    id: 't2',
    patientName: 'Nasrin Akter Begum',
    roleAndArea: 'Parent · Fatickchhari Sadar',
    visitType: 'Clinic Visit · Pediatric Care',
    dateLabel: 'September 2026',
    outcomeSummary: 'Clear diagnosis & fast recovery in 48 hours',
    quote:
      'When my younger son developed a high fever late in the evening, Sahen Sah J.H. Medicine Center was open until 11 PM. Dr. Uddin examined him calmly without rushing and explained every step of the medicine schedule.',
  },
  {
    id: 't3',
    patientName: 'Mohammad Rafiqul Islam',
    roleAndArea: 'Retired Bank Officer · Nazirhat, Chittagong',
    visitType: 'Home Service · 200 Tk',
    dateLabel: 'November 2026',
    outcomeSummary: 'Post-surgery recovery supervised at home',
    quote:
      'After my knee procedure, traveling to a hospital was difficult. Booking Dr. Uddin’s 200 Tk home service brought twenty years of medical experience right to our living room, complete with wound care supplies from the center.',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-fees',
    category: 'appointments',
    categoryLabel: 'Fees & Booking',
    question: 'What are the consultation fees for clinic visits and home services?',
    answer:
      'In-clinic consultations with Dr. Jashim Uddin (L.M.F, R.M.P) at Sahen Sah J.H. Medicine Center are 100 Tk. Dedicated home medical visits across Harinadighi and nearby Fatickchhari areas are 200 Tk.',
    actionLabel: 'Book a consultation',
  },
  {
    id: 'faq-refills',
    category: 'pharmacy',
    categoryLabel: 'Refills & Pharmacy',
    question: 'How do prescription refills and medication checks work?',
    answer:
      'Bring your written prescription or previous medicine strips to the pharmacy counter during opening hours. Our team verifies batch authenticity, expiration dates, and potential drug interactions. If your blood pressure or chronic-care prescription needs adjustment, you can reserve a quick refill review slot with Dr. Uddin.',
    actionLabel: 'Schedule a refill review',
  },
  {
    id: 'faq-hours',
    category: 'hours',
    categoryLabel: 'Hours & Home Care',
    question: 'What are your pharmacy and clinic hours? Are you open on Fridays?',
    answer:
      'We are open Saturday through Thursday from 9:00 AM to 11:00 PM for both pharmacy dispensing and physician consultations. The clinic and pharmacy are closed every Friday, and Friday dates are automatically blocked in our online appointment scheduler.',
  },
  {
    id: 'faq-walkin',
    category: 'appointments',
    categoryLabel: 'Fees & Booking',
    question: 'Do I need an appointment, or are walk-in patients welcome?',
    answer:
      'Both walk-in visitors and pre-booked patients are welcome. Reserving a time slot online or scanning the pharmacy counter QR code locks in your preferred 45-minute window and minimizes waiting time during busy evening hours.',
    actionLabel: 'View open time slots',
  },
  {
    id: 'faq-home-coverage',
    category: 'hours',
    categoryLabel: 'Hours & Home Care',
    question: 'Which neighborhoods are covered by the 200 Tk Home Medical Service?',
    answer:
      'Dr. Jashim Uddin provides home visits across Harinadighi, Fatickchhari Sadar, and nearby Chittagong communities for seniors, recovering surgical patients, and individuals with limited mobility. When booking online, simply select Home Service and include a nearby landmark and active mobile number.',
    actionLabel: 'Request a home visit',
  },
  {
    id: 'faq-compounding',
    category: 'pharmacy',
    categoryLabel: 'Refills & Pharmacy',
    question: 'Can I request specialty compounding or specific medical devices?',
    answer:
      'Our counter stocks blood pressure cuffs, glucometers, nebulizers, and sterile wound-care supplies with free usage demonstrations. Custom dermatological and pediatric compounding is launching soon—inquire at the counter or call 01812901786 to register interest.',
  },
];

export function formatLocalDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isFridayISO(dateISO: string): boolean {
  if (!dateISO) return false;
  const [y, m, d] = dateISO.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getDay() === 5;
}

export function getNextOpenDateISO(fromDate: Date = new Date()): string {
  const candidate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  while (candidate.getDay() === 5) {
    candidate.setDate(candidate.getDate() + 1);
  }
  return formatLocalDateISO(candidate);
}

export function getUpcomingOpenDates(
  count = 6,
  lang: Language = 'en',
): { iso: string; dayName: string; shortDate: string; isToday: boolean }[] {
  const results: { iso: string; dayName: string; shortDate: string; isToday: boolean }[] = [];
  const todayISO = formatLocalDateISO(new Date());
  const cursor = new Date();
  const locale = lang === 'bn' ? 'bn-BD' : 'en-US';

  while (results.length < count) {
    if (cursor.getDay() !== 5) {
      const iso = formatLocalDateISO(cursor);
      results.push({
        iso,
        dayName:
          iso === todayISO
            ? lang === 'bn'
              ? 'আজ'
              : 'Today'
            : cursor.toLocaleDateString(locale, { weekday: 'short' }),
        shortDate: cursor.toLocaleDateString(locale, { month: 'short', day: 'numeric' }),
        isToday: iso === todayISO,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return results;
}

export function formatReadableDate(dateISO: string, lang: Language = 'en'): string {
  const [y, m, d] = dateISO.split('-').map(Number);
  if (!y || !m || !d) return dateISO;
  const dt = new Date(y, m - 1, d);
  const locale = lang === 'bn' ? 'bn-BD' : 'en-US';
  return dt.toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function createInitialAppointments(): Appointment[] {
  const openDates = getUpcomingOpenDates(4);
  const firstOpen = openDates[0]?.iso ?? getNextOpenDateISO();
  const secondOpen = openDates[1]?.iso ?? firstOpen;

  return [
    {
      id: 'apt-seed-1',
      referenceCode: 'SS-2026-1041',
      patientName: 'Kamrul Hasan',
      phone: '01819442310',
      age: '48',
      visitType: 'clinic',
      feeTk: 100,
      reason: 'Blood Pressure & Diabetes Check',
      date: firstOpen,
      timeSlot: '10:15 AM',
      notes: 'Monthly routine blood pressure review and prescription refill.',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    },
    {
      id: 'apt-seed-2',
      referenceCode: 'SS-2026-1042',
      patientName: 'Sultana Razia',
      phone: '01715883209',
      age: '67',
      visitType: 'home',
      feeTk: 200,
      reason: 'Home Medical Visit',
      date: firstOpen,
      timeSlot: '04:45 PM',
      homeAddress: 'East Harinadighi Bazar Road, Near Baitul Aman Mosque',
      notes: 'Joint pain and fever evaluation for senior patient.',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    },
    {
      id: 'apt-seed-3',
      referenceCode: 'SS-2026-1038',
      patientName: 'Tariqul Alam',
      phone: '01912776543',
      age: '31',
      visitType: 'clinic',
      feeTk: 100,
      reason: 'General Medical Consultation',
      date: firstOpen,
      timeSlot: '09:30 AM',
      notes: 'Seasonal cough and throat irritation.',
      status: 'completed',
      createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    },
    {
      id: 'apt-seed-4',
      referenceCode: 'SS-2026-1044',
      patientName: 'Farhana Yasmin',
      phone: '01614330912',
      age: '9',
      visitType: 'clinic',
      feeTk: 100,
      reason: 'Pediatric & Family Care',
      date: secondOpen,
      timeSlot: '06:30 PM',
      notes: 'Child evening consultation for mild fever.',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600 * 1000 * 1).toISOString(),
    },
  ];
}

export function getDhakaOpenState(lang: Language = 'en'): { isOpen: boolean; label: string } {
  const copy = TRANSLATIONS[lang].hero;
  try {
    const now = new Date();
    const dhakaParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Dhaka',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    }).formatToParts(now);

    const weekday = dhakaParts.find((p) => p.type === 'weekday')?.value ?? '';
    const hour = Number(dhakaParts.find((p) => p.type === 'hour')?.value ?? 0);

    if (weekday === 'Fri') {
      return { isOpen: false, label: copy.closedFriday };
    }
    if (hour >= 9 && hour < 23) {
      return { isOpen: true, label: copy.openNow };
    }
    if (hour < 9) {
      return { isOpen: false, label: copy.opensAtNine };
    }
    return { isOpen: false, label: copy.closedNow };
  } catch {
    return { isOpen: true, label: TRANSLATIONS[lang].hoursSummary };
  }
}
