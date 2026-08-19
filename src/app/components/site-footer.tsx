export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto] md:items-start lg:px-8">
        <div className="max-w-2xl space-y-2">
          <p className="font-semibold text-slate-950 dark:text-white">
            Kiwi ScamCheck
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A privacy-first tool for identifying common scam warning signs.
          </p>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Kiwi ScamCheck identifies warning signs and does not guarantee that
            a message is safe or fraudulent.
          </p>
        </div>

        <nav aria-label="Footer navigation" className="flex gap-5 text-sm">
          <a
            href="#about"
            className="rounded font-medium text-slate-600 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 dark:focus-visible:outline-emerald-400"
          >
            About
          </a>
          <a
            href="#privacy"
            className="rounded font-medium text-slate-600 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 dark:focus-visible:outline-emerald-400"
          >
            Privacy
          </a>
        </nav>

        <p className="text-xs text-slate-500 md:col-span-2 dark:text-slate-500">
          © 2026 Kiwi ScamCheck · Built by Nirankar Jaiswar
        </p>
      </div>
    </footer>
  );
}
