"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type LegalSection = {
  title: string;
  body: ReactNode;
};

export default function LegalPageShell({
  eyebrow,
  title,
  intro,
  lastUpdated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-24 pt-8 md:px-8 md:pt-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
        className="mx-auto"
      >
        <div className="grid gap-14 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-3 text-[#474a51]">
              <div>
                <p className="text-[18px] font-bold leading-7">{title}</p>
                <div className="mt-1 ml-[2px] border-l border-[#dedfe3] pl-3">
                  <a
                    href="#overview"
                    className="block py-1 text-[15px] leading-7 text-[#6a6d74] transition hover:text-[#111111]"
                  >
                    Overview
                  </a>
                </div>
              </div>
              <div>
                <p className="text-[18px] font-bold leading-7">Sections</p>
                <div className="mt-1 ml-[2px] border-l border-[#dedfe3] pl-3">
                  {sections.map((section) => {
                    const id = section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <a
                        key={section.title}
                        href={`#${id}`}
                        className="block py-1 text-[15px] leading-7 text-[#6a6d74] transition hover:text-[#111111]"
                      >
                        {section.title}
                      </a>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-[18px] font-bold leading-7">Links</p>
                <div className="mt-1 ml-[2px] border-l border-[#dedfe3] pl-3">
                  <Link
                    href="/usage"
                    className="block py-1 text-[15px] leading-7 text-[#6a6d74] transition hover:text-[#111111]"
                  >
                    Usage page
                  </Link>
                  <Link
                    href="/"
                    className="block py-1 text-[15px] leading-7 text-[#6a6d74] transition hover:text-[#111111]"
                  >
                    Back to icons
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          <div className="max-w-[760px] space-y-10">
            <section id="overview" className="scroll-mt-24">
              <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#8d939d]">{eyebrow}</p>
              <h1 className="mt-3 text-[30px] font-extrabold tracking-[-0.04em] text-[#3e4046] md:text-[44px]">
                {title}
              </h1>
              <p className="mt-5 max-w-[720px] text-[16px] leading-8 text-[#5e6168]">{intro}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[#737882]">
                <span className="inline-flex items-center rounded-full bg-[#f3f5f8] px-3 py-1 text-[12px] font-semibold text-[#58616d]">
                  Last updated: {lastUpdated}
                </span>
              </div>
            </section>

            {sections.map((section, index) => {
              const id = section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <motion.section
                  key={section.title}
                  id={id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 * index }}
                  className="scroll-mt-24"
                >
                  <h2 className="text-[24px] font-bold text-[#3f4146] md:text-[32px]">
                    {section.title}
                  </h2>
                  <div className="mt-5 space-y-4 text-[16px] leading-8 text-[#656972]">
                    {section.body}
                  </div>
                </motion.section>
              );
            })}

            <section className="rounded-[22px] border border-[#eceef2] bg-white px-6 py-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)]">
              <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-[#8d939d]">
                Need help?
              </p>
              <h3 className="mt-3 text-[28px] font-bold tracking-[-0.03em] text-[#3f4146]">
                Questions about these terms?
              </h3>
              <p className="mt-4 text-[16px] leading-8 text-[#656972]">
                If you need clarification about legal usage, policy details, or account-related
                questions, contact Bangalicon support and we&apos;ll help you with the right next step.
              </p>
              <div className="pt-5">
                <a
                  href="mailto:support@bangalicon.com"
                  className="inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#db161b]"
                >
                  Contact support
                </a>
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
