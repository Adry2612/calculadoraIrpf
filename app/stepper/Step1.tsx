"use client";

import { AUTONOMOUS_COMMUNITIES, CIVIL_STATUS_OPTIONS } from "./step1.data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faChevronDown, faLock } from "@fortawesome/free-solid-svg-icons";
import { useCalculadoraStore } from "../store/useCalculadoraStore";

type Step1Props = {
  onNext: () => void;
};

export function Step1({ onNext }: Step1Props) {
  const datosPersonales = useCalculadoraStore((state) => state.datosPersonales);
  const updatePersonalInfo = useCalculadoraStore((state) => state.updatePersonalInfo);
  const fieldClass =
    "w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300";

  const handleDecreaseChildren = () => {
    updatePersonalInfo({ childrenCount: Math.max(0, datosPersonales.childrenCount - 1) });
  };

  const handleIncreaseChildren = () => {
    updatePersonalInfo({ childrenCount: datosPersonales.childrenCount + 1 });
  };

  return (
    <div className="flex flex-col w-full max-w-4xl p-8">
      <h1 className="text-3xl mb-3 text-start text-gray-800 font-bold dark:text-gray-300"> Datos Personales</h1>
      <h2 className="text-sm text-start text-gray-500 dark:text-gray-300 mb-8">
        Tu situación personal y familiar determina tus mínimos exentos y deducciones autonómicas.
      </h2>

      <form className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> Comunidad Autónoma </label>
            <div className="relative">
              <select
                className={`${fieldClass} pr-12 appearance-none`}
                value={datosPersonales.region}
                onChange={(event) => updatePersonalInfo({ region: event.target.value })}
              >
                <option value="">Seleccionar...</option>
                {AUTONOMOUS_COMMUNITIES.map((community) => (
                  <option key={community.value} value={community.value}>
                    {community.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> Estado Civil </label>
            <div className="relative">
              <select
                className={`${fieldClass} pr-12 appearance-none`}
                value={datosPersonales.civilStatus}
                onChange={(event) => updatePersonalInfo({ civilStatus: event.target.value })}
              >
                <option value="">Seleccionar...</option>
                {CIVIL_STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon icon={faChevronDown} className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> Año de Nacimiento </label>
            <input
              className={fieldClass}
              type="number"
              placeholder="YYYY"
              value={datosPersonales.birthYear}
              onChange={(event) =>
                updatePersonalInfo({
                  birthYear: Number.parseInt(event.target.value, 10) || new Date().getFullYear(),
                })
              }
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="font-semibold"> Hijos o descendientes </label>
            <div className="relative">
              <button
                type="button"
                onClick={handleDecreaseChildren}
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-lg text-gray-800 dark:text-gray-300"
                aria-label="Disminuir hijos o descendientes"
              >
                -
              </button>
              <input
                className={`${fieldClass} pl-14 pr-14 text-center`}
                type="number"
                min={0}
                value={datosPersonales.childrenCount}
                readOnly
              />
              <button
                type="button"
                onClick={handleIncreaseChildren}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-lg text-gray-800 dark:text-gray-300"
                aria-label="Aumentar hijos o descendientes"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/70">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Situación de Discapacidad</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Grado igual o superior al 33%</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={datosPersonales.discapacity}
                aria-label="Activar o desactivar situación de discapacidad"
                onClick={() => updatePersonalInfo({ discapacity: !datosPersonales.discapacity })}
                className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
                  datosPersonales.discapacity ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                    datosPersonales.discapacity ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/70">
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Ascendientes a cargo</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Mayores de 65 años</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={datosPersonales.ascendientesACargo}
                aria-label="Activar o desactivar ascendientes a cargo"
                onClick={() => updatePersonalInfo({ ascendientesACargo: !datosPersonales.ascendientesACargo })}
                className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-colors ${
                  datosPersonales.ascendientesACargo ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                    datosPersonales.ascendientesACargo ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </form>
      
      <div className="flex flex-row justify-center items-center bg-gray-100 mt-8 p-4 rounded-lg"> 
        <FontAwesomeIcon icon={faLock} className="text-gray-500 dark:text-gray-300 mr-6" />
        <h2 className="text-sm text-gray-500 dark:text-gray-300">
          Tus datos se procesan localmente y no se almacenan en nuestros servidores. La privacidad de tu información financiera es nuestra prioridad absoluta. </h2>
      </div>

      <div className="flex flex-1 items-center justify-between mt-8">
        <button
          type="button"
          className="px-6 py-3 rounded-lg text-gray-800 hover:bg-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Volver
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
        >
          Siguiente
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </button>
    </div>
    </div>
  );
}