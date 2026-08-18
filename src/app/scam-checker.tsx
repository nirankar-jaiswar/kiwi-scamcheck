"use client";

import { useState } from "react";

import { analyseMessage } from "@kiwi-scamcheck/scam-engine";

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
  low: "border-emerald-200 bg-emerald-50 text-emerald-950",
  medium: "border-amber-200 bg-amber-50 text-amber-950",
  high: "border-red-200 bg-red-50 text-red-950",
  critical: "border-red-300 bg-red-100 text-red-950",
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
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        aria-labelledby="checker-heading"
      >
        <div className="mb-6 space-y-2">
          <h2
            id="checker-heading"
            className="text-2xl font-semibold tracking-tight text-slate-950"
          >
            Check a message
          </h2>
          <p className="text-sm leading-6 text-slate-600">
            Paste the message exactly as you received it. Nothing you enter is
            saved.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="message-channel"
              className="block text-sm font-medium text-slate-900"
            >
              Message type
            </label>
            <select
              id="message-channel"
              value={channel}
              onChange={(event) => setChannel(event.target.value as Channel)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-950 shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              {CHANNEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message-text"
              className="block text-sm font-medium text-slate-900"
            >
              Suspicious message
            </label>
            <textarea
              id="message-text"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setResult(null);
              }}
              required
              rows={12}
              placeholder="Paste the message here…"
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 leading-6 text-slate-950 shadow-sm placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white shadow-sm hover:bg-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
          >
            Check message
          </button>
        </form>
      </section>

      <section
        className="min-h-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
        aria-live="polite"
        aria-atomic="true"
        aria-labelledby="results-heading"
      >
        <h2
          id="results-heading"
          className="text-2xl font-semibold tracking-tight text-slate-950"
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
              <h3 className="text-lg font-semibold text-slate-950">
                Detected warning signs
              </h3>
              {result.signals.length > 0 ? (
                <ul className="mt-3 space-y-3">
                  {result.signals.map((signal) => (
                    <li
                      key={signal.code}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className="font-semibold text-slate-950">
                          {signal.title}
                        </h4>
                        <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
                          Severity: {signal.severity}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {signal.explanation}
                      </p>
                      {signal.evidence.length > 0 ? (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-slate-900">
                            Matched evidence
                          </p>
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700">
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
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  No warning signals were detected by the current checks.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-950">
                Recommended actions
              </h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                {result.recommendedActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </div>

            <p className="border-t border-slate-200 pt-4 text-xs text-slate-500">
              Analysis engine version {result.engineVersion}
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
            <h3 className="font-semibold text-slate-900">Ready when you are</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Choose the message type, paste the message, and select Check
              message to see its warning signs and recommended next steps.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
