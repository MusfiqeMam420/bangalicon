import type { Metadata } from "next";
import Link from "next/link";
import { SHOW_PRICING } from "../lib/features";
import CopyCodeButton from "@/components/CopyCodeButton";
import { getFreeIconCssHref } from "../lib/iconCdn";
import { createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Usage Guide",
  path: "/usage",
  description:
    "Install Bangalicon with CDN or packages, learn font usage, and follow React, Vue, Svelte, and Figma integration guides with real copy-ready examples.",
  keywords: [
    "usage guide",
    "install icon library",
    "React icon package",
    "Vue icon package",
    "Svelte icon package",
    "Figma plugin install",
  ],
});

const freeCssLink = getFreeIconCssHref();

const quickInstallFlowCode = `1. Load Bangalicon with CDN or local CSS.
2. Choose the correct icon family prefix: bg, bgs, or bgl.
3. Apply size and color with normal CSS rules.
4. Move to React, Vue, or Svelte packages when your project needs components.`;

const importCssCode = `<link rel="stylesheet" href="${freeCssLink}">`;

const basicUsageCode = `<i class="bg bg-cart-check"></i> <!---regular--->
<i class="bgs bgs-check-circle"></i> <!---solid--->
<i class="bgl bgl-pinterest"></i> <!---brand--->`;

const templateCode = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Bangalicon CSS --->
<link rel="stylesheet" href="${freeCssLink}">
<title>Document</title>
</head>
<body>
<!-- Icon --->
<i class="bg-check-circle"></i>
</body>
</html>`;

const reactQuickStartCode = `import { CartCheck } from "@bangalicon/react";

export default function Example() {
  return <CartCheck size={24} color="#111111" />;
}`;

const vueQuickStartCode = `<script setup>
import { CartCheck } from "@bangalicon/vue";
</script>

<template>
  <CartCheck :size="24" color="#111111" />
</template>`;

const svelteQuickStartCode = `<script>
  import { CartCheck } from "@bangalicon/svelte";
</script>

