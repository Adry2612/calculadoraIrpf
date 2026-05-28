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
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center px-8 py-12">
        <h1 className="text-4xl font-bold mb-4">{howWeWork.title}</h1>
        <p className="text-lg text-gray-600 w-1/2 text-center">{howWeWork.subtitle}</p>
      </div>
      <div className="flex flex-row items-center justify-center px-8 py-12 bg-neutral-100 gap-6">
        <div className="flex flex-col items-start justify-center border border-neutral-100 bg-white w-2/7 rounded-xl p-6">
          <p className="rounded-full bg-neutral-800 p-6 text-white w-10 h-10 flex justify-center items-center mb-6">
            01
          </p>
          <p className="text-xl font-bold mb-2"> {howWeWork.step1Title} </p>
          <p className="text-gray-600">{howWeWork.step1Text}</p>
        </div>
        <div className="flex flex-col items-start justify-center border border-neutral-100 bg-white w-2/7 rounded-xl p-6">
          <p className="rounded-full bg-neutral-800 p-6 text-white w-10 h-10 flex justify-center items-center mb-6">
            02
          </p>
          <p className="text-xl font-bold mb-2"> {howWeWork.step2Title} </p>
          <p className="text-gray-600">{howWeWork.step2Text}</p>
        </div>
        <div className="flex flex-col items-start justify-center border border-neutral-100 bg-white w-2/7 rounded-xl p-6">
          <p className="rounded-full bg-neutral-800 p-6 text-white w-10 h-10 flex justify-center items-center mb-6">
            03
          </p>
          <p className="text-xl font-bold mb-2"> {howWeWork.step3Title} </p>
          <p className="text-gray-600">{howWeWork.step3Text}</p>
        </div>
      </div>

      <div className="flex flex-row bg-white p-12">
        <div className="flex flex-col items-center justify-center w-4/6 p-6">
          <FontAwesomeIcon icon={faCompassDrafting} className="h-10" />
          <p className="text-xl font-bold my-1"> {howWeWork.pillar1Title} </p>
          <p className="text-gray-600 text-center">{howWeWork.pillar1Text}</p>
        </div>
        <div className="flex flex-col items-center justify-center w-4/6 p-6">
          <FontAwesomeIcon icon={faUserShield} className="h-10" />
          <p className="text-xl font-bold my-1"> {howWeWork.pillar2Title} </p>
          <p className="text-gray-600 text-center">{howWeWork.pillar2Text}</p>
        </div>
        <div className="flex flex-col items-center justify-center w-4/6 p-6">
          <FontAwesomeIcon icon={faGavel} className="h-10" />
          <p className="text-xl font-bold my-1"> {howWeWork.pillar3Title} </p>
          <p className="text-gray-600 text-center">{howWeWork.pillar3Text}</p>
        </div>
      </div>

      <div className="w-8/9 bg-neutral-800 rounded-xl flex flex-row relative overflow-hidden">
        <div className="flex flex-col items-start justify-between w-4/6 px-6 py-12">
          <p className="text-white text-center text-2xl font-bold">{howWeWork.ctaTitle}</p>
          <p className="text-neutral-200">{howWeWork.ctaSubtitle}</p>
        </div>

        <Link
          href="/stepper"
          className="bg-white text-black rounded-xl px-6 py-3 h-fit self-center mx-6 z-20"
        >
          {howWeWork.ctaButton}
        </Link>

        <FontAwesomeIcon icon={faChartPie} className="absolute h-50 -bottom-5 right-0 z-10" />
      </div>
    </div>
  );
}
