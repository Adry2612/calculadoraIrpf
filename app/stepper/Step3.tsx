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
    <div className="flex w-full max-w-4xl flex-col p-5 text-slate-800 sm:p-8">
      <h1 className="mb-3 text-start text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
        {t("step3.title")}{" "}
      </h1>
      <p className="mb-8 text-start text-sm leading-6 text-slate-600">{t("step3.subtitle")} </p>

      <div className="flex flex-col gap-4">
        {pagadores.map((pagador, index) => (
          <div
            key={index}
            className="flex w-full flex-col justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
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
        className="mt-4 w-full rounded-lg border border-dashed border-slate-300 bg-white p-5 text-slate-600 transition-colors hover:border-slate-400 hover:bg-slate-50"
      >
        {t("step3.addAnotherPayer")}
      </button>

      <div className="mt-4 flex w-full flex-col gap-2 rounded-lg bg-[#20394d] p-4">
        <h3 className="text-lg font-semibold text-white">{t("step3.grossTotalTitle")}</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-1">
          <p className="text-lg text-white">{totalGrossAllPayers.toLocaleString()}€</p>
          <p className="rounded-md border border-white/25 bg-white/10 px-4 py-2 text-white">
            {" "}
            {t("step3.payersDetected", { count: pagadores.length })}{" "}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-slate-300 px-6 py-3 text-slate-700 transition-colors hover:bg-slate-100"
        >
          {t("step3.back")}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-md bg-[#20394d] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#315a78]"
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