<CartCheck size={24} color="#111111" />`;

const figmaPluginCode = `1. Open the Bangalicon plugin page in Figma.
2. Install the plugin into your workspace.
3. Search and insert icons directly into your designs.
4. Keep design and development aligned with the same icon names.`;

const frameworkPropsCode = `<CartCheck size={24} color="#db161b" opacity={0.8} />`;

const treeShakingCode = `// Only CartCheck is bundled
import { CartCheck } from "@bangalicon/react";`;

const frameworkNamingCode = `cart-check -> <CartCheck />
warning-circle -> <WarningCircle />
view-table -> <ViewTable />`;

const frameworkTypescriptCode = `import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
  opacity?: number;
}`;

const usingOnWebCode = `<link rel="stylesheet" href="/assets/bangalicon/bangalicon.min.css">`;

const sizeCode = `.bg-cart-check {
  font-size: 48px;
}`;

const colorCode = `.bg-cart-check {
  color: #db161b;
}`;

const opacityCode = `.bg-cart-check {
  opacity: 0.7;
}`;

const alignmentCode = `.button-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}`;

const accessibilityCode = `<i class="bg bg-eye" aria-hidden="true"></i>`;

const navItems = [
  {
    title: "Getting Started",
    href: "#getting-started",
    children: [
      { title: "What Bangalicon includes", href: "#what-is-included" },
      { title: "Quick install flow", href: "#quick-install-flow" },
    ],
  },
  {
    title: "Usage as a Font",
    href: "#font-usage",
    children: [
      { title: "Import the CSS", href: "#import-css" },
      { title: "Basic usage", href: "#basic-usage" },
    ],
  },
  {
    title: "Template",
    href: "#template",
  },
  {
    title: "Packages",
    href: "#packages",
    children: [
      { title: "React install", href: "#react" },
      { title: "Vue install", href: "#vue" },
      { title: "Svelte install", href: "#svelte" },
      { title: "Figma Plugin", href: "#figma-plugin" },
      { title: "Framework props", href: "#framework-props" },
      { title: "Tree shaking", href: "#tree-shaking" },
      { title: "Naming convention", href: "#framework-naming" },
      { title: "TypeScript", href: "#framework-typescript" },
    ],
  },
  {
    title: "Download use",
    href: "#download-use",
    children: [
      { title: "Download zip", href: "#download-zip" },
      { title: "Using on the web", href: "#using-on-web" },
    ],
  },
  {
    title: "Style",
    href: "#style",
    children: [
      { title: "Size", href: "#size" },
      { title: "Color", href: "#color" },
      { title: "Opacity", href: "#opacity" },
      { title: "Alignment", href: "#alignment" },
    ],
  },
  {
    title: "Best practice",
    href: "#best-practice",
    children: [
      { title: "Naming system", href: "#naming-system" },
      { title: "Performance", href: "#performance" },
      { title: "Accessibility", href: "#accessibility" },
    ],
  },
  {
    title: "Contribution",
    href: "#contribution",
  },
  {
    title: "About",
    href: "#about",
  },
  {
    title: "FAQ",
    href: "#faq",
  },
];

const usageFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I keep icons updated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you use the CDN version, new public releases can be reflected automatically depending on your version strategy. If you need a more controlled setup, use a pinned asset version or download the files locally.",
      },
    },
    {
      "@type": "Question",
      name: "Can I mix CSS and package usage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Many teams use CSS for marketing pages and framework packages for the main app. That approach works well as long as naming and visual styling stay consistent.",
      },
    },
    {
      "@type": "Question",
      name: "Which icon style should I choose?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use regular icons for standard interface clarity, solid icons when you need stronger emphasis, and brand icons for services, platforms, and recognizable product marks.",
      },
    },
  ],
};

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-[8px] bg-white px-2 py-0 text-[12px] font-semibold text-[#db161b] shadow-[0_0_0_1px_rgba(219,22,27,0.08)]">
      {children}
    </span>
  );
}

function CodePanel({
  children,
  copyValue,
  copyMessage,
}: {
  children: React.ReactNode;
  copyValue?: string;
  copyMessage?: string;
}) {
  return (
    <div className="mt-5 overflow-hidden rounded-[14px] bg-[#191e28] px-5 py-4 shadow-[0_12px_30px_rgba(17,17,17,0.08)]">
      <div className="flex items-start gap-3">
        <pre className="min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-6 text-white">
          {children}
        </pre>
        {copyValue ? (
          <CopyCodeButton
            text={copyValue}
            successMessage={copyMessage || "Code copied"}
            className="mt-0.5"
          />
        ) : null}
      </div>
    </div>
  );
}

function CodeWord({
  children,
  tone = "white",
}: {
  children: React.ReactNode;
  tone?: "white" | "blue" | "red" | "green" | "gray";
}) {
  const tones = {
    white: "text-white",
    blue: "text-[#7bc6ff]",
    red: "text-[#ff8d82]",
    green: "text-[#a7df77]",
    gray: "text-[#b9c0ca]",
  };

  return <span className={tones[tone]}>{children}</span>;
}

function InstallCommandLine({ command }: { command: string }) {
  const parts = command.trim().split(/\s+/);
  const packageName = parts.pop() || "";
  const runner = parts.join(" ");

  return (
    <>
      <CodeWord tone="blue">{runner}</CodeWord>
      <CodeWord> </CodeWord>
      <CodeWord tone="red">{packageName}</CodeWord>
    </>
  );
}

function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-[26px] font-extrabold tracking-[-0.04em] text-[#3e4046] md:text-[36px]">
        {title}
      </h2>
      <div className="mt-5 space-y-5 text-[15px] leading-7 text-[#5e6168]">{children}</div>
    </section>
  );
}

function MiniHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h3 id={id} className="scroll-mt-24 text-[20px] font-bold text-[#3f4146]">
      {children}
    </h3>
  );
}

function IconShowcase() {
  return (
    <div className="mt-4 rounded-[14px] bg-[#191e28] px-5 py-5">
      <div className="flex items-center gap-5 text-white">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[28px] text-[#19202a]">
          <i className="bgs bgs-check-circle" />
        </span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[28px] text-[#19202a]">
          <i className="bg bg-check-circle" />
        </span>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[28px] text-[#19202a]">
          <i className="bgl bgl-pinterest" />
        </span>
      </div>
    </div>
  );
}

function PackageBlock({
  id,
  title,
  packageName,
  summary,
  installCommands,
  quickStartCode,
  features,
  children,
}: {
  id: string;
  title: string;
  packageName: string;
  summary: string;
  installCommands: { label: string; command: string }[];
  quickStartCode: string;
  features: string[];
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[24px] font-bold tracking-[-0.03em] text-[#33476b]">{title}</h3>
        <span className="inline-flex items-center rounded-full border border-[#e7eaf0] bg-[#f8f9fb] px-3 py-1 text-[12px] font-semibold text-[#58616d]">
          {packageName}
        </span>
      </div>

      <p className="mt-5 max-w-[860px] text-[15px] leading-7 text-[#5e6168]">{summary}</p>

      <div className="mt-10">
        <p className="text-[12px] font-bold uppercase tracking-[0.32em] text-[#8d939d]">
          Installation
        </p>
        <CodePanel copyValue={installCommands.map((item) => item.command).join("\n# or\n")}>
          {installCommands.map((item, index) => (
            <span key={`${title}-${item.label}`}>
              <InstallCommandLine command={item.command} />
              {index < installCommands.length - 1 ? (
                <>
                  {"\n"}
                  <CodeWord tone="gray"># or</CodeWord>
                  {"\n"}
                </>
              ) : null}
            </span>
          ))}
        </CodePanel>
      </div>

      <div className="mt-8">
        <p className="text-[16px] font-semibold text-[#3f4146]">Quick start</p>
        <CodePanel copyValue={quickStartCode}>{children}</CodePanel>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {features.map((feature) => (
          <span
            key={feature}
            className="inline-flex items-center rounded-full border border-[#e6e9ef] bg-[#f7f8fb] px-3 py-1 text-[11px] font-semibold text-[#58616d]"
          >
            {feature}
          </span>
        ))}
      </div>
    </section>
  );
}

export default function UsagePage() {
  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-24 pt-8 md:px-8 md:pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(usageFaqJsonLd) }}
      />
      <details className="group mb-4 overflow-hidden rounded-[20px] border border-[#e3e4e6] bg-white  transition-shadow duration-300 ease-out  lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[14px] font-semibold text-[#3f4146] transition-colors duration-300 ease-out [&::-webkit-details-marker]:hidden">
          <span>On this page</span>
          <span className="flex items-center gap-2 text-[11px] font-medium text-[#8d939d]">
            <span className="transition duration-300 group-open:opacity-0 group-open:[width:0px]">
             
            </span>
            <span className="hidden transition duration-300 group-open:inline">
              
            </span>
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 ease-out group-open:rotate-180"
              fill="none"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </summary>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="border-t border-[#eceef2] px-5 py-4 opacity-0 translate-y-[-10px] scale-[0.985] origin-top transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:translate-y-0 group-open:scale-100 group-open:opacity-100">
              <nav className="space-y-3 text-[#474a51]">
                {navItems.map((item) => (
                  <div key={item.title}>
                    <a href={item.href} className="text-[15px] font-bold leading-6">
                      {item.title}
                    </a>
                    {item.children ? (
                      <div className="mt-1 ml-[2px] border-l border-[#dedfe3] pl-3">
                        {item.children.map((child) => (
                          <a
                            key={child.title}
                            href={child.href}
                            className="block py-1 text-[13px] leading-6 text-[#6a6d74] transition hover:text-[#111111]"
                          >
                            {child.title}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </details>

      <div className="grid gap-14 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <nav className="space-y-3 text-[#474a51]">
            {navItems.map((item) => (
              <div key={item.title}>
                <a href={item.href} className="text-[16px] font-bold leading-6">
                  {item.title}
                </a>
                {item.children ? (
                  <div className="mt-1 ml-[2px] border-l border-[#dedfe3] pl-3">
                    {item.children.map((child) => (
                      <a
                        key={child.title}
                        href={child.href}
                        className="block py-1 text-[14px] leading-6 text-[#6a6d74] transition hover:text-[#111111]"
                      >
                        {child.title}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 max-w-[760px] space-y-12">
          <DocSection
            id="getting-started"
            title="Getting Started"
          >
            <p>
              Embark on your design journey with Bangalicon! Access an expansive library of icons
              instantly through our CDN infrastructure. Simplify your projects with seamless
              integration and customizable options. Whether you&apos;re a novice or a seasoned pro,
              Bangalicon empowers you to bring your creative visions to life. Get started and
              elevate your designs today!
            </p>

            <MiniHeading id="what-is-included">What Bangalicon includes</MiniHeading>
            <p>
              Bangalicon is built as one library with multiple ways to use it. You can load icons
              through the public CSS file, download the packaged assets for local projects, or use
              direct framework packages when working in React, Vue, or Svelte. That keeps the icon
              naming consistent across design, development, and export workflows.
            </p>
            <p>
              The system currently supports three icon groups: <InlineCode>bg</InlineCode> for
              regular icons, <InlineCode>bgs</InlineCode> for solid icons, and{" "}
              <InlineCode>bgl</InlineCode> for brand-style marks. This makes it easy to scan class
              names and understand the icon type immediately.
            </p>

            <MiniHeading id="quick-install-flow">Quick install flow</MiniHeading>
            <p>
              If you want the fastest setup, use the public stylesheet and start with HTML classes.
              If you are building an app with a component framework, install the matching package
              instead. Designers using Figma can use the plugin and keep names aligned with the web
              library.
            </p>
            <CodePanel copyValue={quickInstallFlowCode}>
              <CodeWord tone="green">1.</CodeWord>
              <CodeWord> Load Bangalicon with CDN or local CSS.</CodeWord>
              {"\n"}
              <CodeWord tone="green">2.</CodeWord>
              <CodeWord> Choose the correct icon family prefix: bg, bgs, or bgl.</CodeWord>
              {"\n"}
              <CodeWord tone="green">3.</CodeWord>
              <CodeWord> Apply size and color with normal CSS rules.</CodeWord>
              {"\n"}
              <CodeWord tone="green">4.</CodeWord>
              <CodeWord> Move to React, Vue, or Svelte packages when your project needs components.</CodeWord>
            </CodePanel>
          </DocSection>

          <DocSection id="font-usage" title="Usage as a Font">
            <MiniHeading id="import-css">Import the CSS</MiniHeading>
            <p>
              Copy the stylesheet <InlineCode>link</InlineCode> and paste into your{" "}
              <InlineCode>header</InlineCode> to load our CSS.
            </p>
            <CodePanel copyValue={importCssCode}>
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">link</CodeWord>
              <CodeWord> rel=</CodeWord>
              <CodeWord tone="red">&quot;stylesheet&quot;</CodeWord>
              <CodeWord> href=</CodeWord>
              <CodeWord tone="red">{`"${freeCssLink}"`}</CodeWord>
              <CodeWord>{">"}</CodeWord>
            </CodePanel>
            <p>This will load bangalicon font into your web.</p>

            <MiniHeading id="basic-usage">Basic usage</MiniHeading>
            <p>
              To use an icon on your page, add a prefix <InlineCode>bg</InlineCode> for regular
              icons, <InlineCode>bgs</InlineCode> for solid icons &amp; <InlineCode>bgl</InlineCode>{" "}
              for logos followed by the icon name and seperate class with the{" "}
              <InlineCode>bg</InlineCode>.
            </p>
            <CodePanel copyValue={basicUsageCode}>
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">i</CodeWord>
              <CodeWord> class=</CodeWord>
              <CodeWord tone="red">&quot;bg bg-cart-check&quot;</CodeWord>
              <CodeWord>{"></"}</CodeWord>
              <CodeWord tone="blue">i</CodeWord>
              <CodeWord>{">"}</CodeWord>
              <CodeWord tone="green"> {"<!---regular--->"}</CodeWord>
              {"\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">i</CodeWord>
              <CodeWord> class=</CodeWord>
              <CodeWord tone="red">&quot;bgs bgs-check-circle&quot;</CodeWord>
              <CodeWord>{"></"}</CodeWord>
              <CodeWord tone="blue">i</CodeWord>
              <CodeWord>{">"}</CodeWord>
              <CodeWord tone="green"> {"<!---solid--->"}</CodeWord>
              {"\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">i</CodeWord>
              <CodeWord> class=</CodeWord>
              <CodeWord tone="red">&quot;bgl bgl-pinterest&quot;</CodeWord>
              <CodeWord>{"></"}</CodeWord>
              <CodeWord tone="blue">i</CodeWord>
              <CodeWord>{">"}</CodeWord>
              <CodeWord tone="green"> {"<!---brand--->"}</CodeWord>
            </CodePanel>
            <p>Each icon has a regular and solid variant. Also bangalicon has Brand icons.</p>
            <IconShowcase />

            <p>
              Use the font workflow when you want the lightest possible integration and full
              control through CSS classes. This is especially useful for landing pages, static
              sites, server-rendered projects, CMS templates, and fast prototypes.
            </p>
          </DocSection>

          <DocSection id="template" title="Template">
            <p>Create an HTML document and copy the template and past on your HTML project</p>
            <CodePanel copyValue={templateCode}>
              <CodeWord tone="green">{"<!doctype html>"}</CodeWord>
              {"\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">html</CodeWord>
              <CodeWord> lang=</CodeWord>
              <CodeWord tone="red">&quot;en&quot;</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">head</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">meta</CodeWord>
              <CodeWord> charset=</CodeWord>
              <CodeWord tone="red">&quot;UTF-8&quot;</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">meta</CodeWord>
              <CodeWord> name=</CodeWord>
              <CodeWord tone="red">&quot;viewport&quot;</CodeWord>
              <CodeWord> content=</CodeWord>
              <CodeWord tone="red">&quot;width=device-width, initial-scale=1.0&quot;</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n"}
              <CodeWord tone="green">{"<!-- Bangalicon CSS --->"}</CodeWord>
              {"\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">link</CodeWord>
              <CodeWord> rel=</CodeWord>
              <CodeWord tone="red">&quot;stylesheet&quot;</CodeWord>
              <CodeWord> href=</CodeWord>
              <CodeWord tone="red">{`"${freeCssLink}"`}</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">title</CodeWord>
              <CodeWord>{">"}</CodeWord>
              <CodeWord tone="gray">Document</CodeWord>
              <CodeWord>{"</"}</CodeWord>
              <CodeWord tone="blue">title</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n"}
              <CodeWord>{"</"}</CodeWord>
              <CodeWord tone="blue">head</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">body</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n"}
              <CodeWord tone="green">{"<!-- Icon --->"}</CodeWord>
              {"\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">i</CodeWord>
              <CodeWord> class=</CodeWord>
              <CodeWord tone="red">&quot;bg-check-circle&quot;</CodeWord>
              <CodeWord>{"></"}</CodeWord>
              <CodeWord tone="blue">i</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n"}
              <CodeWord>{"</"}</CodeWord>
              <CodeWord tone="blue">body</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n"}
              <CodeWord>{"</"}</CodeWord>
              <CodeWord tone="blue">html</CodeWord>
              <CodeWord>{">"}</CodeWord>
            </CodePanel>
            <p>
              This template is the best starting point if you are testing icons outside a framework
              first. Once your icon names, sizing, and color rules feel right, you can move the
              same setup into your production project.
            </p>
          </DocSection>

          <DocSection id="packages" title="Packages">
            <p>
              Bangalicon also supports direct package integration for modern frontend stacks. Use
              the package that fits your project and keep your icon workflow consistent across React,
              Vue, Svelte, and Figma.
            </p>

            <PackageBlock
              id="react"
              title="React"
              packageName="@bangalicon/react"
              summary="Use the React package when you want tree-shakeable icon components with direct prop control for size, color, opacity, className, and standard SVG attributes."
              installCommands={[
                { label: "npm", command: "npm install @bangalicon/react" },
                { label: "yarn", command: "yarn add @bangalicon/react" },
                { label: "pnpm", command: "pnpm add @bangalicon/react" },
              ]}
              features={["Tree-shakeable", "Regular / Solid / Brand", "SVG props", "TypeScript ready"]}
              quickStartCode={reactQuickStartCode}
            >
              <CodeWord>import </CodeWord>
              <CodeWord>{"{"}</CodeWord>
              <CodeWord> CartCheck </CodeWord>
              <CodeWord>{"}"}</CodeWord>
              <CodeWord> from </CodeWord>
              <CodeWord tone="red">&quot;@bangalicon/react&quot;</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n\n"}
              <CodeWord>export default function </CodeWord>
              <CodeWord tone="blue">Example</CodeWord>
              <CodeWord>() {"{"}</CodeWord>
              {"\n  "}
              <CodeWord>return {"<"}</CodeWord>
              <CodeWord tone="blue">CartCheck</CodeWord>
              <CodeWord> size=</CodeWord>
              <CodeWord>{"{"}</CodeWord>
              <CodeWord tone="red">24</CodeWord>
              <CodeWord>{"}"}</CodeWord>
              <CodeWord> color=</CodeWord>
              <CodeWord tone="red">&quot;#111111&quot;</CodeWord>
              <CodeWord> /{">"};</CodeWord>
              {"\n"}
              <CodeWord>{"}"}</CodeWord>
            </PackageBlock>

            <PackageBlock
              id="vue"
              title="Vue"
              packageName="@bangalicon/vue"
              summary="Choose the Vue package when your project needs icon components inside templates, props for styling, and a naming system that stays aligned with the Bangalicon web library."
              installCommands={[
                { label: "npm", command: "npm install @bangalicon/vue" },
                { label: "yarn", command: "yarn add @bangalicon/vue" },
                { label: "pnpm", command: "pnpm add @bangalicon/vue" },
              ]}
              features={["Composition friendly", "Regular / Solid / Brand", "SVG props", "TypeScript ready"]}
              quickStartCode={vueQuickStartCode}
            >
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">script</CodeWord>
              <CodeWord> setup{">"}</CodeWord>
              {"\n"}
              <CodeWord>import </CodeWord>
              <CodeWord>{"{"}</CodeWord>
              <CodeWord> CartCheck </CodeWord>
              <CodeWord>{"}"}</CodeWord>
              <CodeWord> from </CodeWord>
              <CodeWord tone="red">&quot;@bangalicon/vue&quot;</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n"}
              <CodeWord>{"</"}</CodeWord>
              <CodeWord tone="blue">script</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">template</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n  "}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">CartCheck</CodeWord>
              <CodeWord> :size=</CodeWord>
              <CodeWord tone="red">&quot;24&quot;</CodeWord>
              <CodeWord> color=</CodeWord>
              <CodeWord tone="red">&quot;#111111&quot;</CodeWord>
              <CodeWord> /{">"}</CodeWord>
              {"\n"}
              <CodeWord>{"</"}</CodeWord>
              <CodeWord tone="blue">template</CodeWord>
              <CodeWord>{">"}</CodeWord>
            </PackageBlock>

            <PackageBlock
              id="svelte"
              title="Svelte"
              packageName="@bangalicon/svelte"
              summary="Pick the Svelte package when you want clean component imports, fast rendering, and easy control through normal component props without switching back to font classes."
              installCommands={[
                { label: "npm", command: "npm install @bangalicon/svelte" },
                { label: "yarn", command: "yarn add @bangalicon/svelte" },
                { label: "pnpm", command: "pnpm add @bangalicon/svelte" },
              ]}
              features={["Component based", "Regular / Solid / Brand", "SVG props", "TypeScript ready"]}
              quickStartCode={svelteQuickStartCode}
            >
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">script</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n  "}
              <CodeWord>import </CodeWord>
              <CodeWord>{"{"}</CodeWord>
              <CodeWord> CartCheck </CodeWord>
              <CodeWord>{"}"}</CodeWord>
              <CodeWord> from </CodeWord>
              <CodeWord tone="red">&quot;@bangalicon/svelte&quot;</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n"}
              <CodeWord>{"</"}</CodeWord>
              <CodeWord tone="blue">script</CodeWord>
              <CodeWord>{">"}</CodeWord>
              {"\n\n"}
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">CartCheck</CodeWord>
              <CodeWord> size=</CodeWord>
              <CodeWord>{"{"}</CodeWord>
              <CodeWord tone="red">24</CodeWord>
              <CodeWord>{"}"}</CodeWord>
              <CodeWord> color=</CodeWord>
              <CodeWord tone="red">&quot;#111111&quot;</CodeWord>
              <CodeWord> /{">"}</CodeWord>
            </PackageBlock>

            <section id="figma-plugin" className="scroll-mt-24 rounded-[22px] border border-[#eceef2] bg-white px-6 py-6 shadow-[0_14px_40px_rgba(17,17,17,0.04)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-[24px] font-bold tracking-[-0.03em] text-[#3f4146]">Figma Plugin</h3>
                <span className="inline-flex items-center rounded-full bg-[#f3f5f8] px-3 py-1 text-[11px] font-semibold text-[#58616d]">
                  Community plugin
                </span>
              </div>
              <p className="mt-5">
                Use the Bangalicon Figma plugin when you want to browse icons directly inside your
                design workflow. It gives designers quick access to the same library your frontend
                team uses on the web.
              </p>
              <CodePanel copyValue={figmaPluginCode}>
                <CodeWord tone="green">1.</CodeWord>
                <CodeWord> Open the Bangalicon plugin page in Figma.</CodeWord>
                {"\n"}
                <CodeWord tone="green">2.</CodeWord>
                <CodeWord> Install the plugin into your workspace.</CodeWord>
                {"\n"}
                <CodeWord tone="green">3.</CodeWord>
                <CodeWord> Search and insert icons directly into your designs.</CodeWord>
                {"\n"}
                <CodeWord tone="green">4.</CodeWord>
                <CodeWord> Keep design and development aligned with the same icon names.</CodeWord>
              </CodePanel>
              <div className="pt-5">
                <a
                  href="https://www.figma.com/community/plugin/1509149406843135161/bangalicon"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#db161b]"
                >
                  Open Figma Plugin
                </a>
              </div>
            </section>

            <MiniHeading id="framework-props">Framework props</MiniHeading>
            <p>
              The framework packages are built around direct component props. Use the component by
              name, then pass only the adjustments you need for that screen. That keeps the JSX,
              Vue template, or Svelte markup readable while staying consistent with the icon modal
              examples on the main site.
            </p>
            <CodePanel copyValue={frameworkPropsCode}>
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">CartCheck</CodeWord>
              <CodeWord> size=</CodeWord>
              <CodeWord>{"{"}</CodeWord>
              <CodeWord tone="red">24</CodeWord>
              <CodeWord>{"}"}</CodeWord>
              <CodeWord> color=</CodeWord>
              <CodeWord tone="red">&quot;#db161b&quot;</CodeWord>
              <CodeWord> opacity=</CodeWord>
              <CodeWord>{"{"}</CodeWord>
              <CodeWord tone="red">0.8</CodeWord>
              <CodeWord>{"}"}</CodeWord>
              <CodeWord> /{">"}</CodeWord>
            </CodePanel>

            <MiniHeading id="tree-shaking">Tree shaking</MiniHeading>
            <p>
              Bangalicon packages are meant to be imported icon by icon. That means your final app
              only carries the components you actually use instead of bundling the full library into
              every page.
            </p>
            <CodePanel copyValue={treeShakingCode}>
              <CodeWord tone="green">{"// Only CartCheck is bundled"}</CodeWord>
              {"\n"}
              <CodeWord tone="blue">import</CodeWord>
              <CodeWord> {"{ "}</CodeWord>
              <CodeWord>CartCheck</CodeWord>
              <CodeWord>{" } "}</CodeWord>
              <CodeWord tone="blue">from</CodeWord>
              <CodeWord> </CodeWord>
              <CodeWord tone="red">&quot;@bangalicon/react&quot;</CodeWord>
              <CodeWord>;</CodeWord>
            </CodePanel>

            <MiniHeading id="framework-naming">Naming convention</MiniHeading>
            <p>
              Bangalicon converts icon slugs into component-friendly names. A kebab-case icon such
              as <InlineCode>cart-check</InlineCode> becomes <InlineCode>CartCheck</InlineCode>.
              This keeps framework packages natural to use while staying aligned with the search and
              class names used across the site.
            </p>
            <CodePanel copyValue={frameworkNamingCode}>
              <CodeWord tone="gray">cart-check</CodeWord>
              <CodeWord> {"->"} </CodeWord>
              <CodeWord tone="white">{"<CartCheck />"}</CodeWord>
              {"\n"}
              <CodeWord tone="gray">warning-circle</CodeWord>
              <CodeWord> {"->"} </CodeWord>
              <CodeWord tone="white">{"<WarningCircle />"}</CodeWord>
              {"\n"}
              <CodeWord tone="gray">view-table</CodeWord>
              <CodeWord> {"->"} </CodeWord>
              <CodeWord tone="white">{"<ViewTable />"}</CodeWord>
            </CodePanel>

            <MiniHeading id="framework-typescript">TypeScript</MiniHeading>
            <p>
              The packages are designed to fit nicely into typed projects. You can pass regular SVG
              attributes alongside Bangalicon props, which makes the components easy to use inside
              product UI, form systems, and reusable design primitives.
            </p>
            <CodePanel copyValue={frameworkTypescriptCode}>
              <CodeWord tone="blue">import type</CodeWord>
              <CodeWord> {"{ SVGProps }"} </CodeWord>
              <CodeWord tone="blue">from</CodeWord>
              <CodeWord> </CodeWord>
              <CodeWord tone="red">&quot;react&quot;</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n\n"}
              <CodeWord tone="blue">type</CodeWord>
              <CodeWord> IconProps = SVGProps&lt;SVGSVGElement&gt; &amp; {"{"}</CodeWord>
              {"\n  "}
              <CodeWord>size?: </CodeWord>
              <CodeWord tone="red">number</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n  "}
              <CodeWord>color?: </CodeWord>
              <CodeWord tone="red">string</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n  "}
              <CodeWord>opacity?: </CodeWord>
              <CodeWord tone="red">number</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n"}
              <CodeWord>{"}"}</CodeWord>
            </CodePanel>
          </DocSection>

          <DocSection id="download-use" title="Download use">
            <MiniHeading id="download-zip">Download zip</MiniHeading>
            <p>
              Download the zip file from bangalicon that css is included! Extracting the zip file,
              you&apos;ll find a CSS file, <InlineCode>bangalicon.min.css</InlineCode> file.
            </p>
            <p>
              Local download is useful when you want project-level control, offline usage, or a
              fixed version stored with the rest of your assets. It also works nicely for agencies,
              template sellers, and internal dashboards that prefer shipping local files.
            </p>

            <MiniHeading id="using-on-web">Using on the web</MiniHeading>
            <p>
              Reference the extracted stylesheet in your project and keep the font files in the
              same relative structure for the icons to work properly.
            </p>
            <CodePanel copyValue={usingOnWebCode}>
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">link</CodeWord>
              <CodeWord> rel=</CodeWord>
              <CodeWord tone="red">&quot;stylesheet&quot;</CodeWord>
              <CodeWord> href=</CodeWord>
              <CodeWord tone="red">&quot;/assets/bangalicon/bangalicon.min.css&quot;</CodeWord>
              <CodeWord>{">"}</CodeWord>
            </CodePanel>
            <p>
              For production use, keep the CSS file and its related font assets together. If you
              move the stylesheet into another folder, update the internal font URLs so the browser
              can still resolve the icon files correctly.
            </p>
          </DocSection>

          <DocSection id="style" title="Style">
            <MiniHeading id="size">Size</MiniHeading>
            <p>
              You can control icon size with regular CSS. The font version follows the same sizing
              pattern as text.
            </p>
            <CodePanel copyValue={sizeCode}>
              <CodeWord tone="blue">.bg-cart-check</CodeWord>
              <CodeWord> {"{"}</CodeWord>
              {"\n  "}
              <CodeWord>font-size:</CodeWord> <CodeWord tone="red">48px</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n"}
              <CodeWord>{"}"}</CodeWord>
            </CodePanel>
            <p>
              You can also size icons through utility classes, inherited typography, or inline
              styles depending on your project structure. The icons behave best when you keep a
              clear size scale such as 16, 20, 24, 32, 48, and 64 pixels.
            </p>

            <MiniHeading id="color">Color</MiniHeading>
            <p>
              Bangalicon icons follow the current color, so changing the text color is enough to
              recolor your icon.
            </p>
            <CodePanel copyValue={colorCode}>
              <CodeWord tone="blue">.bg-cart-check</CodeWord>
              <CodeWord> {"{"}</CodeWord>
              {"\n  "}
              <CodeWord>color:</CodeWord> <CodeWord tone="red">#db161b</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n"}
              <CodeWord>{"}"}</CodeWord>
            </CodePanel>

            <MiniHeading id="opacity">Opacity</MiniHeading>
            <p>
              Opacity is useful for hover states, muted UI, empty cards, and layered toolbars. You
              can control it with normal CSS and combine it with color for softer presentation.
            </p>
            <CodePanel copyValue={opacityCode}>
              <CodeWord tone="blue">.bg-cart-check</CodeWord>
              <CodeWord> {"{"}</CodeWord>
              {"\n  "}
              <CodeWord>opacity:</CodeWord> <CodeWord tone="red">0.7</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n"}
              <CodeWord>{"}"}</CodeWord>
            </CodePanel>

            <MiniHeading id="alignment">Alignment</MiniHeading>
            <p>
              For buttons, tabs, badges, and nav links, wrap icons in a flex row so they align with
              text cleanly. This keeps your line-height, spacing, and hover areas predictable across
              desktop and mobile layouts.
            </p>
            <CodePanel copyValue={alignmentCode}>
              <CodeWord tone="blue">.button-with-icon</CodeWord>
              <CodeWord> {"{"}</CodeWord>
              {"\n  "}
              <CodeWord>display:</CodeWord> <CodeWord tone="red">inline-flex</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n  "}
              <CodeWord>align-items:</CodeWord> <CodeWord tone="red">center</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n  "}
              <CodeWord>gap:</CodeWord> <CodeWord tone="red">8px</CodeWord>
              <CodeWord>;</CodeWord>
              {"\n"}
              <CodeWord>{"}"}</CodeWord>
            </CodePanel>
          </DocSection>

          <DocSection id="best-practice" title="Best practice">
            <MiniHeading id="naming-system">Naming system</MiniHeading>
            <p>
              Bangalicon class names are intentionally direct. Keep icon naming tied to what users
              understand visually, not only what developers think internally. Short, readable names
              improve search, consistency, and design handoff.
            </p>
            <p>
              For example, a shopping icon should stay close to terms like cart, basket, checkout,
              or bag depending on the visual meaning. This makes the library easier to explore and
              more predictable across teams.
            </p>

            <MiniHeading id="performance">Performance</MiniHeading>
            <p>
              Use the CSS version when you want the smallest setup cost for simple pages, and use
              package imports when you want more component control in larger apps. In both cases,
              try to keep your UI consistent so icons do not jump between unrelated sizes and
              weights.
            </p>
            <p>
              A clean icon system improves more than appearance. It reduces naming confusion,
              speeds up implementation, and keeps the design language stable as the product grows.
            </p>

            <MiniHeading id="accessibility">Accessibility</MiniHeading>
            <p>
              If an icon is decorative, hide it from assistive tools. If it communicates meaning,
              pair it with visible text or an accessible label. Icons work best when they support
              content rather than replace important copy completely.
            </p>
            <CodePanel copyValue={accessibilityCode}>
              <CodeWord>{"<"}</CodeWord>
              <CodeWord tone="blue">i</CodeWord>
              <CodeWord> class=</CodeWord>
              <CodeWord tone="red">&quot;bg bg-eye&quot;</CodeWord>
              <CodeWord> aria-hidden=</CodeWord>
              <CodeWord tone="red">&quot;true&quot;</CodeWord>
              <CodeWord>{"></"}</CodeWord>
              <CodeWord tone="blue">i</CodeWord>
              <CodeWord>{">"}</CodeWord>
            </CodePanel>
          </DocSection>

          <DocSection id="contribution" title="Contribution">
            <p>
              Want to improve Bangalicon? You can request icons, report issues, or help shape the
              next release by sharing practical feedback from your workflow.
            </p>
            <p>
              The best feedback usually includes the icon need, expected meaning, preferred style
              family, and a short product context. That helps keep new additions useful for the
              broader library instead of solving only one isolated screen.
            </p>
          </DocSection>

          <DocSection id="about" title="About">
            <p>
              Bangalicon is a focused icon system made for fast browsing, simple CDN usage, and
              clean framework integration across modern frontend stacks.
            </p>
            <p>
              The goal is simple: one naming language, one visual direction, and multiple ways to
              use the same icon system across product UI, websites, component frameworks, and
              design tools.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-[#111111] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#db161b]"
              >
                Back to icons
              </Link>
              {SHOW_PRICING ? (
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-5 py-3 text-[13px] font-semibold text-[#42454b] transition hover:border-[#111111]"
                >
                  Pricing
                </Link>
              ) : null}
            </div>
          </DocSection>

          <DocSection id="faq" title="FAQ">
            <MiniHeading id="cdn-updates">How do I keep icons updated?</MiniHeading>
            <p>
              If you use the CDN version, new public releases can be reflected automatically
              depending on your version strategy. If you need a more controlled setup, use a pinned
              asset version or download the files locally.
            </p>

            <MiniHeading id="can-i-mix-usage">Can I mix CSS and package usage?</MiniHeading>
            <p>
              Yes. Many teams use CSS for marketing pages and framework packages for the main app.
              That approach works well as long as naming and visual styling stay consistent.
            </p>

            <MiniHeading id="which-style-should-i-use">Which icon style should I choose?</MiniHeading>
            <p>
              Use regular icons for standard interface clarity, solid icons when you need stronger
              emphasis, and brand icons for services, platforms, and recognizable product marks.
            </p>
          </DocSection>
        </main>
      </div>
    </div>
  );
}
