import ScamChecker from "./scam-checker";

export default function Home() {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold tracking-wide text-emerald-800 uppercase">
            Privacy-first message checking
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Kiwi ScamCheck
          </h1>
          <p className="text-lg leading-8 text-slate-700">
            Check a suspicious message for common scam warning signs, including
            pressure tactics, requests for sensitive information, and suspicious
            links.
          </p>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950">
            <strong>Your message stays private.</strong> For the current version, your message is analysed locally in your browser and is not sent to our backend, stored, or logged.
          </div>
        </header>

        <ScamChecker />

        <footer className="border-t border-slate-200 pt-6 text-sm leading-6 text-slate-600">
          Kiwi ScamCheck identifies warning signs using a limited set of checks.
          Its result does not guarantee that a message is safe or fraudulent.
          Verify unexpected requests independently before taking action.
        </footer>
      </div>
    </main>
  );
}
