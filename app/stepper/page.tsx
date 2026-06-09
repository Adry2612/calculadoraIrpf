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
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 p-3 font-sans dark:bg-black sm:p-6 lg:p-10">
      <div className="flex w-full max-w-4xl flex-1 flex-col rounded-3xl bg-gray-200">
        {/* Stepper */}
        <div className="flex w-full flex-col p-5 sm:p-8">
          <h1 className="text-sm mb-3 text-start text-gray-500 dark:text-gray-300">
            {" "}
            {t("stepper.stepOf", { step })}{" "}
          </h1>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-300/80">
            <span
              className="block h-full rounded-full bg-gray-800 transition-all dark:bg-gray-600"
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
