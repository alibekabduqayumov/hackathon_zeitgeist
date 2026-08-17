import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { RefreshCw, CheckCircle2, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

interface ScanMarketModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export const ScanMarketModal: React.FC<ScanMarketModalProps> = ({
  isOpen,
  onComplete,
}) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    { title: t.scanStep1Title, desc: t.scanStep1Desc },
    { title: t.scanStep2Title, desc: t.scanStep2Desc },
    { title: t.scanStep3Title, desc: t.scanStep3Desc },
    { title: t.scanStep4Title, desc: t.scanStep4Desc },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <RefreshCw className="h-5 w-5 animate-spin" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-slate-100">
              {t.scanModalTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {t.scanModalSubtitle}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isDone = currentStep > idx;
            const isCurrent = currentStep === idx;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-xl p-3 transition-all ${
                  isCurrent
                    ? 'bg-slate-950 border border-amber-500/40 shadow-md'
                    : isDone
                    ? 'bg-slate-950/50 border border-slate-800'
                    : 'opacity-40'
                }`}
              >
                <div className="mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-700" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <div className="font-mono text-xs font-bold text-slate-200">
                    {step.title}
                  </div>
                  <div className="text-[11px] text-slate-400">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl bg-slate-950/80 p-3 text-center font-mono text-xs text-slate-400 border border-slate-800">
          <span className="text-amber-400 font-semibold">{t.listingsCount}</span> • 6 {t.regionalHubs}
        </div>
      </div>
    </div>
  );
};
