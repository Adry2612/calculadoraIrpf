"use client";

import {
  faArrowRight,
  faArrowTrendUp,
  faScaleBalanced,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "./i18n/useI18n";
import { useCalculadoraStore } from "./store/useCalculadoraStore";

export default function Home() {
  const { dictionary } = useI18n();
  const resetCalculation = useCalculadoraStore((state) => state.resetCalculation);
  const home = dictionary.home;

  return (
    <div className="flex-1">
      <section className="mx-auto grid min-h-[min(720px,calc(100dvh-64px))] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-semibold text-[#315a78]">{home.noRegistration}</p>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl">
            {home.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
            {home.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/stepper"
              onClick={resetCalculation}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-[#20394d] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#315a78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
            >
              {home.startSimulation}
              <FontAwesomeIcon icon={faArrowRight} className="size-3.5" />
            </Link>
            <Link
              href="/howWeWork"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315a78]"
            >
              {home.seeHowItWorks}
            </Link>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden rounded-xl bg-slate-200 sm:min-h-[440px]">
          <Image
            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1600&q=80"
            alt="Persona revisando sus finanzas"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 48vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
          <div>
            <h2 className="max-w-md text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {home.precisionTitle}
            </h2>
            <p className="mt-4 max-w-md leading-7 text-slate-600">{home.precisionSubtitle}</p>
          </div>

          <div className="grid gap-x-8 sm:grid-cols-2">
            <article className="border-t-2 border-[#315a78] py-5 sm:row-span-2 sm:py-6">
              <FontAwesomeIcon icon={faScaleBalanced} className="size-5 text-[#315a78]" />
              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                {home.precisionCardTitle}
              </h3>
              <p className="mt-2 max-w-sm leading-6 text-slate-600">{home.precisionCardText}</p>
            </article>
            <article className="border-t border-slate-200 py-5 sm:py-6">
              <FontAwesomeIcon icon={faWallet} className="size-5 text-[#315a78]" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {home.multiplePayersCardTitle}
              </h3>
              <p className="mt-2 leading-6 text-slate-600">{home.multiplePayersCardText}</p>
            </article>
            <article className="border-t border-slate-200 py-5 sm:py-6">
              <FontAwesomeIcon icon={faArrowTrendUp} className="size-5 text-[#315a78]" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {home.optimizationCardTitle}
              </h3>
              <p className="mt-2 leading-6 text-slate-600">{home.optimizationCardText}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="relative min-h-[280px] overflow-hidden rounded-xl bg-slate-200 sm:min-h-[360px]">
          <Image
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
            alt="Gráficos financieros en una pantalla"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {home.realtimeTitle}
          </h2>
          <p className="mt-4 leading-7 text-slate-600">{home.realtimeSubtitle}</p>
          <div className="mt-8 space-y-6">
            <div className="border-l-2 border-[#315a78] pl-4">
              <h3 className="font-semibold text-slate-900">{home.multiJurisdictionTitle}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{home.multiJurisdictionText}</p>
            </div>
            <div className="border-l-2 border-slate-300 pl-4">
              <h3 className="font-semibold text-slate-900">{home.exportTitle}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{home.exportText}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
