"use client";

import { useRouter } from "next/navigation";
import { useCalculadoraStore } from "../store/useCalculadoraStore";

type Step4Props = {
  onBack: () => void;
};

export function Step4({ onBack }: Step4Props) {
  const router = useRouter();

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
    <div className="flex flex-col w-full max-w-4xl p-8">
      <h1 className="text-3xl mb-3 text-start text-gray-800 font-bold dark:text-gray-300"> Empleo futuro </h1>
      <h2 className="text-sm text-start text-gray-500 dark:text-gray-300 mb-8">
        Indica una previsión de tu próximo empleo para estimar el impacto fiscal futuro.
      </h2>

      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold"> Empresa (opcional) </label>
          <input
            type="text"
            className={fieldClass}
            value={pagadorFuturo.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="Nombre de la empresa"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> Salario bruto anual esperado </label>
            <input
              type="number"
              className={fieldClass}
              value={pagadorFuturo.grossSalary || ""}
              onChange={(event) => handleChange("grossSalary", event.target.value)}
              placeholder="Ej: 32000"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> Fecha prevista de inicio </label>
            <input
              type="date"
              className={fieldClass}
              value={pagadorFuturo.startDate}
              onChange={(event) => handleChange("startDate", event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="font-semibold"> Pagas anuales </label>
          <div className="inline-flex w-fit rounded-full border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => handlePayPeriodsChange(12)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pagadorFuturo.payPeriods === 12
                  ? "bg-gray-800 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              12 pagas
            </button>
            <button
              type="button"
              onClick={() => handlePayPeriodsChange(14)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                pagadorFuturo.payPeriods === 14
                  ? "bg-gray-800 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              14 pagas
            </button>
          </div>
        </div>
      </form>

      <div className="flex items-center justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 rounded-lg text-gray-800 hover:bg-gray-700 transition-colors"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={() => router.push("/summary")}
          className="px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          Finalizar
        </button>
      </div>

      <div className="flex flex-row justify-center items-center bg-gray-100 mt-8 p-4 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Este paso es orientativo y no modifica los pagadores ya registrados, solo sirve para proyectar escenarios futuros.
        </p>
      </div>
    </div>
  );
}
