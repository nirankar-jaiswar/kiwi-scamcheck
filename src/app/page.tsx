import SiteFooter from "./components/site-footer";
import SiteHeader from "./components/site-header";
import ScamChecker from "./scam-checker";

const STEPS = [
  {
    number: "1",
    title: "Paste a suspicious message",
    description: "Choose where it arrived, then paste the message as received.",
  },
  {
    number: "2",
    title: "Local checks look for warning signs",
    description:
      "The browser checks for explainable patterns such as pressure, credential requests, and suspicious links.",
  },
  {
    number: "3",
    title: "Review the result",
    description:
      "Use the risk signals and recommended next steps to verify the request independently.",
  },
] as const;

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl space-y-5">
              <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase dark:text-emerald-300">
                Privacy-first message checking
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                Spot common scam warning signs before you act
              </h1>
              <p className="text-lg leading-8 text-slate-700 dark:text-slate-300">
                Kiwi ScamCheck helps you examine suspicious messages for
                pressure tactics, sensitive-information requests, and suspicious
                links.
              </p>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100">
                <strong>Your message stays private.</strong> In the current
                version, analysis runs locally in your browser.
              </div>
            </div>
          </div>
        </section>

        <section
          id="check"
          aria-label="Message checker"
          className="scroll-mt-24 px-4 pb-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <ScamChecker />
          </div>
        </section>

        <section
          id="how-it-works"
          aria-labelledby="how-it-works-heading"
          className="scroll-mt-24 border-y border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                A simple local check
              </p>
              <h2
                id="how-it-works-heading"
                className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white"
              >
                How it works
              </h2>
            </div>

            <ol className="mt-8 grid gap-5 md:grid-cols-3">
              {STEPS.map((step) => (
                <li
                  key={step.number}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-emerald-800 text-sm font-bold text-white dark:bg-emerald-500 dark:text-slate-950">
                    {step.number}
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <section
              id="about"
              aria-labelledby="about-heading"
              className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <h2
                id="about-heading"
                className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white"
              >
                About
              </h2>
              <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
                Kiwi ScamCheck is an early privacy-first scam-warning prototype.
                It focuses on explainable checks that help people notice warning
                signs, not definitive fraud classification.
              </p>
            </section>

            <section
              id="privacy"
              aria-labelledby="privacy-heading"
              className="scroll-mt-24 rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40"
            >
              <h2
                id="privacy-heading"
                className="text-2xl font-bold tracking-tight text-emerald-950 dark:text-emerald-100"
              >
                Privacy
              </h2>
              <p className="mt-3 leading-7 text-emerald-950 dark:text-emerald-100">
                Message analysis happens locally in your browser in the current
                version. Raw message content is not sent to the Kiwi ScamCheck
                backend, persisted, or logged. Future optional features must
                preserve this boundary unless you explicitly choose otherwise.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
