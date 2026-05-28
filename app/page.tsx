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
    <div className="flex flex-col flex-1 items-center justify-center  font-sans dark:bg-black">
      <div className=" bg-white shadow-lg px-8 py-12 flex-row flex w-full">
        <div className="flex flex-col items-start justify-center gap-6 w-full">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {home.heroTitle}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 w-2/3">
            {home.heroSubtitle}
          </h2>
          <div className="flex flex-row gap-4">
            <Link
              href="/stepper"
              className="mt-4 px-6 py-2 flex flex-row gap-2 items-center justify-center bg-gray-800 font-bold text-white rounded-lg hover:bg-blue-600"
            >
              {home.startSimulation}
              <FontAwesomeIcon icon={faArrowRight} className="h-5" />
            </Link>
            <Link
              href="/howWeWork"
              className="mt-4 px-6 py-2 bg-white border border-gray-800 text-gray-800 rounded-lg hover:bg-gray-100"
            >
              {home.seeHowItWorks}
            </Link>
          </div>
          <span className="text-neutral-600 dark:text-gray-400 mt-5 flex flex-row items-center gap-2">
            <FontAwesomeIcon icon={faDoorOpen} className="h-4" />
            {home.noRegistration}
          </span>
        </div>

        <div className="bg-neutral-200 rounded-2xl p-6 w-full max-w-125 relative">
          <div className="relative w-full min-h-105 overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=80"
              alt="Persona revisando finanzas con calculadora y ordenador"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-cover shadow-lg"
            />
          </div>

          <div className="flex flex-col items-start mt-4 gap-2 bg-white rounded-2xl p-4 border border-gray-300 inner-shadow dark:bg-gray-700 dark:border-gray-600 absolute -bottom-5 -left-8 w-1/2 shadow-2xl">
            <span> {home.suggestedWithholding} </span>
            <span className="text-3xl font-bold text-gray-800 dark:text-gray-200"> 15.5% </span>
            <span className="text-sm bg-black w-1/2 h-1 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full items-start justify-center bg-gray-100 px-8 py-12">
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-neutral-800 mb-2 text-3xl"> {home.precisionTitle}</h1>
          <h2 className="text-sm font-bold text-neutral-500 w-2/3">{home.precisionSubtitle}</h2>
        </div>

        <div className="flex flex-row items-center justify-center gap-4 w-full mt-8">
          <div className="flex flex-col rounded-2xl w-1/3 bg-white border border-gray-200 p-4 text-neutral-600 pb-12 px-6">
            <div className="bg-gray-200 w-10 h-10 rounded-lg flex items-center justify-center mb-3 border border-gray-300 inner-shadow dark:bg-gray-700 dark:border-gray-600">
              <FontAwesomeIcon icon={faScaleBalanced} className="h-3" />
            </div>
            <span className="font-bold text-2xl pb-6 text-gray-800">
              {" "}
              {home.precisionCardTitle}
            </span>
            <span> {home.precisionCardText}</span>
          </div>

          <div className="flex flex-col rounded-2xl w-1/3 bg-neutral-800 border border-gray-700 p-4 text-neutral-200 pb-12 px-6">
            <div className="bg-neutral-700 w-10 h-10 rounded-lg flex items-center justify-center mb-3 border border-gray-700 inner-shadow dark:bg-gray-700 dark:border-gray-600">
              <FontAwesomeIcon icon={faWallet} className="h-3" />
            </div>
            <span className="font-bold text-2xl pb-6 text-zinc-50">
              {" "}
              {home.multiplePayersCardTitle}
            </span>
            <span> {home.multiplePayersCardText}</span>
          </div>

          <div className="flex flex-col rounded-2xl w-1/3 bg-white border border-gray-200 p-4 pb-12 px-6">
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

      <div className="flex flex-col w-full items-center justify-center bg-white px-8 py-12">
        <div className="flex flex-col lg:flex-row bg-neutral-100 w-4/5 px-8 py-10 rounded-2xl gap-6">
          <div className="flex flex-col lg:w-3/5">
            <span className="font-bold text-4xl pb-6 text-gray-800"> {home.realtimeTitle} </span>
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

      <div className="flex flex-col w-full items-center justify-center px-8 py-12 gap-2">
        <span className="font-bold text-4xl text-gray-800 dark:text-gray-200">{home.ctaTitle}</span>

        <span className="text-lg text-gray-600 dark:text-gray-400 w-2/3 text-center mb-3">
          {home.ctaSubtitle}
        </span>

        <Link
          href="/stepper"
          className="bg-neutral-800 text-white px-10 py-4 rounded-xl font-bold mt-4 hover:bg-blue-600"
        >
          {home.simulateNow}
        </Link>
      </div>
    </div>
  );
}
