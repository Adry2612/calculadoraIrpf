"use client";

import {
  faArrowRight,
  faArrowTrendUp,
  faCircleCheck,
  faDoorOpen,
  faScaleBalanced,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "./i18n/useI18n";

export default function Home() {
  const { dictionary } = useI18n();
  const home = dictionary.home;

  return (
    <div className="flex flex-1 flex-col items-center justify-center font-sans dark:bg-black">
      <div className="flex w-full flex-col gap-8 bg-white px-4 py-8 shadow-lg sm:px-8 sm:py-12 lg:flex-row lg:gap-10">
        <div className="flex w-full flex-col items-start justify-center gap-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-200 sm:text-4xl">
            {home.heroTitle}
          </h1>
          <h2 className="w-full text-xl font-semibold text-gray-700 dark:text-gray-300 sm:text-2xl lg:w-2/3">
            {home.heroSubtitle}
          </h2>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link
              href="/stepper"
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-6 py-3 font-bold text-white hover:bg-blue-600 sm:mt-4"
            >
              {home.startSimulation}
              <FontAwesomeIcon icon={faArrowRight} className="h-5" />
            </Link>
            <Link
              href="/howWeWork"
              className="mt-0 rounded-lg border border-gray-800 bg-white px-6 py-3 text-center text-gray-800 hover:bg-gray-100 sm:mt-4"
            >
              {home.seeHowItWorks}
            </Link>
          </div>
          <span className="mt-2 flex flex-row items-center gap-2 text-sm text-neutral-600 dark:text-gray-400 sm:mt-5 sm:text-base">
            <FontAwesomeIcon icon={faDoorOpen} className="h-4" />
            {home.noRegistration}
          </span>
        </div>

        <div className="relative w-full rounded-2xl bg-neutral-200 p-4 sm:p-6 lg:max-w-136">
          <div className="relative h-80 w-full overflow-hidden rounded-2xl sm:h-96 lg:h-104">
            <Image
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=80"
              alt="Persona revisando finanzas con calculadora y ordenador"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover shadow-lg"
            />
          </div>

          <div className="mt-4 flex w-full flex-col items-start gap-2 rounded-2xl border border-gray-300 bg-white p-4 shadow-xl dark:border-gray-600 dark:bg-gray-700 sm:max-w-[16rem] lg:absolute lg:-bottom-5 lg:-left-8">
            <span> {home.suggestedWithholding} </span>
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-200"> 15.5% </span>
            <span className="h-1 w-1/2 rounded-full bg-black text-sm" />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start justify-center bg-gray-100 px-4 py-8 sm:px-8 sm:py-12">
        <div className="flex flex-col items-start">
          <h1 className="mb-2 text-3xl font-bold text-neutral-800">{home.precisionTitle}</h1>
          <h2 className="w-full text-sm font-bold text-neutral-500 sm:w-2/3">
            {home.precisionSubtitle}
          </h2>
        </div>

        <div className="mt-8 grid w-full gap-4 md:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 px-6 pb-8 text-neutral-600 sm:pb-12">
            <div className="bg-gray-200 w-10 h-10 rounded-lg flex items-center justify-center mb-3 border border-gray-300 inner-shadow dark:bg-gray-700 dark:border-gray-600">
              <FontAwesomeIcon icon={faScaleBalanced} className="h-3" />
            </div>
            <span className="font-bold text-2xl pb-6 text-gray-800">
              {" "}
              {home.precisionCardTitle}
            </span>
            <span> {home.precisionCardText}</span>
          </div>

          <div className="flex flex-col rounded-2xl border border-gray-700 bg-neutral-800 p-4 px-6 pb-8 text-neutral-200 sm:pb-12">
            <div className="bg-neutral-700 w-10 h-10 rounded-lg flex items-center justify-center mb-3 border border-gray-700 inner-shadow dark:bg-gray-700 dark:border-gray-600">
              <FontAwesomeIcon icon={faWallet} className="h-3" />
            </div>
            <span className="font-bold text-2xl pb-6 text-zinc-50">
              {" "}
              {home.multiplePayersCardTitle}
            </span>
            <span> {home.multiplePayersCardText}</span>
          </div>

          <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4 px-6 pb-8 sm:pb-12">
            <div className="bg-gray-200 w-10 h-10 rounded-lg flex items-center justify-center mb-3 border border-gray-300 inner-shadow dark:bg-gray-700 dark:border-gray-600">
              <FontAwesomeIcon icon={faArrowTrendUp} className="h-3" />
            </div>
            <span className="font-bold text-2xl pb-6 text-gray-800">
              {" "}
              {home.optimizationCardTitle}
            </span>
            <span> {home.optimizationCardText}</span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-white px-4 py-8 sm:px-8 sm:py-12">
        <div className="flex w-full max-w-6xl flex-col gap-6 rounded-2xl bg-neutral-100 px-5 py-8 sm:px-8 sm:py-10 lg:flex-row">
          <div className="flex flex-col lg:w-3/5">
            <span className="pb-4 text-3xl font-bold text-gray-800 sm:pb-6 sm:text-4xl">
              {home.realtimeTitle}
            </span>
            <span className="font-bold text-neutral-600"> {home.realtimeSubtitle}</span>

            <div className="flex flex-row mt-4 items-center justify-start gap-2">
              <FontAwesomeIcon icon={faCircleCheck} className="h-6" />

              <div className="flex flex-col ml-2">
                <span className="font-bold text-neutral-800"> {home.multiJurisdictionTitle}</span>
                <span className="text-neutral-500"> {home.multiJurisdictionText}</span>
              </div>
            </div>
            <div className="flex flex-row mt-4 items-center justify-start gap-2">
              <FontAwesomeIcon icon={faCircleCheck} className="h-6" />

              <div className="flex flex-col ml-2">
                <span className="font-bold text-neutral-800"> {home.exportTitle}</span>
                <span className="text-neutral-500"> {home.exportText}</span>
              </div>
            </div>
          </div>

          <div className="relative lg:w-2/5 w-full min-h-72 overflow-hidden rounded-2xl border border-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
              alt="Panel de analítica financiera en pantalla"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-2 px-4 py-10 sm:px-8 sm:py-12">
        <span className="text-center text-3xl font-bold text-gray-800 dark:text-gray-200 sm:text-4xl">
          {home.ctaTitle}
        </span>

        <span className="mb-3 w-full max-w-2xl text-center text-base text-gray-600 dark:text-gray-400 sm:text-lg">
          {home.ctaSubtitle}
        </span>

        <Link
          href="/stepper"
          className="mt-3 rounded-xl bg-neutral-800 px-8 py-3 font-bold text-white hover:bg-blue-600 sm:mt-4 sm:px-10 sm:py-4"
        >
          {home.simulateNow}
        </Link>
      </div>
    </div>
  );
}
