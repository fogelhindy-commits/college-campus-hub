import { MetricCard, Panel, TinyBadge } from "@/components/portal-ui";

const services = [
  {
    title: "Weddings",
    description:
      "Tasteful ceremony flow, polished announcements, and a packed dance floor that still feels elegant.",
  },
  {
    title: "Club Nights",
    description:
      "High-BPM blends, clean transitions, and the kind of momentum that keeps the room locked in.",
  },
  {
    title: "Private Events",
    description:
      "Birthdays, rooftop parties, and milestone celebrations with a setlist shaped around your crowd.",
  },
];

const setList = [
  {
    time: "Golden hour",
    title: "Warm-up groove",
    detail: "Disco, edits, and house cuts that build the room without rushing the moment.",
  },
  {
    time: "Peak hour",
    title: "Dance floor ignition",
    detail: "Big hooks, confident drops, and seamless genre changes that keep everyone moving.",
  },
  {
    time: "Last call",
    title: "Hands-up finale",
    detail: "One more anthem, one more chorus, and a closing stretch people will talk about tomorrow.",
  },
];

const socialLinks = [
  { label: "Instagram", href: "mailto:hello@djpulse.studio" },
  { label: "SoundCloud", href: "mailto:hello@djpulse.studio" },
  { label: "Book by email", href: "mailto:hello@djpulse.studio?subject=Booking%20Inquiry" },
];

