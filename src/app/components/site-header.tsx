import ThemeToggle from "./theme-toggle";

const NAVIGATION = [
  { href: "#check", label: "Check" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#about", label: "About" },
] as const;

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-slate-950 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 dark:text-white dark:focus-visible:outline-emerald-400"
        >
          Kiwi ScamCheck
        </a>

        <nav
          aria-label="Primary navigation"
          className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6"
        >
          {NAVIGATION.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded text-sm font-medium text-slate-600 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 dark:focus-visible:outline-emerald-400"
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
