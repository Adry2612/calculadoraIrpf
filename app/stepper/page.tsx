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

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black p-16">
      <div className="flex flex-1 flex-col w-full max-w-3xl bg-gray-200 rounded-3xl">
        {/* Stepper */}
        <div className="flex flex-col w-1/3 p-8">
          <h1 className="text-sm mb-3 text-start text-gray-500 dark:text-gray-300">
            {" "}
            {t("stepper.stepOf", { step })}{" "}
          </h1>
          <span className="border-b-3 border-gray-800 dark:border-gray-600" />
        </div>

        {step === 1 && <Step1 onNext={() => setStep(2)} />}

        {step === 2 && <Step2 onBack={() => setStep(1)} onNext={() => setStep(3)} />}

        {step === 3 && <Step3 onNext={() => setStep(4)} onBack={() => setStep(2)} />}

        {step === 4 && <Step4 onBack={() => setStep(3)} />}
      </div>
    </div>
  );
}
