"use client";

import { useRouter } from "next/navigation";
import { useCalculadoraStore } from "../store/useCalculadoraStore";
import { useI18n } from "../i18n/useI18n";

type Step4Props = {
  onBack: () => void;
};

export function Step4({ onBack }: Step4Props) {
  const router = useRouter();
  const { t } = useI18n();

  const { addPagadorFuturo, pagadorFuturo } = useCalculadoraStore();

  const fieldClass =
    "w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300";

  const handleChange = (field: "name" | "grossSalary" | "startDate", value: string) => {
    addPagadorFuturo((prev) => ({
      ...prev,
      [field]: field === "grossSalary" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  const handlePayPeriodsChange = (payPeriods: 12 | 14) => {
    addPagadorFuturo((prev) => ({
      ...prev,
      payPeriods,
    }));
  };

  return (
    <div className="flex w-full max-w-4xl flex-col p-5 sm:p-8">
      <h1 className="mb-3 text-start text-2xl font-bold text-gray-800 dark:text-gray-300 sm:text-3xl">
        {" "}
        {t("step4.title")}{" "}
      </h1>
      <h2 className="text-sm text-start text-gray-500 dark:text-gray-300 mb-8">
        {t("step4.subtitle")}
      </h2>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold"> {t("step4.companyOptional")} </label>
          <input
            type="text"
            className={fieldClass}
            value={pagadorFuturo.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder={t("step4.companyPlaceholder")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> {t("step4.expectedAnnualGross")} </label>
            <input
              type="number"
              className={fieldClass}
              value={pagadorFuturo.grossSalary || ""}
              onChange={(event) => handleChange("grossSalary", event.target.value)}
              placeholder={t("step4.expectedAnnualGrossPlaceholder")}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> {t("step4.expectedStartDate")} </label>
            <input
              type="date"
              className={fieldClass}
              value={pagadorFuturo.startDate}
              onChange={(event) => handleChange("startDate", event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold"> {t("step4.annualPayPeriods")} </label>
          <div className="flex w-full flex-col rounded-2xl border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800 sm:inline-flex sm:w-fit sm:flex-row sm:rounded-full">
            <button
              type="button"
              onClick={() => handlePayPeriodsChange(12)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors sm:rounded-full ${
                pagadorFuturo.payPeriods === 12
                  ? "bg-gray-800 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {t("step4.twelvePays")}
            </button>
            <button
              type="button"
              onClick={() => handlePayPeriodsChange(14)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors sm:rounded-full ${
                pagadorFuturo.payPeriods === 14
                  ? "bg-gray-800 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {t("step4.fourteenPays")}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg px-6 py-3 text-gray-800 transition-colors hover:bg-gray-200 sm:hover:bg-gray-700"
        >
          {t("step4.back")}
        </button>
        <button
          type="button"
          onClick={() => router.push("/summary")}
          className="rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          {t("step4.finish")}
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-100 p-4">
        <p className="text-sm text-gray-500 dark:text-gray-300">{t("step4.note")}</p>
      </div>
    </div>
  );
}
