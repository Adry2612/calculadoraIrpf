import { useCalculadoraStore } from "../store/useCalculadoraStore";

export function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const pagadores = useCalculadoraStore((state) => state.pagadores);
  const calculateTotalForPeriod = useCalculadoraStore((state) => state.calculateTotalForPeriod);
  const totalGrossAllPayers = useCalculadoraStore((state) => state.getTotalGrossAllPayers());

  const formatDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleDateString("es-ES");
  };

  return (
    <div className="flex flex-col w-full max-w-4xl p-8">
      <h1 className="text-3xl mb-3 text-start text-gray-800 font-bold dark:text-gray-300"> Verifica tus pagadores </h1>
      <h2 className="text-sm text-start text-gray-500 dark:text-gray-300 mb-8"> Hemos recopilado tus principales fuentes de ingresos. Por favor, confirma los montos anuales brutos o agrega cualquier pagador que falte. </h2>

      <div className="flex flex-col gap-4">
        {pagadores.map((pagador, index) => (
          <div key={index} className="flex flex-row gap-2 w-full p-4 rounded-lg justify-between bg-white dark:bg-gray-800">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">{pagador.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(pagador.startDate)} - {formatDate(pagador.endDate)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-2xl text-gray-800 dark:text-gray-400">
                {calculateTotalForPeriod(pagador.startDate, pagador.endDate, pagador.grossSalary).toLocaleString()}€
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
        + Añadir otro pagador
      </button>

      <div className="flex flex-col gap-2 w-full p-4 rounded-lg justify-between bg-gray-800 dark:bg-gray-800 mt-4">
        <h3 className="text-lg font-semibold text-white dark:text-gray-300">Total bruto entre todos los pagadores</h3>
        <div className="flex flex-row items-center justify-between gap-1">
          <p className="text-lg text-white dark:text-gray-400">{totalGrossAllPayers.toLocaleString()}€</p>
          <p className=" border border-gray-500 bg-gray-700  rounded-2xl  px-4 py-2 text-white dark:text-gray-400"> {pagadores.length} pagadores detectados </p>
        </div>
      </div>

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
          onClick={onNext}
          className="px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          Calcular resultados
        </button>
      </div>

      <div className="flex flex-row justify-center items-center bg-gray-100 mt-8 p-4 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Si ves que no coinciden los datos brutos de cada pagador, es porque hemos calculado el bruto obtenido en función del periodo y el salario bruto anual proporcionado. </p>
      </div>
    </div>
  );
}