import { useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { CLINIC_INFO } from '../data/clinicData';

interface DoctorPortraitProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DoctorPortrait({ className = '', size = 'md' }: DoctorPortraitProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12 rounded-2xl',
    md: 'w-16 h-16 rounded-2xl',
    lg: 'w-24 h-28 sm:w-28 sm:h-32 rounded-2xl',
  }[size];

  if (hasError) {
    return (
      <div
        className={`${sizeClasses} bg-gradient-to-br from-[#EEF4FF] to-[#F5F5F7] border border-black/[0.08] flex flex-col items-center justify-center text-[#0071E3] shrink-0 ${className}`}
        aria-label={CLINIC_INFO.doctor.name}
      >
        <Stethoscope className={size === 'lg' ? 'w-7 h-7' : 'w-5 h-5'} strokeWidth={1.75} />
        <span className="text-[10px] font-display font-semibold tracking-wide mt-0.5 text-[#1D1D1F]">
          JU
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} overflow-hidden bg-[#EAEAEF] border border-black/[0.08] shrink-0 ${className}`}
    >
      <img
        src={CLINIC_INFO.doctor.photoUrl}
        alt={`${CLINIC_INFO.doctor.name}, ${CLINIC_INFO.doctor.credentials}`}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-[50%_18%]"
      />
    </div>
  );
}
