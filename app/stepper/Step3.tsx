import { useCalculadoraStore } from "../store/useCalculadoraStore";
import { useI18n } from "../i18n/useI18n";

export function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const pagadores = useCalculadoraStore((state) => state.pagadores);
  const calculateTotalForPeriod = useCalculadoraStore((state) => state.calculateTotalForPeriod);
  const totalGrossAllPayers = useCalculadoraStore((state) => state.getTotalGrossAllPayers());
  const { localeTag, t } = useI18n();

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString(localeTag);
  };

  return (
    <div className="flex w-full max-w-4xl flex-col p-5 sm:p-8">
      <h1 className="mb-3 text-start text-2xl font-bold text-gray-800 dark:text-gray-300 sm:text-3xl">
        {" "}
        {t("step3.title")}{" "}
      </h1>
      <h2 className="text-sm text-start text-gray-500 dark:text-gray-300 mb-8">
        {" "}
        {t("step3.subtitle")}{" "}
      </h2>

      <div className="flex flex-col gap-4">
        {pagadores.map((pagador, index) => (
          <div
            key={index}
            className="flex w-full flex-col justify-between gap-3 rounded-lg bg-white p-4 dark:bg-gray-800 sm:flex-row sm:items-center"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                {pagador.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(pagador.startDate)} - {formatDate(pagador.endDate)}
              </p>
            </div>
            <div className="flex flex-col gap-1 sm:items-end">
              <p className="text-xl text-gray-800 dark:text-gray-400 sm:text-2xl">
                {calculateTotalForPeriod(
                  pagador.startDate,
                  pagador.endDate,
                  pagador.grossSalary,
                  pagador.payPeriods,
                  pagador.extraPaymentsProrated,
                  pagador.extraPaymentMonths,
                  true
                ).toLocaleString()}
                €
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full mt-4 p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
      >
        {t("step3.addAnotherPayer")}
      </button>

      <div className="mt-4 flex w-full flex-col gap-2 rounded-lg bg-gray-800 p-4 dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-white dark:text-gray-300">
          {t("step3.grossTotalTitle")}
        </h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-1">
          <p className="text-lg text-white dark:text-gray-400">
            {totalGrossAllPayers.toLocaleString()}€
          </p>
          <p className=" border border-gray-500 bg-gray-700  rounded-2xl  px-4 py-2 text-white dark:text-gray-400">
            {" "}
            {t("step3.payersDetected", { count: pagadores.length })}{" "}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg px-6 py-3 text-gray-800 transition-colors hover:bg-gray-200 sm:hover:bg-gray-700"
        >
          {t("step3.back")}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          {t("step3.calculateResults")}
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center rounded-lg bg-gray-100 p-4">
        <p className="text-sm text-gray-500 dark:text-gray-300">{t("step3.note")} </p>
      </div>
    </div>
  );
}
