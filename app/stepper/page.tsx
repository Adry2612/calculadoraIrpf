"use client";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { useCalculadoraStore } from "../store/useCalculadoraStore";
import { Step3 } from "./Step3";
import { Step4 } from "./Step4";
import { useI18n } from "../i18n/useI18n";

export default function Home() {
  const step = useCalculadoraStore((state) => state.step);
  const setStep = useCalculadoraStore((state) => state.setStep);
  const { t } = useI18n();
  const progress = Math.min(100, Math.max(25, step * 25));

  return (
    <div className="flex flex-1 flex-col items-center bg-slate-50 px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex w-full max-w-4xl flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex w-full flex-col border-b border-slate-200 px-5 py-5 sm:px-8 sm:py-6">
          <h2 className="mb-3 text-xs font-semibold tracking-wide text-slate-500">
            {t("stepper.stepOf", { step })}
          </h2>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={4}
            aria-valuenow={step}
            aria-label={t("stepper.stepOf", { step })}
          >
            <span
              className="block h-full rounded-full bg-[#315a78] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {step === 1 && <Step1 onNext={() => setStep(2)} />}

        {step === 2 && <Step2 onBack={() => setStep(1)} onNext={() => setStep(3)} />}

        {step === 3 && <Step3 onNext={() => setStep(4)} onBack={() => setStep(2)} />}

        {step === 4 && <Step4 onBack={() => setStep(3)} />}
      </div>
    </div>
  );
}