export function PublicLanding() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-border bg-panel/95 px-5 py-4 shadow-[var(--shadow)] backdrop-blur-xl sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-accent text-lg font-bold text-white shadow-[0_18px_36px_rgba(14,148,136,0.24)]">
              DJ
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
                DJ website
              </p>
              <p className="text-lg font-semibold text-foreground">DJ Pulse</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-3 text-sm font-medium text-muted">
            <a href="#services" className="transition hover:text-foreground">
              Services
            </a>
            <a href="#mixes" className="transition hover:text-foreground">
              Mixes
            </a>
            <a href="#contact" className="transition hover:text-foreground">
              Contact
            </a>
          </nav>
        </header>

        <section className="relative overflow-hidden rounded-[36px] border border-border bg-panel shadow-[var(--shadow)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,148,136,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(240,108,78,0.15),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.58),transparent_34%)]" />
          <div className="absolute -left-24 top-6 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />
          <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-10">
            <div className="flex flex-col gap-7">
              <div className="flex flex-wrap gap-3">
                <TinyBadge tone="brand">DJ portfolio</TinyBadge>
                <TinyBadge>Live bookings</TinyBadge>
                <TinyBadge tone="accent">Custom mixes</TinyBadge>
              </div>

              <div className="max-w-3xl">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
                  High-energy sets for weddings, clubs, and private events
                </p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  DJ Pulse makes the room feel like the headliner.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-ink-soft sm:text-lg">
                  This is a bold booking site with cinematic visuals, service cards,
                  mix highlights, and an easy contact flow. It&apos;s built to feel
                  like a polished nightlife brand from the first scroll.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-[#0b7f74]"
                >
                  Book a date
                </a>
                <a
                  href="#mixes"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-white/75 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:bg-white"
                >
                  Hear the vibe
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <MetricCard
                  label="Best fit"
                  value="Elegant + loud"
                  detail="A DJ style that can handle a formal first dance and a full-pressure late set."
                />
                <MetricCard
                  label="Energy"
                  value="Crowd-first"
                  detail="Every transition is chosen to keep the room moving, not just the playlist."
                />
                <MetricCard
                  label="Add-ons"
                  value="Lights + edits"
                  detail="Optional lighting cues, custom edits, and intro moments for a more tailored set."
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-[28px] border border-border bg-white/78 p-6 shadow-[0_18px_48px_rgba(18,32,51,0.08)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.26em] text-muted">
                      Now playing
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-foreground">
                      Sunset Heatwave Mix
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      The kind of opening sequence that starts classy and ends with
                      people on their feet.
                    </p>
                  </div>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-accent text-sm font-bold text-white shadow-[0_14px_30px_rgba(240,108,78,0.18)]">
                    01
                  </div>
                </div>

                <div className="mt-6 flex h-28 items-end gap-2">
                  {[34, 58, 82, 61, 94, 72, 48, 88].map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className="flex-1 rounded-full bg-gradient-to-t from-brand via-accent to-brand"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-brand-soft p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-brand">
                      Style
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      House, pop, disco
                    </p>
                  </div>
                  <div className="rounded-2xl bg-accent-soft p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                      Pace
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      Smooth build, big payoff
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#f5efe6] p-4">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-foreground/70">
                      Format
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      Weddings, clubs, private sets
                    </p>
                  </div>
                </div>
              </div>

              <Panel>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                  Availability
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">
                  Open for bookings this season
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Reach out early if you want a custom playlist, a clean MC flow, or
                  a fully built event timeline.
                </p>
              </Panel>
            </div>
          </div>
        </section>

        <section id="services" className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <Panel key={service.title}>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                Service
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-foreground">
                {service.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">{service.description}</p>
            </Panel>
          ))}
        </section>

        <section id="mixes" className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Panel>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
              Featured sets
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Built like a show, not just a playlist.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
              The pacing, transitions, and energy shifts are planned so the room
              keeps moving from the first warm-up track to the last encore.
            </p>

            <div className="mt-8 space-y-4">
              {setList.map((item, index) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-[24px] border border-border bg-white/72 p-4"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand/20 to-accent/20 font-mono text-xs font-bold uppercase tracking-[0.22em] text-foreground">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                      {item.time}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
              What you get
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              A booking experience that feels premium.
            </h2>

            <div className="mt-6 grid gap-3">
              {[
                "Custom music curation for your crowd",
                "Professional mic work and announcements",
                "Flexible set lengths and event pacing",
                "Optional lighting and hype moments",
                "Clear communication before the event",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border bg-[#fdfaf5] px-4 py-3 text-sm font-medium text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] bg-gradient-to-r from-brand/12 via-white to-accent/12 p-5">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                Socials
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-brand/30 hover:text-brand"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </Panel>
        </section>

        <section id="contact" className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Panel>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
              Contact
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              Ready to book your night?
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
              Send the event details and the style you want. This template opens your
              email app, so it stays simple and fast on desktop or mobile.
            </p>

            <div className="mt-6 space-y-3 text-sm text-muted">
              <p>
                Email:{" "}
                <a
                  href="mailto:hello@djpulse.studio"
                  className="font-semibold text-foreground underline decoration-brand/40 decoration-2 underline-offset-4"
                >
                  hello@djpulse.studio
                </a>
              </p>
              <p>Phone: +1 (555) 014-2034</p>
              <p>Base: New York, NY</p>
            </div>
          </Panel>

          <Panel>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
              Booking form
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-foreground">
              Tell me about the event
            </h2>
            <form
              action="mailto:hello@djpulse.studio?subject=Booking%20Inquiry"
              method="post"
              encType="text/plain"
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              <input
                name="name"
                placeholder="Your name"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand"
                required
              />
              <input
                name="event"
                placeholder="Event type"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand"
                required
              />
              <input
                name="date"
                type="date"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand"
                required
              />
              <input
                name="venue"
                placeholder="Venue or city"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand"
                required
              />
              <textarea
                name="details"
                placeholder="Tell me the vibe, guest count, and any special requests"
                rows={5}
                className="sm:col-span-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand"
                required
              />
              <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-[#dd5e3f]"
                >
                  Send booking request
                </button>
                <span className="text-xs text-muted">
                  Opens your email app with the form details.
                </span>
              </div>
            </form>
          </Panel>
        </section>

        <footer className="flex flex-col gap-3 py-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>DJ Pulse. Built for bookings, mixes, and crowd-moving nights.</p>
          <p>Use this as a starting point and swap in your name, links, and email.</p>
        </footer>
      </div>
    </main>
  );
}
