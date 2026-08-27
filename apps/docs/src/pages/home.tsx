import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import {
  Button,
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
} from '@antkit/react';
import { ArrowRightIcon, CheckIcon, CopyIcon } from 'lucide-react';

import { CodeBlock } from '../components/code-block';
import { HeroPreview } from '../components/hero-preview';
import { KeyboardPreview } from '../components/keyboard-preview';
import { GROUP_ICONS } from '../lib/group-icons';
import { useT } from '../lib/i18n';
import { prefersReducedMotion, useReveal } from '../lib/use-reveal';
import { GROUPS, REGISTRY } from '../registry';
import type { HomeSection } from '../lib/types';

const API_SNIPPET = `<Form form={form} onFinish={save}>
  <Form.Item
    name="email"
    label="Email"
    rules={[{ required: true, type: 'email' }]}
  >
    <Input />
  </Form.Item>

  <Form.Item name="plan" label="Plan">
    <Select options={plans} showSearch allowClear />
  </Form.Item>
</Form>

<Table columns={columns} dataSource={rows} rowKey="id" />

message.success('Saved');`;

const TOKENS_SNIPPET = `:root {
  --primary: #0071f9;
  --radius: 12px;
}

.dark {
  --primary: #4d8dff;
}`;

const INSTALL_SNIPPET = `pnpm add @antkit/react

/* app.css */
@import 'tailwindcss';
@import '@antkit/react/styles.css';`;

const AGENTS_SNIPPET = `# the guide, as a file your agent reads
npx antkit-skills

# the same material, as MCP tools
pnpm add -D @antkit/mcp`;

/** How long the numbers take to climb, and the entrance stagger step. */
const COUNT_MS = 900;
const STEP_MS = 90;

/** A copyable install command, the way daisyUI leads its hero. */
const CommandChip = ({ command }: { command: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground hover:shadow-md"
    >
      {copied ? (
        <CheckIcon className="size-3.5 shrink-0 text-green-500" />
      ) : (
        <CopyIcon className="size-3.5 shrink-0" />
      )}
      <span className="truncate">{command}</span>
    </button>
  );
};

/**
 * Fades a block up the first time it reaches the fold. `delay` staggers
 * siblings so a row of cards arrives as a wave rather than a wall.
 */
