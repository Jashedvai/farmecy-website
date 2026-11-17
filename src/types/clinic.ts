export type ServiceCategory = 'all' | 'pharmacy' | 'clinical' | 'wellness';

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: Exclude<ServiceCategory, 'all'>;
  categoryLabel: string;
  description: string;
  availability: string;
  preparationNote: string;
  suggestedReason: string;
  suggestedVisitType: VisitType;
  isUpcoming?: boolean;
}

export interface Testimonial {
  id: string;
  patientName: string;
  roleAndArea: string;
  visitType: string;
  dateLabel: string;
  outcomeSummary: string;
  quote: string;
}

export type VisitType = 'clinic' | 'home';

export type AppointmentStatus = 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  referenceCode: string;
  patientName: string;
  phone: string;
  age: string;
  visitType: VisitType;
  feeTk: number;
  reason: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  homeAddress?: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface TimeSlotGroup {
  period: 'Morning' | 'Afternoon' | 'Evening';
  slots: string[];
}

export type FaqCategory = 'all' | 'appointments' | 'pharmacy' | 'hours';

export interface FaqItem {
  id: string;
  category: Exclude<FaqCategory, 'all'>;
  categoryLabel: string;
  question: string;
  answer: string;
  actionLabel?: string;
}
