"use client";

import {
  faChartPie,
  faCompassDrafting,
  faGavel,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useI18n } from "../i18n/useI18n";

export default function HowWeWork() {
  const { dictionary } = useI18n();
  const howWeWork = dictionary.howWeWork;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
        <h1 className="mb-4 text-center text-3xl font-bold sm:text-4xl">{howWeWork.title}</h1>
        <p className="w-full max-w-3xl text-center text-base text-gray-600 sm:text-lg">
          {howWeWork.subtitle}
        </p>
      </div>

      <div className="grid w-full gap-6 bg-neutral-100 px-4 py-8 sm:px-8 sm:py-12 lg:grid-cols-3">
        <div className="flex flex-col items-start justify-center rounded-xl border border-neutral-100 bg-white p-6">
          <p className="rounded-full bg-neutral-800 p-6 text-white w-10 h-10 flex justify-center items-center mb-6">
            01
          </p>
          <p className="text-xl font-bold mb-2"> {howWeWork.step1Title} </p>
          <p className="text-gray-600">{howWeWork.step1Text}</p>
        </div>
        <div className="flex flex-col items-start justify-center rounded-xl border border-neutral-100 bg-white p-6">
          <p className="rounded-full bg-neutral-800 p-6 text-white w-10 h-10 flex justify-center items-center mb-6">
            02
          </p>
          <p className="text-xl font-bold mb-2"> {howWeWork.step2Title} </p>
          <p className="text-gray-600">{howWeWork.step2Text}</p>
        </div>
        <div className="flex flex-col items-start justify-center rounded-xl border border-neutral-100 bg-white p-6">
          <p className="rounded-full bg-neutral-800 p-6 text-white w-10 h-10 flex justify-center items-center mb-6">
            03
          </p>
          <p className="text-xl font-bold mb-2"> {howWeWork.step3Title} </p>
          <p className="text-gray-600">{howWeWork.step3Text}</p>
        </div>
      </div>

      <div className="grid w-full gap-4 bg-white px-4 py-8 sm:grid-cols-3 sm:gap-0 sm:p-12">
        <div className="flex flex-col items-center justify-center p-6">
          <FontAwesomeIcon icon={faCompassDrafting} className="h-10" />
          <p className="text-xl font-bold my-1"> {howWeWork.pillar1Title} </p>
          <p className="text-gray-600 text-center">{howWeWork.pillar1Text}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6">
          <FontAwesomeIcon icon={faUserShield} className="h-10" />
          <p className="text-xl font-bold my-1"> {howWeWork.pillar2Title} </p>
          <p className="text-gray-600 text-center">{howWeWork.pillar2Text}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6">
          <FontAwesomeIcon icon={faGavel} className="h-10" />
          <p className="text-xl font-bold my-1"> {howWeWork.pillar3Title} </p>
          <p className="text-gray-600 text-center">{howWeWork.pillar3Text}</p>
        </div>
      </div>

      <div className="relative mb-8 flex w-[calc(100%-2rem)] max-w-6xl flex-col gap-4 overflow-hidden rounded-xl bg-neutral-800 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-8">
        <div className="flex flex-col items-start justify-between sm:w-2/3">
          <p className="text-2xl font-bold text-white">{howWeWork.ctaTitle}</p>
          <p className="text-neutral-200">{howWeWork.ctaSubtitle}</p>
        </div>

        <Link
          href="/stepper"
          className="z-20 h-fit w-full rounded-xl bg-white px-6 py-3 text-center text-black sm:mx-2 sm:w-auto"
        >
          {howWeWork.ctaButton}
        </Link>

        <FontAwesomeIcon
          icon={faChartPie}
          className="pointer-events-none absolute -bottom-6 right-0 z-10 h-40 opacity-30 sm:h-52 sm:opacity-100"
        />
      </div>
    </div>
  );
}