const Reveal = ({
  delay = 0,
  className = '',
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) => {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`${shown ? 'rise' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
};

/** Climbs to `value` once `run` flips, and lands on it exactly. */
const CountUp = ({ value, run }: { value: number; run: boolean }) => {
  const [at, setAt] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    if (!run || prefersReducedMotion()) return;

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - start) / COUNT_MS);
      setAt(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(frame);
  }, [run, value]);

  return <>{at}</>;
};

const Stats = () => {
  const t = useT();
  const { ref, shown } = useReveal<HTMLDListElement>();

  const stats = [
    {
      key: 'components',
      value: REGISTRY.length,
      label: t.home.stats.components,
    },
    { key: 'packages', value: 2, label: t.home.stats.packages },
    { key: 'buildSteps', value: 0, label: t.home.stats.buildSteps },
    { key: 'licence', value: 'MIT', label: t.home.stats.licence },
  ];

  return (
    <dl
      ref={ref}
      className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-4 lg:px-6"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.key}
          style={{ animationDelay: `${index * STEP_MS}ms` }}
          className={`grid gap-1 ${shown ? 'rise' : 'opacity-0'}`}
        >
          <dt className="text-4xl font-semibold tracking-tight tabular-nums">
            {typeof stat.value === 'number' ? (
              <CountUp value={stat.value} run={shown} />
            ) : (
              stat.value
            )}
          </dt>
          <dd className="text-sm text-muted-foreground">{stat.label}</dd>
        </div>
      ))}
    </dl>
  );
};

/** Every component name, going past. The kit's own `Marquee` renders it. */
const NameTicker = () => (
  <Marquee className="border-y border-border py-4">
    <MarqueeFade side="left" />
    <MarqueeFade side="right" />
    <MarqueeContent speed={34}>
      {REGISTRY.map((entry) => (
        <MarqueeItem key={entry.slug}>
          <a
            href={`/components/${entry.slug}`}
            className="block rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground"
          >
            {entry.title}
          </a>
        </MarqueeItem>
      ))}
    </MarqueeContent>
  </Marquee>
);

/**
 * The alternating band the middle of the page is made of: prose one side,
 * something running the other. `flip` puts the prose on the right.
 */
const Band = ({
  section,
  flip = false,
  children,
}: {
  section: HomeSection;
  flip?: boolean;
  children: ReactNode;
}) => (
  <Reveal>
    <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <div className={flip ? 'lg:order-2' : undefined}>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          {section.title}
        </h2>
        <p className="mt-5 text-base/7 text-muted-foreground lg:text-lg/8">
          {section.body}
        </p>
      </div>
      <div className={`min-w-0 ${flip ? 'lg:order-1' : ''}`}>{children}</div>
    </section>
  </Reveal>
);

const Gallery = () => {
  const t = useT();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GROUPS.map((group, index) => {
        const entries = REGISTRY.filter((entry) => entry.group === group);
        const Icon = GROUP_ICONS[group];

        return (
          <Reveal key={group} delay={index * STEP_MS}>
            <a
              href={`/components/${entries[0].slug}`}
              className="group grid h-full content-start gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="font-medium">{t.groups[group]}</span>
                <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                  {entries.length}
                </span>
              </div>

              <p className="text-sm/6 text-muted-foreground">
                {entries.map((entry) => entry.title).join(' · ')}
              </p>
            </a>
          </Reveal>
        );
      })}
    </div>
  );
};

export const Home = () => {
  const t = useT();
  const home = t.home;

  return (
    <div className="min-w-0">
      <section className="relative overflow-hidden border-b border-border">
        {/*
          Two soft washes rather than one: a single centred glow reads as a
          vignette, while an offset pair drifting at different speeds reads as
          light coming from somewhere.
        */}
        <div
          aria-hidden
          className="drift pointer-events-none absolute -top-40 -left-32 size-[36rem] rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="drift-reverse pointer-events-none absolute -top-24 right-0 size-[30rem] rounded-full bg-blue-400/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1fr_minmax(0,32rem)] lg:gap-16 lg:px-6 lg:py-24">
          <div className="grid justify-items-start gap-6">
            <div className="rise" style={{ animationDelay: '0ms' }}>
              <CommandChip command={home.installCommand} />
            </div>

            <h1
              className="rise text-4xl tracking-tight text-balance sm:text-5xl lg:text-6xl"
              style={{ animationDelay: `${STEP_MS}ms` }}
            >
              <span className="block font-semibold">{home.headlineLead}</span>
              <span className="block text-muted-foreground">
                {home.headlineRest}
              </span>
            </h1>

            <p
              className="rise max-w-xl text-base/7 text-muted-foreground"
              style={{ animationDelay: `${STEP_MS * 2}ms` }}
            >
              {home.subtitle(REGISTRY.length)}
            </p>

            <div
              className="rise flex flex-wrap gap-3"
              style={{ animationDelay: `${STEP_MS * 3}ms` }}
            >
              <Button
                asChild
                size="lg"
                suffix={
                  <ArrowRightIcon className="transition-transform group-hover/cta:translate-x-1" />
                }
              >
                <a href="/installation" className="group/cta">
                  {home.ctaStart}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/components/button">{home.ctaBrowse}</a>
              </Button>
            </div>

            <p
              className="rise flex items-center gap-2 text-sm text-muted-foreground"
              style={{ animationDelay: `${STEP_MS * 4}ms` }}
            >
              <CheckIcon className="size-4 shrink-0 text-green-500" />
              {home.trust}
            </p>
          </div>

          {/*
            Two elements, not one: `rise-right` ends on `transform: none` and
            would wipe the tilt off if they shared a node. Outer animates,
            inner holds the pose. Both live in index.css.
          */}
          <div className="rise-right" style={{ animationDelay: '150ms' }}>
            <div className="hero-tilt">
              <HeroPreview />
            </div>
          </div>
        </div>
      </section>

      <NameTicker />

      <section className="border-b border-border bg-muted/30">
        <Stats />
      </section>

      <div className="mx-auto grid max-w-6xl gap-20 px-4 py-20 lg:gap-28 lg:px-6 lg:py-28">
        <Band section={home.api}>
          <CodeBlock code={API_SNIPPET} collapsible={false} />
        </Band>

        <Band section={home.radix} flip>
          <KeyboardPreview />
        </Band>

        <Band section={home.tokens}>
          <CodeBlock code={TOKENS_SNIPPET} collapsible={false} />
        </Band>

        <Band section={home.agents} flip>
          <CodeBlock code={AGENTS_SNIPPET} collapsible={false} />
        </Band>

        <section className="grid gap-8">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              {home.gallery.title(GROUPS.length, REGISTRY.length)}
            </h2>
            <p className="mt-5 text-base/7 text-muted-foreground lg:text-lg/8">
              {home.gallery.body}
            </p>
          </Reveal>

          <Gallery />

          <Reveal className="justify-self-start">
            <Button asChild variant="outline">
              <a href="/components/button">{home.gallery.cta}</a>
            </Button>
          </Reveal>
        </section>

        <Reveal>
          <section className="grid gap-8 rounded-2xl border border-border bg-card p-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-12">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                {home.install.title}
              </h2>
              <p className="mt-5 text-base/7 text-muted-foreground">
                {home.install.body}
              </p>
              <Button
                asChild
                className="mt-6"
                suffix={
                  <ArrowRightIcon className="transition-transform group-hover/cta:translate-x-1" />
                }
              >
                <a href="/installation" className="group/cta">
                  {home.install.cta}
                </a>
              </Button>
            </div>

            <CodeBlock code={INSTALL_SNIPPET} collapsible={false} />
          </section>
        </Reveal>
      </div>
    </div>
  );
};
