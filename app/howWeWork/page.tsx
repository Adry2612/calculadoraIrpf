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
import { useCalculadoraStore } from "../store/useCalculadoraStore";

export default function HowWeWork() {
  const { dictionary } = useI18n();
  const resetCalculation = useCalculadoraStore((state) => state.resetCalculation);
  const howWeWork = dictionary.howWeWork;

  return (
    <div className="flex-1">
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {howWeWork.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">{howWeWork.subtitle}</p>
        </div>

        <div className="mt-12 border-y border-slate-200">
          {[
            { title: howWeWork.step1Title, description: howWeWork.step1Text },
            { title: howWeWork.step2Title, description: howWeWork.step2Text },
            { title: howWeWork.step3Title, description: howWeWork.step3Text },
          ].map((step) => (
            <article
              key={step.title}
              className="grid gap-3 border-b border-slate-200 py-7 last:border-b-0 sm:grid-cols-[0.8fr_1.2fr] sm:gap-10 sm:py-9"
            >
              <h2 className="text-xl font-semibold tracking-tight text-slate-900">{step.title}</h2>
              <p className="max-w-2xl leading-7 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
          <h2 className="max-w-md text-3xl font-semibold tracking-tight text-slate-950">
            {howWeWork.pillar2Title}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            <article>
              <FontAwesomeIcon icon={faCompassDrafting} className="size-5 text-[#315a78]" />
              <h3 className="mt-3 font-semibold text-slate-900">{howWeWork.pillar1Title}</h3>
              <p className="mt-2 leading-6 text-slate-600">{howWeWork.pillar1Text}</p>
            </article>
            <article>
              <FontAwesomeIcon icon={faUserShield} className="size-5 text-[#315a78]" />
              <h3 className="mt-3 font-semibold text-slate-900">{howWeWork.pillar2Title}</h3>
              <p className="mt-2 leading-6 text-slate-600">{howWeWork.pillar2Text}</p>
            </article>
            <article className="sm:col-span-2">
              <FontAwesomeIcon icon={faGavel} className="size-5 text-[#315a78]" />
              <h3 className="mt-3 font-semibold text-slate-900">{howWeWork.pillar3Title}</h3>
              <p className="mt-2 max-w-2xl leading-6 text-slate-600">{howWeWork.pillar3Text}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            {howWeWork.ctaTitle}
          </h2>
          <p className="mt-2 text-slate-600">{howWeWork.ctaSubtitle}</p>
        </div>
        <Link
          href="/stepper"
          onClick={resetCalculation}
          className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-md bg-[#20394d] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#315a78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
        >
          {howWeWork.ctaButton}
          <FontAwesomeIcon icon={faChartPie} className="size-4" />
        </Link>
      </section>
    </div>
  );
}
