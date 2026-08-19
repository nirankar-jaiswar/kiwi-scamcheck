"use client";

import { useState } from "react";

import { analyseMessage } from "@kiwi-scamcheck/scam-engine";

const MAX_MESSAGE_LENGTH = 5000;

const CHANNEL_OPTIONS = [
  { value: "unknown", label: "Unknown" },
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
  { value: "marketplace", label: "Marketplace" },
  { value: "social", label: "Social" },
] as const;

type Channel = (typeof CHANNEL_OPTIONS)[number]["value"];
type AnalysisResult = ReturnType<typeof analyseMessage>;

const RISK_STYLES: Record<AnalysisResult["riskLevel"], string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100",
  medium:
    "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100",
  high: "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100",
  critical:
    "border-red-300 bg-red-100 text-red-950 dark:border-red-800 dark:bg-red-950/70 dark:text-red-100",
};

export default function ScamChecker() {
  const [channel, setChannel] = useState<Channel>("unknown");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const canSubmit = message.trim().length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setResult(analyseMessage({ text: message, channel }));
  }

  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <section
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900"
        aria-labelledby="checker-heading"
      >
        <div className="mb-6 space-y-2">
          <h2
            id="checker-heading"
            className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
          >
            Check a message
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Paste the message exactly as you received it. Nothing you enter is
            saved.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="message-channel"
              className="block text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              Message type
            </label>
            <select
              id="message-channel"
              value={channel}
              onChange={(event) => setChannel(event.target.value as Channel)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:focus-visible:outline-emerald-400"
            >
              {CHANNEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <label
                htmlFor="message-text"
                className="block text-sm font-medium text-slate-900 dark:text-slate-100"
              >
                Suspicious message
              </label>
              <span
                id="message-count"
                aria-live="polite"
                aria-atomic="true"
                className="text-xs tabular-nums text-slate-500 dark:text-slate-400"
              >
                {message.length.toLocaleString("en-NZ")} /{" "}
                {MAX_MESSAGE_LENGTH.toLocaleString("en-NZ")}
              </span>
            </div>
            <textarea
              id="message-text"
              aria-describedby="message-limit message-count"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setResult(null);
              }}
              required
              maxLength={MAX_MESSAGE_LENGTH}
              rows={12}
              placeholder="Paste the message here…"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 leading-6 text-slate-950 shadow-sm placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus-visible:outline-emerald-400"
            />
            <p
              id="message-limit"
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              Maximum 5,000 characters.
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white shadow-sm hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:bg-emerald-600 dark:text-slate-950 dark:hover:bg-emerald-500 dark:focus-visible:outline-emerald-400 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
          >
            Check message
          </button>
        </form>
      </section>

      <section
        className="min-h-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900"
        aria-live="polite"
        aria-atomic="true"
        aria-labelledby="results-heading"
      >
        <h2
          id="results-heading"
          className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white"
        >
          Results
        </h2>

        {result ? (
          <div className="mt-5 space-y-7">
            <div
              className={`rounded-xl border p-4 ${RISK_STYLES[result.riskLevel]}`}
            >
              <p className="text-sm font-semibold tracking-wide uppercase">
                Risk level: {result.riskLevel}
              </p>
              <p className="mt-1 text-3xl font-bold">
                {result.riskScore}
                <span className="text-base font-medium"> / 100</span>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                Detected warning signs
              </h3>
              {result.signals.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {result.signals.map((signal) => (
                    <li
                      key={signal.code}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-semibold text-slate-950 dark:text-white">
                          {signal.title}
                        </h4>
                        <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400">
                          Severity: {signal.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                        {signal.explanation}
                      </p>
                      {signal.evidence.length > 0 ? (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            Matched evidence
                          </p>
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                            {signal.evidence.map((evidence) => (
                              <li key={evidence} className="break-words">
                                {evidence}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  No warning signals were detected by the current checks.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                Recommended actions
              </h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
                {result.recommendedActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>

            <p className="border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-500">
              Analysis engine version {result.engineVersion}
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Ready when you are
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Choose the message type, paste the message, and select Check
              message to see its warning signs and recommended next steps.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
