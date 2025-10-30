import { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function LoadingSplash() {
  const [dots, setDots] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#6B8E23] via-[#8B7D3A] to-[#4B5320]">
      <div className="relative">
        {/* Animated circles */}
        <div className="absolute inset-0 -m-12">
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#C2B280]/20 rounded-full animate-ping" />
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#C2B280]/20 rounded-full animate-ping animation-delay-200" />
          <div className="absolute bottom-0 left-1/2 w-20 h-20 bg-[#C2B280]/20 rounded-full animate-ping animation-delay-400" />
        </div>

        {/* Spinner */}
        <div className="relative flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-[#E8E6D5]/30 rounded-full" />
            <div className="absolute top-0 left-0 w-24 h-24 border-8 border-[#E8E6D5] border-t-transparent rounded-full animate-spin" />
          </div>

          {/* Logo/Text */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-[#F5F4ED] mb-2 animate-pulse drop-shadow-lg">
              Khakiland
            </h1>
            <p className="text-[#E8E6D5] text-lg drop-shadow">
              {t.loading.experience}{dots}
            </p>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#C2B280] rounded-full animate-float" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#E8E6D5]/70 rounded-full animate-float animation-delay-300" />
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[#C2B280]/50 rounded-full animate-float animation-delay-500" />
        </div>
      </div>
    </div>
  );
}
