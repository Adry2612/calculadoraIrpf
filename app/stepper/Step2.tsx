import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCalculadoraStore } from "../store/useCalculadoraStore";
import { DEFAULT_SOCIAL_SECURITY_PERCENTAGE } from "../store/calculations";
import { useI18n } from "../i18n/useI18n";

type EmploymentForm = {
  companyName: string;
  grossSalary: string;
  withholding: string;
  startDate: string;
  endDate: string;
  payPeriods: 12 | 14;
  extraPaymentsProrated: boolean;
  extraPaymentMonth1: number;
  extraPaymentMonth2: number;
  expertMode: boolean;
  socialSecurityPercentage: string;
};

const EMPTY_EMPLOYMENT_FORM: EmploymentForm = {
  companyName: "",
  grossSalary: "",
  withholding: "",
  startDate: "",
  endDate: "",
  payPeriods: 12,
  extraPaymentsProrated: false,
  extraPaymentMonth1: 6,
  extraPaymentMonth2: 12,
  expertMode: false,
  socialSecurityPercentage: `${DEFAULT_SOCIAL_SECURITY_PERCENTAGE}`,
};

export function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [employmentForm, setEmploymentForm] = useState<EmploymentForm>(EMPTY_EMPLOYMENT_FORM);
  const [isStartOfYearLocked, setIsStartOfYearLocked] = useState(false);
  const pagadores = useCalculadoraStore((state) => state.pagadores);
  const addPagador = useCalculadoraStore((state) => state.addPagador);
  const currentYearStart = `${new Date().getFullYear()}-01-01`;
  const { t, localeTag } = useI18n();
  const fieldClass =
    "w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300";
  const dateFieldClass = `${fieldClass} h-12`;

  const handleFormChange = (
    field: keyof EmploymentForm,
    value: string | boolean | number | 12 | 14
  ) => {
    setEmploymentForm((prev) => ({ ...prev, [field]: value }));
  };

  const monthFormatter = new Intl.DateTimeFormat(localeTag, { month: "long" });
  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const monthDate = new Date(2026, index, 1);
    return {
      value: monthNumber,
      label: monthFormatter.format(monthDate),
    };
  });

  const handleAddEmployment = () => {
    if (!employmentForm.companyName.trim()) {
      return;
    }

    addPagador({
      name: employmentForm.companyName,
      grossSalary: Number.parseFloat(employmentForm.grossSalary) || 0,
      irpfPercentage: Number.parseFloat(employmentForm.withholding) || 0,
      startDate: employmentForm.startDate,
      endDate: employmentForm.endDate,
      payPeriods: employmentForm.payPeriods,
      extraPaymentsProrated: employmentForm.extraPaymentsProrated,
      extraPaymentMonths: [employmentForm.extraPaymentMonth1, employmentForm.extraPaymentMonth2],
      salaryIncludesSocialSecurity: false,
      socialSecurityPercentage: employmentForm.expertMode
        ? Number.parseFloat(employmentForm.socialSecurityPercentage) || 0
        : DEFAULT_SOCIAL_SECURITY_PERCENTAGE,
      annualOtherDeductions: 0,
    });
    setEmploymentForm(EMPTY_EMPLOYMENT_FORM);
    setIsStartOfYearLocked(false);
    onNext();
  };

  return (
    <div className="flex flex-col w-full max-w-4xl p-8">
      <h1 className="text-3xl mb-3 text-start text-gray-800 font-bold dark:text-gray-300">
        {" "}
        {t("step2.title")}
      </h1>
      <h2 className="text-sm text-start text-gray-500 dark:text-gray-300 mb-8">
        {t("step2.subtitle")}
      </h2>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold"> {t("step2.companyName")} </label>
          <input
            type="text"
            className={fieldClass}
            value={employmentForm.companyName}
            onChange={(event) => handleFormChange("companyName", event.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> {t("step2.annualGrossSalary")} </label>
            <input
              type="number"
              className={fieldClass}
              value={employmentForm.grossSalary}
              onChange={(event) => handleFormChange("grossSalary", event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> {t("step2.irpfWithholding")} </label>
            <input
              type="number"
              className={fieldClass}
              value={employmentForm.withholding}
              onChange={(event) => handleFormChange("withholding", event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold"> {t("step2.employmentPeriod")} </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col gap-2 md:max-w-85">
              <input
                type="date"
                className={`${dateFieldClass} ${isStartOfYearLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                value={employmentForm.startDate}
                onChange={(event) => handleFormChange("startDate", event.target.value)}
                disabled={isStartOfYearLocked}
              />
              <button
                type="button"
                onClick={() => {
                  const nextLocked = !isStartOfYearLocked;
                  setIsStartOfYearLocked(nextLocked);
                  if (nextLocked) {
                    handleFormChange("startDate", currentYearStart);
                  }
                }}
                className={`w-fit rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  isStartOfYearLocked
                    ? "border-gray-800 bg-gray-800 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {isStartOfYearLocked ? t("step2.startOfYearEnabled") : t("step2.markStartOfYear")}
              </button>
            </div>
            <div className="md:max-w-85">
              <input
                type="date"
                className={dateFieldClass}
                value={employmentForm.endDate}
                onChange={(event) => handleFormChange("endDate", event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> {t("step2.annualPayPeriods")} </label>
            <div className="inline-flex w-fit rounded-full border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => {
                  handleFormChange("payPeriods", 12);
                  handleFormChange("extraPaymentsProrated", false);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  employmentForm.payPeriods === 12
                    ? "bg-gray-800 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {t("step2.twelvePays")}
              </button>
              <button
                type="button"
                onClick={() => handleFormChange("payPeriods", 14)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  employmentForm.payPeriods === 14
                    ? "bg-gray-800 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {t("step2.fourteenPays")}
              </button>
            </div>
          </div>

          {employmentForm.payPeriods === 14 && (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800/70">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {t("step2.extraPaymentsProratedTitle")}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("step2.extraPaymentsProratedSubtitle")}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={employmentForm.extraPaymentsProrated}
                aria-label={t("step2.extraPaymentsProratedAria")}
                onClick={() =>
                  handleFormChange("extraPaymentsProrated", !employmentForm.extraPaymentsProrated)
                }
                className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
                  employmentForm.extraPaymentsProrated
                    ? "bg-gray-800"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                    employmentForm.extraPaymentsProrated ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {t("step2.expertModeTitle")}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("step2.expertModeSubtitle")}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={employmentForm.expertMode}
              onClick={() => handleFormChange("expertMode", !employmentForm.expertMode)}
              className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
                employmentForm.expertMode ? "bg-gray-800" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                  employmentForm.expertMode ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {employmentForm.expertMode &&
            employmentForm.payPeriods === 14 &&
            !employmentForm.extraPaymentsProrated && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">{t("step2.firstExtraPaymentMonth")}</label>
                  <select
                    className={fieldClass}
                    value={employmentForm.extraPaymentMonth1}
                    onChange={(event) =>
                      handleFormChange("extraPaymentMonth1", Number(event.target.value))
                    }
                  >
                    {monthOptions.map((monthOption) => (
                      <option key={monthOption.value} value={monthOption.value}>
                        {monthOption.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold">{t("step2.secondExtraPaymentMonth")}</label>
                  <select
                    className={fieldClass}
                    value={employmentForm.extraPaymentMonth2}
                    onChange={(event) =>
                      handleFormChange("extraPaymentMonth2", Number(event.target.value))
                    }
                  >
                    {monthOptions.map((monthOption) => (
                      <option key={monthOption.value} value={monthOption.value}>
                        {monthOption.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

          {employmentForm.expertMode && (
            <div className="flex flex-col gap-2">
              <label className="font-semibold"> {t("step2.estimatedSocialSecurity")} </label>
              <input
                type="number"
                className={fieldClass}
                value={employmentForm.socialSecurityPercentage}
                onChange={(event) =>
                  handleFormChange("socialSecurityPercentage", event.target.value)
                }
                placeholder={t("step2.estimatedSocialSecurityPlaceholder")}
              />
            </div>
          )}
        </div>
      </form>

      <div className="flex flex-1 items-center justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-lg text-gray-800 hover:bg-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          {t("step2.back")}
        </button>
        <div className="flex items-center gap-3">
          {pagadores.length > 0 && (
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition-colors dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              {t("step2.goToEmploymentSummary")}
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </button>
          )}
          <button
            type="button"
            onClick={handleAddEmployment}
            className="px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            {t("step2.addEmployment")}
          </button>
        </div>
      </div>
    </div>
  );
}
